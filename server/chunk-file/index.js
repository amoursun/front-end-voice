const express = require('express');  
const multer = require('multer');  
const path = require('path');  
const fs = require('fs');  
const cors = require('cors');

// 设置上传文件的临时存储目录
const upload = multer({dest: './uploads/'});
function getFilename(dir, name) {
    return path.join(__dirname, dir, name);  
}

const app = express();  
app.use(cors());

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
app.use('*',(req,res,next)=>{
    res.set({
        // 'Content-Type': 'text/event-stream',
        // 'Cache-Control': 'no-cache',
        // 'Connection': 'keep-alive',
        'Access-Control-Allow-Credentials': 'true', // 允许发cookie
        'Access-Control-Allow-Origin': '*', // 允许跨域
        'Set-Cookie': 'test=123; path=/; domain=127.0.0.1; HttpOnly',
        'Content-Language': 'utf-8',
    });
    // res.setHeader('Access-Control-Allow-Origin','http://localhost:5500') //允许localhost 5500 访问
    next()
});


// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
// 设置上传路由
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
    if (!fs.existsSync(chunksDir)) {  
        fs.mkdirSync(chunksDir, { recursive: true });  
    }
    // 保存切片到对应的文件  
    const chunkPath = path.join(chunksDir, chunkName);  
    fs.copyFileSync(file.path, chunkPath); // 将临时文件复制到最终位置  
    // 检查所有切片是否都已上传  
    // let allChunksUploaded = false;  
    for (let i = 0; i < total; i++) {  
        if (!fs.existsSync(path.join(chunksDir, chunkName))) { 
            // allChunksUploaded = false;
            break;  
        }  
    }
    // allChunksUploaded
    if (chunkCache[chunksDir] === total) {  
        await mergeChunks(chunksDir, finalFile, chunkName); // 合并切片 
        res.send(`文件 ${filename} 上传完成`);  
        // 清理chunks目录  
        fs.rmSync(chunksDir, { recursive: true });  
    }
    else {  
        res.send(`${filename} 的 第${chunkIndex}切片已经上传完成，等待其他切片！`);  
    }
    // 刷新请求头(立即发送事件流的头部): 浏览器将等待完整的HTTP头部才能开始处理数据
    res.flushHeaders();
}); 
// 合并切片函数  
async function mergeChunks(
    chunksDir, 
    finalFile,
    chunkName
) {  
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(finalFile);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        // 读取并合并所有切片到最终文件  
        for (let i = 0; i < fs.readdirSync(chunksDir).length; i++) {
            const chunkPath = path.join(chunksDir, chunkName);
            const readStream = fs.createReadStream(chunkPath);
            // 不在读取流结束时关闭写入流
            readStream.pipe(writeStream, { end: false });
            readStream.on('end', () => {
                // 删除已合并的切片文件
                fs.unlinkSync(chunkPath);
            });
        }
        // 所有切片都已管道传输后结束写入流
        writeStream.end();
    });
}

app.listen(3001, () => {
    console.log('Server is running on port http://localhost:3001');
});