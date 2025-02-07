import http from '../http';

// 用户待办任务列表
export const getTodoTask = () => {
    return http.get<Record<string, any>>(
        '/duxuetang/rs/todoTask/list'
    );
};

// 添加埋点
export const addBehavior = (params: Record<string, any>) => {
    Object.assign(params, {
        clickId: new Date().getTime(), // 唯一标识，必传
        operateTime: new Date().getTime(), // 当前毫秒，必传
    });
    return http.post('/duxuetang/rs/click/save', params);
};
