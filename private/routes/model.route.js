const router = require('express').Router()

const modelcontroller = require('../controllers/models.controller')
const indexcontroller = require('../controllers/index.controller')
const showroomcontroller = require('../controllers/showroom.controller')

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

router.route('/')
    .get(indexcontroller.listAll)

router.route('/showroom/:id')
    .get(showroomcontroller.findById)

router.route('/showroom')
    .get(showroomcontroller.findAll)

module.exports = router