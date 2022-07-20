import { applyTheme } from "../Theme/initTheme";
import { load } from "./loadMonaco";
let loadResult: undefined | ReturnType<typeof load> = undefined;

export const getMonaco = async (...args: Parameters<typeof load>) => {
    if (loadResult) return loadResult;
    // 第一次初始化 Monaco
    loadResult = load(...args);
    await loadResult;
    await applyTheme("github-dark");

    return loadResult;
};
