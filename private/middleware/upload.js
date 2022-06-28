const multer = require("multer");
const util = require("util");
const maxSize = 2*1024*1024
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/resources/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
let upload = multer({
    storage: storage,
    limits: {fileSize: maxSize},
}).single('gltffile');
module.exports = upload;