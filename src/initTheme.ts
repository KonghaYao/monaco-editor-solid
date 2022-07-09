import { wrapper } from "./getMonaco";
export const AllThemes = [
    {
        name: "github-light",
        url: "https://fastly.jsdelivr.net/npm/github-vscode-themes/dist/light.json",
    },

    {
        name: "github-dark",
        url: "https://fastly.jsdelivr.net/npm/github-vscode-themes/dist/dark.json",
    },
];

const themeList = new Map<string, { url: string; loaded?: boolean }>(
    AllThemes.map((i) => {
        return [i.name, i];
    })
);
/** 全局使用 Theme */
export const applyTheme = async (name: string) => {
    if (themeList.has(name)) {
        const { url, loaded } = themeList.get(name)!;
        if (!loaded) {
            await wrapper.defineVSCodeTheme(name, () => {
                return fetch(url).then((res) => res.json());
            });
        }
    }
    monaco.editor.setTheme(name);
    console.log("MonacoEditor 应用样式 " + name);
};
