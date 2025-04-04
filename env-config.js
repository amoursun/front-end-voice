// 建议总是将前端静态资源按一个整体 serve 出去
// 相应的，流控可以简单配置成 webapp-domain//talent-inventory//* -> frontend-domain/*
// @todo 根据项目情况处置
module.exports = {
    dev: {
        WEB_DEV: false,
        API_CONTEXT: '',
        WEB_CONTEXT: '/talent-inventory/',
    },
    'dev_beta': {
        WEB_DEV: false,
        API_CONTEXT: '',
        WEB_CONTEXT: '/talent-inventory/',
    },
    prd: {
        WEB_DEV: false,
        API_CONTEXT: '',
        WEB_CONTEXT: '/talent-inventory/',
    },
}[process.env.WEBPACK_ENV] || {
    WEB_DEV: true,
    API_CONTEXT: '',
    WEB_CONTEXT: '',
};
