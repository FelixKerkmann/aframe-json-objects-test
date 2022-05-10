const express = require('express')

const ModelController = require('server/controllers/model-controller')

const router = express.Router()

router.post('/model', ModelController.createModel)
router.put('/model/:id', ModelController.updateModel)
router.delete('/model/:id', ModelController.deleteModel)
router.get('/model/:id', ModelController.getModelById)
router.get('/models', ModelController.getModels)

module.exports = router