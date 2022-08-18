const router = require('express').Router()

const indexController = require('../controllers/index.controller')
const showroomController = require('../controllers/showroom.controller')
const userController = require('../controllers/user.controller')
const multer = require('../middleware/upload')

// Function to check if user is logged in, if not redirect to login page
const ifNotLoggedIn = (req, res, next) => {
    if(!req.session.loggedin){
        return res.redirect('/login');
    }
    next();
}

// Function to check if user is logged in, if so redirect to /showroom
const ifLoggedIn = (req, res, next) => {
    if(req.session.loggedin){
        return res.redirect('/showrooms');
    }
    next();
}

router.route('/')
    .get(ifNotLoggedIn, indexController.redirectToShowrooms)

router.route('/login')
    .get(ifLoggedIn, userController.login)
    .post(ifLoggedIn, userController.check)

router.route('/register')
    .get(ifLoggedIn, userController.register)
    .post(ifLoggedIn, userController.createUser)

router.route('/logout')
    .get(userController.logout)

router.route('/showrooms')
    .get(ifNotLoggedIn, showroomController.findAllShowrooms)
    .post(ifNotLoggedIn, showroomController.newShowroom)

router.route('/delete/:id')
    .post(ifNotLoggedIn, showroomController.delete)

router.route('/deletemodel/:filename')
    .post(ifNotLoggedIn, showroomController.deleteModel)

router.route('/rename/:id')
    .get(ifNotLoggedIn, showroomController.renameShowroomView)

router.route('/object/:id')
    .post(ifNotLoggedIn, showroomController.addObject)

router.route('/vr/:id')
    .get(ifNotLoggedIn, showroomController.showVR)

router.route('/upload')
    .post(ifNotLoggedIn, multer.upload.single("gltffile") , showroomController.upload)

router.route('/showroom/:id')
    .get(ifNotLoggedIn, showroomController.showScene)
    .post(ifNotLoggedIn, showroomController.renameShowroom)


module.exports = router