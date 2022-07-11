const multer = require("multer");
const util = require("util");
const maxSize = 2*1024*1024
const multerstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/resources/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

module.exports = multerstorage;