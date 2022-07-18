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
    .get(ifNotLoggedIn, indexController.redirect)

router.route('/login')
    .get(ifLoggedIn, userController.login)
    .post(ifLoggedIn, userController.check)

router.route('/register')
    .get(ifLoggedIn, userController.register)
    .post(ifLoggedIn, userController.createUser)

router.route('/logout')
    .get(userController.logout)

router.route('/users')
    .get(ifNotLoggedIn, userController.findAll)

router.route('/delete/:id')
    .post(ifNotLoggedIn, showroomController.delete)

router.route('/showroom/:id/edit')
    .get(ifNotLoggedIn, showroomController.showroomView)
    .post(ifNotLoggedIn, showroomController.addObject)

router.route('/upload')
    .post(ifNotLoggedIn, multer.upload.single("gltffile") , showroomController.upload)

router.route('/showroom/:id')
    .get(ifNotLoggedIn, showroomController.showScene)

router.route('/showrooms')
    .get(ifNotLoggedIn, showroomController.findAllShowrooms)
    .post(ifNotLoggedIn, showroomController.newShowroom)

module.exports = router