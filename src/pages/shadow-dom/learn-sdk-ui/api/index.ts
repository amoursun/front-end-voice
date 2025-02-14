import http from '../http';

// 用户待办任务列表
export const getTodoTask = () => {
    return http.get<Record<string, any>>(
        '/api/todoTask/list'
    );
};

