const router = require('express').Router()

const modelcontroller = require('../controllers/models.controller')
const indexcontroller = require('../controllers/index.controller')
const showroomcontroller = require('../controllers/showroom.controller')
const usercontroller = require('../controllers/user.controller')
const multer = require("multer");

const multerstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/resources/uploads/' + req.session.email )
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

let upload = multer({
    storage: multerstorage,
    //limits: {fileSize: 2*1024*1024},
})

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.loggedin){
        return res.redirect('/login');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.loggedin){
        return res.redirect('/');
    }
    next();
}

router.route('/')
    .get(ifNotLoggedin, indexcontroller.listAll)

router.route('/login')
    .get(usercontroller.login)
    .post(usercontroller.check)

router.route('/register')
    .get(usercontroller.register)
    .post(usercontroller.createuser)

router.route('/logout')
    .get(usercontroller.logout)

router.route('/users')
    .get(usercontroller.findAll)

router.route('/models')
    .get(modelcontroller.findAll)
    .post(upload.single("gltffile"), modelcontroller.create)

router.route('/models/:id')
    .get(modelcontroller.findById)
    .post(modelcontroller.update)

router.route('/createmodel')
    .get(modelcontroller.createModel)

router.route('/delete/:id')
    .post(modelcontroller.delete)

router.route('/showroom/:id')
    .get(showroomcontroller.findById)

router.route('/showroom')
    .get(showroomcontroller.findAll)

module.exports = router