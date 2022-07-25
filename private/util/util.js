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

exports.updateValuesToString = (keys, oldValues, newValues) => {
    let result = '';
    for(let i = 0; i < keys.length; ++i){
        result += keys[i] + ' from ' + oldValues[i] + ' to ' + newValues[i] + '\n';
    }
    return result;
}