const express = require('express');  
const multer = require('multer');  
const path = require('path');  
const fs = require('fs');  
const cors = require('cors');
const {createFolder, deleteFile} = require('./utils');

// 设置上传文件的临时存储目录
const uploadsDir = path.join(__dirname, '/uploads/');  
createFolder(uploadsDir);
const upload = multer({dest: uploadsDir});
function getFilename(dir, name) {
    return path.join(__dirname, dir, name);  
}

// 访问静态服务
// // 使用express.static中间件，并传入一个目录路径
// app.use(express.static('public'));
// 使用express.static中间件，并传入一个目录路径和一个虚拟路径前缀
// app.use('/static', express.static('public'));

const app = express();  
app.use(cors({
    origin: '*', // 指定允许的来源，'*'表示接受所有域名的请求
    optionsSuccessStatus: 204,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 指定允许的请求方法
    allowedHeaders: 'X-Requested-With,Content-Type', // 指定允许的请求头
    credentials: true // 指定是否允许发送Cookie
}));
// 或下面这种写法
/**
 *  Accept：指定客户端能够处理的内容类型。
    Accept-Language：指定客户端偏好的自然语言。
    Content-Language：指定请求或响应实体的自然语言。
    Content-Type：指定请求或响应实体的媒体类型。
    DNT (Do Not Track)：指示客户端不希望被跟踪。
    Origin：指示请求的源（协议、域名和端口）。
    User-Agent：包含发起请求的用户代理的信息。
    Referer：指示当前请求的源 URL。
    Content-type: application/x-www-form-urlencoded | multipart/form-data |  text/plain
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,DELETE,PATCH'
    
    如果客户端需要支持额外的请求那么我们需要在客户端支持
    'Access-Control-Allow-Headers','Content-Type' //支持application/json
 */
// app.use('*', (req,res,next) => {
//     // 'Access-Control-Allow-Credentials': true, //允许后端发送cookie
//     // 'Access-Control-Allow-Origin': req.headers.origin || '*', //任意域名都可以访问,或者基于我请求头里面的域
//     // 'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', //设置请求头格式和类型
//     // 'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',//允许支持的请求方式
//     // 'Content-Type': 'application/json; charset=utf-8'//默认与允许的文本格式json和编码格式
//     res.set({
//         // 'Content-Type': 'text/event-stream',
//         // 'Cache-Control': 'no-cache',
//         // 'Connection': 'keep-alive',
//         'Access-Control-Allow-Credentials': 'true', // 允许发cookie
//         'Access-Control-Allow-Origin': '*', // 允许跨域
//         'Set-Cookie': 'test=123; path=/; domain=127.0.0.1; HttpOnly',
//         'Content-Language': 'utf-8',
//         'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,DELETE,PATCH',
//     });
//     // res.setHeader('Access-Control-Allow-Origin','http://localhost:5500') //允许localhost 5500 访问
//     req.method === 'OPTIONS' ? res.status(204).end() : next(); // 预检请求快速返回 
// });

// app.get('/', (req, res) => {
//     res.send({message: 'Hello World!'});
// });
// 设置上传路由

// 统一处理 res.send 的中间件
function unifiedResponseMiddleware(req, res, next) {
    // 保存原始的 send 方法
    const originalSend = res.send;
    // 重写 send 方法
    res.send = function (body) {
        // 设置默认的响应格式，可以根据需要调整
        let response = {
            code: 200,
            message: body.message, // 可以根据状态码调整消息内容
            data: body,
        };
        // 判断 data 是否为 Error 对象
        if (body instanceof Error) {
            response = {
                code: 203,
                data: body,
                message: body.message,
                error: {
                    message: body.message,
                }
            };
        }

        // 调用原始的 send 方法发送响应
        originalSend.call(this, JSON.stringify(response));
    };
    // 继续处理下一个中间件或路由
    next();
}
app.use(unifiedResponseMiddleware)


const chunkCache = {};
app.post('/api/file/upload', upload.single('files'), async (req, res) => {
    const { file } = req;  
    const { 
        filename,
        index: chunkIndex,
        chunkLength: totalChunks,
        hash
    } = req.body;
    const total = Number(totalChunks);
    const chunksDir = getFilename('chunks', filename);
    chunkCache[chunksDir] = (chunkCache[chunksDir] || 0) + 1;
    const finalFile = getFilename('merged', filename);
    const chunkName = `${chunkIndex}-${hash}.chunk`;
    // 确保chunks目录存在 
    createFolder(chunksDir);
    // 保存切片到对应的文件  
    const chunkPath = path.join(chunksDir, chunkName);  
    fs.copyFileSync(file.path, chunkPath); // 将临时文件复制到最终位置
    // 删除临时文件
    deleteFile(file.path);
    // 检查所有切片是否都已上传  
    // let allChunksUploaded = false;  
    // for (let i = 0; i < total; i++) {  
    //     if (!fs.existsSync(path.join(chunksDir, chunkName))) { 
    //         // allChunksUploaded = false;
    //         break;  
    //     }  
    // }
    // allChunksUploaded
    if (chunkCache[chunksDir] === total) {  
        await mergeChunks(chunksDir, finalFile); // 合并切片 
        res.send({message: `文件 ${filename} 上传完成`});  
        // 清理chunks目录  
        fs.rmSync(chunksDir, { recursive: true });  
    }
    else {  
        res.send({message: `${filename} 的 第${chunkIndex}切片已经上传完成，等待其他切片！`});
        // res.send(new Error(`${filename} 的 第${chunkIndex}切片已经上传完成，等待其他切片！`));
    }
    // 刷新请求头(立即发送事件流的头部): 浏览器将等待完整的HTTP头部才能开始处理数据
    res.flushHeaders();
}); 


const pipeStream = (path, writeStream) => {
    return new Promise(resolve => {
        const readStream = fs.createReadStream(path);
        readStream.on('end', () => {
            // 删除已合并的切片文件
            fs.unlinkSync(path);
            resolve();
        });
        // 不在读取流结束时关闭写入流
        readStream.pipe(writeStream, {end: false});
    });
}
// 合并切片函数  
async function mergeChunks(
    chunksDir,
    finalFile,
) {  
    return new Promise(async (resolve, reject) => {
        const writeStream = fs.createWriteStream(finalFile);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        // 获取切片文件夹里所有切片
        const chunkPaths = fs.readdirSync(chunksDir);
        // 读取并合并所有切片到最终文件  
        for (let i = 0; i < chunkPaths.length; i++) {
            const chunkName = chunkPaths[i];
            const chunkPath = path.join(chunksDir, chunkName);
            await pipeStream(chunkPath, writeStream);
        }
        // 所有切片都已管道传输后结束写入流
        writeStream.end();
    });
}

app.listen(3001, () => {
    console.log('Server is running on port http://localhost:3001');
});