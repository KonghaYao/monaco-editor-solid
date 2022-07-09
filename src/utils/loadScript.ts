// 从 url 加载一个 script
export const loadScript = async (url: string) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;

        script.onload = () => {
            resolve(true);
        };
        script.onerror = (e) => {
            reject(e);
        };
        document.body.appendChild(script);
    });
};
