import { applyTheme } from "../Theme/initTheme";
import { load } from "./loadMonaco";
const Loader = {
    loading: false,
    loadResult: undefined as undefined | ReturnType<typeof load>,
    load,
};

export const getMonaco = async (...args: Parameters<typeof load>) => {
    if (Loader.loadResult) return Loader.loadResult;
    // 第一次初始化 Monaco
    Loader.loadResult = Loader.load(...args);
    await Loader.loadResult;
    await applyTheme("github-dark");
    return Loader.loadResult;
};
