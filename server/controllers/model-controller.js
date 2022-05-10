const Model = require('../models/3dmodel')

createModel = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'error occurred',
        })
    }

    const model = new Model(body)

    if (!model) {
        return res.status(400).json({ success: false, error: err })
    }

    model
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: model._id,
                message: 'model created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'model not created!',
            })
        })
}

updateModel = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Model.findOne({ _id: req.params.id }, (err, model) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Model not found!',
            })
        }
        model.entity = body.entity
        model.fname = body.fname
        model.positionX = body.positionX
        model.positionY = body.positionY
        model.positionZ = body.positionZ
        model.rotationX = body.rotationX
        model.rotationY = body.rotationY
        model.rotationZ = body.rotationZ
        model.scale = body.scale

        model
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: model._id,
                    message: 'model updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'model not updated!',
                })
            })
    })
}

deleteModel = async (req, res) => {
    await Model.findOneAndDelete({ _id: req.params.id }, (err, model) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!model) {
            return res
                .status(404)
                .json({ success: false, error: `Model not found` })
        }

        return res.status(200).json({ success: true, data: model })
    }).catch(err => console.log(err))
}

getModelById = async (req, res) => {
    await Model.findOne({ _id: req.params.id }, (err, model) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!model) {
            return res
                .status(404)
                .json({ success: false, error: `model not found` })
        }
        return res.status(200).json({ success: true, data: model })
    }).catch(err => console.log(err))
}

getModels = async (req, res) => {
    await Model.find({}, (err, models) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!models.length) {
            return res
                .status(404)
                .json({ success: false, error: `model not found` })
        }
        return res.status(200).json({ success: true, data: models })
    }).catch(err => console.log(err))
}

module.exports = {
    createModel,
    updateModel,
    deleteModel,
    getModels,
    getModelById,
}