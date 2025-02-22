const fs = require('node:fs');

const createFolder = (folder) => {
    try {
        fs.accessSync(folder);
    }
    catch (err) {
        fs.mkdirSync(folder);
    }
};

const deleteFile = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    };
}

module.exports = {
    createFolder,
    deleteFile,
};