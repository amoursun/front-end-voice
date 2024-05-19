
const accumulateTask = (num: number) => {
    console.time('1');
    let result = 0;
    for (let i = 0; i < num; i++) {
        result += i;
    }
    console.timeEnd('1');
    return result;
};

self.onmessage = function(event) {
    console.log('来自主线程的消息: ', event.data);
    const result = accumulateTask(event.data);
    self.postMessage(result);
};

