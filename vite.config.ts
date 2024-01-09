import solid from "vite-plugin-solid";
import svgLoader from 'vite-svg-loader'
import { defineConfig } from "vite";
import p from './package.json'
export default defineConfig(({ mode }) => {
    console.log(mode)
    return {
        plugins: [

            solid(),
            svgLoader({
                defaultImport: 'component' // or 'raw'
            }),
            {
                name: "232322",
                resolveId: {
                    order: "pre",
                    handler(source, importer, options) {
                        if (mode === 'production' && Object.keys({ ...p.dependencies, ...p.devDependencies, ...p.peerDependencies }).filter(i =>
                            !['@vscode/codicons','vscode-icons-js'].includes(i)
                        ).some(i => source.startsWith(i))) return { id: source, external: true }
                        if (source.endsWith('.wasm')) {
                            return { id: source + '?url' }
                        }
                    }
                },
            },
        ],
        build: {
            lib: {
                entry: "./src/index",
                formats: ['es']
            },
            target: "esnext"
        }

    }
});