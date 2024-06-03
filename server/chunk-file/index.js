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

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
// 设置上传路由  
app.post('/api/file/upload', upload.single('files'), async (req, res) => {
    const { file } = req;  
    const { 
        filename,
        index: chunkIndex,
        chunkNum: totalChunks,
        hash
    } = req.body;  
    const chunksDir = getFilename('chunks', filename);
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
    let allChunksUploaded = true;  
    for (let i = 0; i < totalChunks; i++) {  
        if (!fs.existsSync(path.join(chunksDir, chunkName))) { 
            allChunksUploaded = false;  
            break;  
        }  
    }
    res.set({
        // 'Content-Type': 'text/event-stream',
        // 'Cache-Control': 'no-cache',
        // 'Connection': 'keep-alive',
        'Access-Control-Allow-Credentials': 'true', // 允许发cookie
        'Access-Control-Allow-Origin': '*', // 允许跨域
        'Set-Cookie': 'test=123; path=/; domain=127.0.0.1; HttpOnly',
        'Content-Language': 'utf-8',
    });
    if (allChunksUploaded) {  
        await mergeChunks(chunksDir, finalFile, chunkName); // 合并切片 
        res.send(`文件 ${filename} 上传完成`);  
        // 清理chunks目录  
        fs.rmdirSync(chunksDir, { recursive: true });  
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