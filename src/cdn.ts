export type Monaco = Awaited<typeof import("@codingame/monaco-editor")>;
declare global {
    let monaco: Monaco;
}
