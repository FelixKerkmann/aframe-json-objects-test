const router = require('express').Router()

const modelcontroller = require('../controllers/models.controller')
const indexcontroller = require('../controllers/index.controller')
const showroomcontroller = require('../controllers/showroom.controller')
const usercontroller = require('../controllers/user.controller')

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.userID){
        return res.redirect('/login');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.userID){
        return res.redirect('/');
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
    .get(usercontroller.findAll)

router.route('/models')
    .get(modelcontroller.findAll)
    .post(modelcontroller.create)

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