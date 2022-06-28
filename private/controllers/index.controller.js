const Model = require('../models/models')
let ejs = require('ejs')
const json2html = require('node-json2html')
const templates = require('../templates/model.template')

exports.listAll = (req, res) => {
    Model.find((err, models) => {
        if(err) {
            res.status(500).send('databese error')
        }
        else {
            console.log(models)
            let html = json2html.render(models, templates.aframemodeltemplate)
            console.log(html)
            res.render('view', {
                entities: ejs.render(html)
            })
        }
    })
}