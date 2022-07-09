// declare namespace globalThis {
//     export let monaco: Awaited<typeof import("monaco-editor")>;
// }
declare module "*.svg" {
    const a: () => SVGViewElement;
    export default a;
}
declare module "*.module.less" {
    const a: any;
    export default a;
}
declare module "*.less" {
    const a: string;
    export default a;
}
