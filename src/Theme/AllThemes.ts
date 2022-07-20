export const AllThemes = [
    {
        name: "github-dark",
        url: "https://fastly.jsdelivr.net/npm/github-vscode-themes/dist/dark.json",
    },
    {
        name: "github-light",
        url: "https://fastly.jsdelivr.net/npm/github-vscode-themes/dist/light.json",
    },

    {
        url: "https://cdn.jsdelivr.net/gh/tinkertrain/panda-syntax-vscode/dist/Panda.json",
        name: "panda",
    },
    {
        url: "https://cdn.jsdelivr.net/gh/akamud/vscode-theme-onedark/themes/OneDark.json",
        name: "one-dark",
    },
    {
        url: "https://cdn.jsdelivr.net/gh/azemoh/vscode-one-monokai/themes/OneMonokai-color-theme.json",
        name: "one-monokai",
    },
] as { name: string; url: string; loaded?: any }[];
