const Model = require('../models/models')
const json2html = require("node-json2html");
const templates = require("../templates/model.template");
const ejs = require("ejs");
const upload = require("../middleware/upload");
const fs = require("fs");
const multer = require("multer");

exports.findAll = (req, res) => {
    Model.find((err, models) => {
        if(err) {
            res.status(500).send('databese error')
        }
        else {
            let html = json2html.render(models, templates.listmodeltemplate)
            res.render('models', {
                models: ejs.render(html)
            });
        }
    })
}

exports.create = (req, res) => {
    try {
        console.log(req.file)
        //upload(req, res);
        if (req.file === undefined) {
            return res.redirect('/createmodel');
        }
        let model = new Model()
        model.entity = "a-entity"
        model.fname = req.file.originalname
        model.positionx = parseFloat(req.body.positionx)
        model.positiony = parseFloat(req.body.positiony)
        model.positionz = parseFloat(req.body.positionz)
        model.rotationx = parseFloat(req.body.rotationx)
        model.rotationy = parseFloat(req.body.rotationy)
        model.rotationz = parseFloat(req.body.rotationz)
        model.scale = parseFloat(req.body.scale)
        model.save((err, modelCreated) => {
            if (err) {
                res.status(412).send('Failed')
            } else {
                res.redirect('/models')
            }
        })
    } catch (err) {
        `Could not upload the file: ${req.file.originalname}. ${err}`
    }
}

exports.findById = (req, res) => {
    Model.findById(req.params.id, (err, model) => {
        if(err) {
            res.status(404).send('not found')
        } else {
            res.status(200).json(model)
        }
    })
}

exports.update = (req, res) => {
    Model.findById(req.params.id, (err, model) => {
        if(err) {
            res.status(404).send('not found')
        } else {
            model.positionx = parseFloat(req.body.positionx)
            model.positiony = parseFloat(req.body.positiony)
            model.positionz = parseFloat(req.body.positionz)
            model.rotationx = parseFloat(req.body.rotationx)
            model.rotationy = parseFloat(req.body.rotationy)
            model.rotationz = parseFloat(req.body.rotationz)
            model.scale = parseFloat(req.body.scale)
            model.save((err, modelUpdated) => {
                if(err) {
                    res.status(412).send('failed')
                } else {
                    res.redirect('/models');
                }
            })
        }
    })
}

exports.delete = (req, res) => {
    Model.findByIdAndDelete(req.params.id, (err, model) => {
        if(err) {
            res.status(404).send('not found')
        } else {
            try {
                fs.unlinkSync('./public/resources/uploads/' + req.body.fname)
                //file removed
            } catch(err) {
                console.error(err)
            }
            res.redirect('/models')
        }
    })
}

exports.createModel = (req, res) => {
    res.render('createModelView');
}