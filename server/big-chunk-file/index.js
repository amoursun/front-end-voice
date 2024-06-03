/**
 * 文件上传使用 multiparty 库
 * 文件读写使用 fs-extra库
 */
const express = require('express');  
const bodyParser = require('body-parser');
const multiparty = require('multiparty');  
const path = require('path');  
const fse = require('fs-extra');  
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

function createDir(path) {
    // 判断当前文件的切片目录是否存在
    if (!fse.existsSync(path)) {
        // 创建切片目录
        fse.mkdirSync(path)
    }
}
// 上传的切片文件的存储路径
const UPLOAD_CHUNKS_PATH = path.resolve(__dirname, 'chunks');
createDir(UPLOAD_CHUNKS_PATH);
// 切片合并完成后的文件存储路径
const UPLOAD_FILE_PATH = path.resolve(__dirname, 'files');
createDir(UPLOAD_FILE_PATH);

function sendAllowCors(res, data) {
    // res.set({
    //     // 'Content-Type': 'text/event-stream',
    //     // 'Cache-Control': 'no-cache',
    //     // 'Connection': 'keep-alive',
    //     // 'Access-Control-Allow-Credentials': 'true', // 允许发cookie
    //     // 'Access-Control-Allow-Origin': '*', // 允许跨域
    //     // 'Set-Cookie': 'test=123; path=/; domain=127.0.0.1; HttpOnly',
    //     // 'Content-Language': 'utf-8',
    // });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(data);
    // 刷新请求头
    res.flushHeaders();
}
/**
 * 文件上传接口
 */
app.post('/upload', async (req, res) => {
    const multipartyForm = new multiparty.Form();
    multipartyForm.parse(req, async (err, fields, files) => {
        if (err) {
            sendAllowCors(res, {
                status: 203,
                message: '文件切片上传失败',
            });
            return;
        }
        // 前端发送的切片文件信息
        const [file] = files.file;
        // 前端发送的完整文件名 fileName 和分片名 chunkName
        const {
            filename: [filename],
            index: [index],
        } = fields;
        
        // 当前文件的切片存储路径（将文件名作为切片的目录名）
        const chunksPath = path.resolve(UPLOAD_CHUNKS_PATH, filename)
        
        // 判断当前文件的切片目录是否存在
        createDir(chunksPath);
        // 将前端发送的切片文件移动到切片目录中
        await fse.move(file.path, `${chunksPath}/${index}`, {overwrite: true}, (err) => {
            if (err) {
                sendAllowCors(res, {
                    status: 203,
                    message: err,
                });
                return;
            }
            console.log('File successfully moved!!'); 
        });
        sendAllowCors(res, {
            status: 200,
            data: {
                index: Number(index),
            },
            message: '切片上传成功',
        });
    });
});

/**
 * 合并切片接口
 *
 */
app.post('/merge', async (req, res) => {
    // 获取前端发送的参数
    const {size, fileName} = req.body;
    // 当前文件切片合并成功后的文件存储路径
    const uploadedFile = path.resolve(UPLOAD_FILE_PATH, fileName);
    // 找到当前文件所有切片的存储目录路径
    const chunksPath = path.resolve(UPLOAD_CHUNKS_PATH, fileName);
    // 读取所有的切片文件，获取到文件名
    const chunksName = await fse.readdir(chunksPath);
    // 对切片文件名按照数字大小排序
    chunksName.sort((a, b) => a - b)
    // 合并切片
    const unlinkResult = chunksName.map((name, index) => {
        // 获取每一个切片路径
        const chunkPath = path.resolve(chunksPath, name)
        // 获取要读取切片文件内容
        const readChunk = fse.createReadStream(chunkPath)
        // 获取要写入切片文件配置
        const writeChunk = fse.createWriteStream(uploadedFile, {
            start: index * size,
            end: (index + 1) * size,
        })
        // 将读取到的 readChunk 内容写入到 writeChunk 对应位置
        readChunk.pipe(writeChunk)

        return new Promise(resolve => {
            // 文件读取结束后删除切片文件(必须要将文件全部删除后，才能外层文件夹)
            readChunk.on('end', () => {
                fse.unlinkSync(chunkPath)
                resolve()
            });
        })
    })
    // 等到所有切片文件合并完成，且每一个切片文件都删除成功
    await Promise.all(unlinkResult)

    // 读取所有的切片文件，获取到文件名
    const chunksNameTemp = await fse.readdir(chunksPath)
    if (chunksNameTemp.length === 0) {
        // 删除切片文件所在目录
        fse.rmdirSync(chunksPath);
        sendAllowCors(res, {
            status: 200,
            message: '文件上传成功',
        });
    }
})

/**
 * 校验文件接口
 */
app.post('/verify', async (req, res) => {
    // 获取前端发送的文件名
    const { fileName } = req.body
    // 获取当前文件路径（如果上传成功过的保存路径）
    const filePath = path.resolve(UPLOAD_FILE_PATH, fileName)
    // 判断文件是否存在
    if (fse.existsSync(filePath)) {
        sendAllowCors(res, {
            status: 200,
            data: {
                uploadedType: 'all',
            },
            message: '文件已存在，不需要重新上传',
        });
        return
    }
    // 断点续传：判断文件是否有上传的一部分切片内容
    // 获取该文件的切片文件的存储目录
    const chunksPath = path.resolve(UPLOAD_CHUNKS_PATH, fileName);
    // 判断该目录是否存在
    if (fse.existsSync(chunksPath)) {
        // 目录存在，则说明文件之前有上传过一部分，但是没有完整上传成功
        // 读取之前已上传的所有切片文件名
        const uploaded = await fse.readdir(chunksPath);
        sendAllowCors(res, {
            status: 200,
            data: {
                uploadedType: 'part',
                uploaded: uploaded.map(item => Number(item)),
            },
            message: '该文件有部分上传数据',
        });
        return;
    }
    sendAllowCors(res, {
        status: 200,
        data: {
            uploadedType: 'none',
            uploaded: [],
        },
        message: '文件未上传过',
    });
});

const port = 3002;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});