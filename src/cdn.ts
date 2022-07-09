/* CDN */
export const CDN = {
    __monacoCDN__:
        "https://fastly.jsdelivr.net/npm/@codingame/monaco-editor/min/vs",
};
export type Monaco = Awaited<typeof import("@codingame/monaco-editor")>;
declare global {
    let monaco: Monaco;
}
