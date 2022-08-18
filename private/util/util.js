const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

exports.DEBUG_FLAG_UPDATE_DB = 'debug-updateDB';

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

exports.askToThrowExceptionWhenDebuggingFlagIsSet = (flag, text) => {
    if(debugFlagIsSet(flag)){
        if(prompt('Throw ' + text + '?[y|any]') === 'y'){
            throw '[Test] ' + text;
        }
    }
}

debugFlagIsSet = (flag) => {
    return  process.argv.find((element) => {return element === flag}) !== undefined;
}