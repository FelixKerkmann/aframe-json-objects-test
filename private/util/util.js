const fs = require('fs');

exports.createDirectoryFromEmail = (email) => {
    const dir = './public/resources/uploads/' + email;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

exports.getFilesByEmail = (email) => {
    let files = []
    const folder = 'public/resources/uploads/' + email + '/'
    fs.readdirSync(folder).forEach(file => {
        const fileObject = { 'filename' : file }
        files.push(fileObject)
    })
    return files
}

exports.updateToString = (name, key, oldValue, newValue) => {
    return '"' + key + '" of "' + name + '" from ' + oldValue + ' to ' + newValue;
}