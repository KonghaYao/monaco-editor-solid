let map: Map<string, string>;
const ready = () => {
    if (map) return;
    const data = monaco.languages.getLanguages();
    map = new Map<string, string>(
        data.flatMap((i) => {
            return (i.extensions || []).map((ext) => [ext, i.id]);
        })
    );
};
export const languageDetection = (path: string) => {
    ready();
    const ext = path.replace(/.*(\.\w+?)$/, "$1");
    return map.get(ext);
};
