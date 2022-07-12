const showroomSchema = require('../models/showroom')
const mongoose = require("mongoose");
const json2html = require("node-json2html");
const srtemplate = require("../templates/showroom.template");
const ejs = require("ejs");
const mtemplate = require("../templates/model.template");

exports.findById = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema);
    Showroom.findById(req.params.id, (err, showroom) => {
        if(err) {
            res.status(404).send('not found')
        } else {
            console.log(showroom)
            console.log(showroom.objects)
            let html = json2html.render(showroom.objects, mtemplate.listmodeltemplate)
            res.render('models', {
                models: ejs.render(html)
            });
        }
    })
}

exports.findAll = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema);
    Showroom.find((err, showrooms) => {
        if(err) {
            res.status(500).send('databese error')
        }
        else {
            let html = json2html.render(showrooms, srtemplate.listshowrooms)
            res.render('showrooms', {
                showrooms: ejs.render(html)
            });
        }
    })
}