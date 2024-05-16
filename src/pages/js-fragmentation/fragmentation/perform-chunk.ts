
export const performChunk = (total: number, ref: React.RefObject<HTMLDivElement | null>) => {
    if (total === 0 || !ref.current) {
        return;
    }
    let i = 0;
    // 开启下一个分片的执行
    function run() {
        // 边界判定
        if (i >= total) {
            return;
        }
        // 一个渲染帧中，空闲时开启分片执行
        requestIdleCallback((idle) => {
            // timeRemaining 表示当前闲置周期的预估剩余毫秒数
            while (idle.timeRemaining() > 0 && i < total) {
                // 分片执行的任务
                const div = document.createElement('div');
                div.innerText = `${i}-内容`;
                ref.current?.appendChild(div);
                i++
            }
            // 此次分片完成
            run()
        })
    }
    run();
}