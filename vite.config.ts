import {defineConfig, UserConfig, Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import workerLoader from 'worker-loader';
import {monacoEditorPlugin} from './vite-plugin/plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    workerLoader(),
    monacoEditorPlugin({
      forceBuildCDN: true,
      globalAPI: true,
      languageWorkers: ['css', 'html', 'json', 'editorWorkerService', 'typescript'],
      customWorkers: [{
        label: 'graphql',
        entry: 'monaco-graphql/dist/graphql.worker',
      }],
    }),
  ],
  server: {
    hmr: true, // 启用热模块替换
    port: 3000, // 设置开发服务器的端口号
    origin: 'http://localhost:3000',
    host: 'localhost', // 设置开发服务器的主机地址
    open: true, // 是否在服务器启动时自动在浏览器中打开应用
    // https: {
    //   // 配置开发服务器的https选项
    //   key: '', // 配置开发服务器的https的key
    //   cert: '', // 配置开发服务器的https的cert
    //   // ca: '', // 配置开发服务器的https的ca
    // },
    cors: true, // 是否启用开发服务器的跨域资源共享
    // 服务器代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:3001', 
        changeOrigin: true, 
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  css: {
    // 对css的行为进行配置
    preprocessorOptions: {
      // key + config key代表预处理器的名
      scss: {
          // 整个的配置对象都会最终给到scss的执行参数（全局参数）中去
          math: 'always',
          globalVars: {
              // 全局变量
              // mainColor: 'red'
          }
      }
    },
    modules: {
      // 配置当前的模块化行为是模块化还是全局化 (有hash就是开启了模块化的一个标志, 因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)
      scopeBehaviour: 'local',
      // 自定义生成哈希名称的规则，例如：更改哈希名称的长度等
      generateScopedName: '[name]_[local]_[hash:base64:5]',
      // generateScopedName: (name, filename, css) => {
      //     // name -> 代表的是你此刻css文件中的类名
      //     // filename -> 是你当前css文件的绝对路径
      //     // css -> 给的就是你当前样式
      //     console.log('name', name, 'filename', filename, 'css', css) // 这一行会输出在哪？？？ 输出在node
      //     // 配置成函数以后, 返回值就决定了他最终显示的类型
      //     return `${name}_${Math.random().toString(36).substr(3, 8)}`
      // },
      // 是对css模块化的默认行为进行覆盖
      // 修改生成的配置对象的key的展示形式(驼峰还是中划线形式)
      localsConvention: 'camelCase',

      // 生成hash会根据类名 + 一些其他的字符串(文件名 + 他内部随机生成一个字符串)去进行生成, 如果想要生成hash更加的独特一点, 可以配置hashPrefix, 配置的这个字符串会参与到最终的hash生成, （hash: 只要字符串有一个字不一样, 那么生成的hash就完全不一样, 但是只要字符串完全一样, 生成的hash就会一样）
      // hashPrefix: "hello",

      // 代表不想参与到css模块化的路径
      // globalModulePaths: ['./component.module.css'], 
    }

  },
} as UserConfig);
