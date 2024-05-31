modules.exports = {
  "compilerOptions": {
    // 允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
    "allowSyntheticDefaultImports": true,

    // 解析非相对模块名的基准目录
    "baseUrl": ".",

    "esModuleInterop": true,

    // 从 tslib 导入辅助工具函数（比如 __extends， __rest等）
    "importHelpers": true,

    // 指定生成哪个模块系统代码
    "module": "esnext",

    // 决定如何处理模块。
    "moduleResolution": "node",

    // 启用所有严格类型检查选项。
    // 启用 --strict相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict，
    // --strictNullChecks和 --strictFunctionTypes和--strictPropertyInitialization。
    "strict": true,
    "noImplicitAny": false, //关闭implicitly has an 'any' type
    // 支持jsx语法
    "jsx": "preserve",
    // 生成相应的 .map文件。
    "sourceMap": true,

    // 忽略所有的声明文件（ *.d.ts）的类型检查。
    "skipLibCheck": true,

    // 指定ECMAScript目标版本
    "target": "esnext",

    // 要包含的类型声明文件名列表
    "types": ["node"],
    "typeRoots": ["../node_modules/@types"],

    "isolatedModules": true,

    // 模块名到基于 baseUrl的路径映射的列表。
    "paths": {
      "@/*": ["src/*"]
    },
    "vueCompilerOptions": {
      "experimentalDisableTemplateSupport": true //去掉volar下el标签红色波浪线问题
    },
    // 编译过程中需要引入的库文件的列表。
    "lib": ["ESNext", "DOM", "DOM.Iterable", "ScriptHost"]
  },
  // 解析的文件
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "src/*.js",
    "src/**/*.jsx",
  ],
  "exclude": ["node_modules"],

  "references": [{
    "path": "./tsconfig.node.json"
  }]
}