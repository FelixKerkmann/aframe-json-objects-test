const router = require('express').Router()

const modelcontroller = require('../controllers/models.controller')
const indexcontroller = require('../controllers/index.controller')
const showroomcontroller = require('../controllers/showroom.controller')
const usercontroller = require('../controllers/user.controller')
const testcontroller = require('../controllers/test.controller')
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
        return res.redirect('/showroom');
    }
    next();
}

router.route('/')
    .get(ifNotLoggedin, indexcontroller.listAll)

router.route('/login')
    .get(ifLoggedin, usercontroller.login)
    .post(ifLoggedin, usercontroller.check)

router.route('/register')
    .get(ifLoggedin, usercontroller.register)
    .post(ifLoggedin, usercontroller.createuser)

router.route('/logout')
    .get(usercontroller.logout)

router.route('/users')
    .get(ifNotLoggedin, usercontroller.findAll)

router.route('/models')
    .get(ifNotLoggedin, modelcontroller.findAll)
    .post(ifNotLoggedin, upload.single("gltffile"), modelcontroller.create)

router.route('/models/:id')
    .get(ifNotLoggedin, modelcontroller.findById)
    .post(ifNotLoggedin, modelcontroller.update)

router.route('/createmodel')
    .get(ifNotLoggedin, modelcontroller.createModel)

router.route('/delete/:id')
    .post(ifNotLoggedin, modelcontroller.delete)

router.route('/showroom/:id')
    .get(ifNotLoggedin, showroomcontroller.findById)

router.route('/showroom')
    .get(ifNotLoggedin, showroomcontroller.findAll)

router.route('/test')
    .get(testcontroller.test)

module.exports = router