import { defineVSCodeTheme } from "@codingame/monaco-editor-wrapper";
import { AllThemes } from "./AllThemes";

/** 全局使用 Theme */
export const applyTheme = async (name: string) => {
    const item = AllThemes.find((i) => i.name === name);
    if (item) {
        const { url, loaded } = item;
        if (!loaded) {
            await defineVSCodeTheme(name, async () => {
                const data = await fetch(url).then((res) => res.json());
                item.loaded = data;
                return data;
            });
        }
    }
    monaco.editor.setTheme(name);
    console.log("MonacoEditor 应用样式 " + name);
};
