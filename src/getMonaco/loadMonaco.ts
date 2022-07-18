import MonacoLoader from "@monaco-editor/loader";
import { loadScript } from "../utils/loadScript";

/** 获取 Monaco 对象，只会进行一次网络请求  */
export const loadMonaco = async (vsCDN: string) => {
    console.log("初始化 monaco");
    MonacoLoader.config({
        paths: {
            vs: vsCDN,
        },
        "vs/nls": {
            availableLanguages: {
                "*": "zh-cn",
            },
        },
    });
    return MonacoLoader.init() as any as Promise<
        typeof import("@codingame/monaco-editor")
    >;
};
export let wrapper: typeof import("@codingame/monaco-editor-wrapper");
export const load = async (
    vsCDN = "https://fastly.jsdelivr.net/npm/@codingame/monaco-editor/min/vs"
) => {
    await Promise.all([
        loadMonaco(vsCDN),
        loadScript(
            "https://cdn.jsdelivr.net/npm/vscode-oniguruma/release/main.js"
        ),
    ]);
    wrapper = await import("@codingame/monaco-editor-wrapper");
    console.log("editor 加载完成");
    await Promise.all([
        // 这些代码需要经过本地编译, 因为 @codingame/monaco-editor-wrapper 项目中的 monaco-editor 指向错误
        import(
            "@codingame/monaco-editor-wrapper/dist/features/jsonContribution"
        ),
        import(
            "@codingame/monaco-editor-wrapper/dist/features/htmlContribution"
        ),
        import(
            "@codingame/monaco-editor-wrapper/dist/features/typescriptContribution"
        ),
        import(
            "@codingame/monaco-editor-wrapper/dist/features/cssContribution"
        ),
        import(
            "@codingame/monaco-editor-wrapper/dist/features/extensionConfigurations"
        ),
    ]);
    console.log("加载插件完成");
    /* @ts-ignore*/
    globalThis.monaco = wrapper.monaco;
    return wrapper.monaco;
};
