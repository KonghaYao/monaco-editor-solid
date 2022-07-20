import { wrapper } from "../getMonaco/loadMonaco";

export const AllThemes = [
    {
        name: "github-light",
        url: "https://fastly.jsdelivr.net/npm/github-vscode-themes/dist/light.json",
    },

    {
        name: "github-dark",
        url: "https://fastly.jsdelivr.net/npm/github-vscode-themes/dist/dark.json",
    },
] as { name: string; url: string; loaded: any }[];

/** 全局使用 Theme */
export const applyTheme = async (name: string) => {
    const item = AllThemes.find((i) => i.name === name);
    if (item) {
        const { url, loaded } = item;
        if (!loaded) {
            await wrapper.defineVSCodeTheme(name, async () => {
                const data = await fetch(url).then((res) => res.json());
                item.loaded = data;
                return data;
            });
        }
    }
    monaco.editor.setTheme(name);
    console.log("MonacoEditor 应用样式 " + name);
};
