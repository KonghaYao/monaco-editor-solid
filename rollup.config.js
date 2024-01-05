import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import fs, { writeFileSync } from "fs-extra";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import analyze from "rollup-plugin-analyzer";

// ! 不要妄想使用 importsmap 导入 @codingame/monaco-editor 或者是其他库，这些库没有后缀名，属于 nodejs 代码文件

fs.emptyDir("./dist/");
// rollup.config.js
export default {
    external: [
        "vscode-icons-js",
        "solid-js",
        "solid-js/web",
        "monaco-editor",
        "@codingame/monaco-editor-wrapper"
    ],
    input: "./src/index.ts",
    output: {
        dir: "./dist/",
        format: "es",
        globals: {
            "vscode-oniguruma": "onig",
        },
        sourcemap: true
    },
    plugins: [
        {
            resolveId(thisFile) {
                if (thisFile.startsWith("https://")) {
                    return false;
                }
                if (thisFile.startsWith('monaco-editor')) return { id: thisFile, external: true }
                if(thisFile.startsWith("@codingame/monaco-editor-wrapper")) return {id:thisFile,external:true}

                if (!/^[[\w:]|\.|\/]/.test(thisFile)) console.log(thisFile);
            },
            load(id) {
                if (id.endsWith("onig.wasm")) {
                    // wasm 转写
                    return `const a ='https://jsdelivr.deno.dev/npm/vscode-oniguruma@1.6.2/release/onig.wasm';
                    export default a`;
                }
            },
        },
        {
            resolveDynamicImport(thisFile, importer) {
                //! 编程语言文件的 CDN
                if (
                    importer.endsWith(
                        "@codingame/monaco-editor-wrapper/dist/main.js"
                    )
                ) {
                    // return {
                    //     external: true,
                    //     id: thisFile
                    //     // id: new URL(
                    //     //     thisFile,
                    //     //     "https://jsdelivr.deno.dev/npm/@codingame/monaco-editor-wrapper@3.9.3/dist/main.js"
                    //     // ).toString(),
                    // };
                }
            },
        },

        nodeResolve({
            browser: true,
            extensions: [".ts", ".tsx", ".js"],
        }),
        commonjs(),
        // 解决 svg 模块问题
        {
            name: "svg",
            async load(id) {
                if (id.endsWith(".svg")) {
                    const code = await fs.promises.readFile(id, "utf8");
                    return {
                        code: `export default ()=>(new DOMParser().parseFromString(${JSON.stringify(
                            code
                        )}, 'image/svg+xml')).firstChild`,
                    };
                }
            },
        },
        postcss({
            inject: true,
            minimize: {},
            modules: {},
            sourceMap: false,
            extensions: [".css", ".less"],
        }),
        babel({
            babelHelpers: "bundled",
            extensions: [".ts", ".tsx", ".js", ".svg"],
            exclude: ["**/@codingame/**/*"],
        }),
        //! 这些代码压不压没有区别。。。
        // terser({}),
        analyze({
            summaryOnly: true,
            writeTo: (str) => writeFileSync("dist/index.analyze.txt", str),
        }),
    ],
};
