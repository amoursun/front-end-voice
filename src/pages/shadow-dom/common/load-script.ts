
export function loadScript(
    scriptUrl: string,
    opts: {
        onLoad?: () => void;
        onError?: (scriptUrl: string) => void;
    } = {}
) {
    const {
        onLoad = () => undefined,
        onError = () => undefined,
    } = opts;


    const script = document.createElement('script');
    script.src = scriptUrl;
    document.head.appendChild(script);

    script.onload = () => {
        console.info(`[TEAM][BOOTSTRAP] 加载成功 ${scriptUrl}`);
        onLoad();
    };

    script.onerror = () => {
        console.error(`[TEAM][BOOTSTRAP] 加载失败 ${scriptUrl}`);
        onError(scriptUrl);
    };
}
