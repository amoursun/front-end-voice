const fs = require('fs-extra');
const path = require('path');
const _exportPath = path.resolve(__dirname, '../src/components');

function toHump(value) {
    return value.toLocaleLowerCase().replace(/-(\w)/g, (all, letter) => {
        return letter.toUpperCase();
    });
}
fs.readdir(_exportPath)
    .then(files => {
        if (Array.isArray(files)) {
            let exportStr = '';
            files.forEach(item => {
                // 检查是否为文件夹且文件夹名称符合大驼峰命名规范且包含index.tsx文件
                // lstatSync: 用于获取文件或文件夹的状态信息，包括文件类型、大小、权限等，它会返回一个 fs.Stats 对象
                //    可以通过这个对象获取文件或文件夹的各种属性。
                //    其对象的一个方法属性isDirectory，可以用于检查指定路径是否为一个文件夹
                // existsSync: 用于检查指定路径的文件或文件夹是否存在。
                //    它会返回一个布尔值，如果文件或文件夹存在则返回 true，否则返回 false
                if (
                    fs.lstatSync(`${_exportPath}/${item}`).isDirectory() &&
                    // /^[A-Z][a-zA-Z]*$/.test(item) &&
                    fs.existsSync(`${_exportPath}/${item}/index.tsx`)
                ) {
                    const itemHump = toHump(item);
                    exportStr = `${exportStr}export { default as ${itemHump} } from './${item}\n';`;
                }
            });
            exportStr += '\n';
            fs.writeFile(`${_exportPath}/index.export.ts`, exportStr);
        }
    })
    .catch(
        err => console.error(err)
    );



