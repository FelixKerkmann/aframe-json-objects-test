const multer = require("multer");
const path = require("path");
const multerstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/resources/uploads/' + req.session.email )
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

exports.upload = multer({
    storage: multerstorage,
    // limits: {fileSize: 50*1024*1024"1024},
    fileFilter: function (req, file, cb) {
        if (path.extname(file.originalname) !== '.glb') {
            return cb(null, false)
        }
        cb(null, true)
    }
})

