const showroomSchema = require('../models/showroom')
const mongoose = require("mongoose");
const json2html = require("node-json2html");
const srtemplate = require("../templates/showroom.template");
const ejs = require("ejs");
const mtemplate = require("../templates/model.template");
const invtemplate = require("../templates/inventory.template");
const fs = require("fs")

exports.findById = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema);
    Showroom.findById(req.params.id, (err, showroom) => {
        if(err) {
            res.status(404).send('not found')
        } else {
            let files = []
            const folder = 'public/resources/uploads/' + req.session.email + '/'
            fs.readdirSync(folder).forEach(file => {
                const fileobj = { 'fname' : file}
                const count = files.push(fileobj)
            })
            let selection = json2html.render(files, invtemplate.selection)
            let models = json2html.render(showroom.objects, mtemplate.listmodeltemplate)
            res.render('models', {
                models: ejs.render(models),
                selection: ejs.render(selection),
                id : req.params.id
            });
        }
    })
}

exports.findAll = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema);
    Showroom.find((err, showrooms) => {
        if (err) {
            res.status(500).send('databese error')
        } else {
            let models = []
            const folder = 'public/resources/uploads/' + req.session.email + '/'
            fs.readdirSync(folder).forEach(file => {
                const fileobj = { 'fname' : file}
                const count = models.push(fileobj)
            })
            let srs = json2html.render(showrooms, srtemplate.listshowrooms)
            let inv = json2html.render(models, invtemplate.listmodels)
            res.render('showrooms', {
                showrooms: ejs.render(srs),
                inventory: ejs.render(inv)
            });
        }
    })
}

exports.addObject = (req, res) =>{
    let userEmail = req.session.email
    const Showroom = mongoose.model(userEmail, showroomSchema)
    console.log(req.body)
    let myId = mongoose.Types.ObjectId();
    let newObject = {
        _id : myId,
        fname : "filename",
        mname : req.body.name,
    }
    console.log(newObject)
    Showroom.updateOne(
        {_id : req.params.id},
        { $push: {objects : [newObject] }},
        function (err, result) {
            if(err) {
                console.log(err)
                res.send(err)
            } else {
                res.redirect('/showroom/' + req.params.id)
            }
        })


    /*
    Showroom.updateOne({_id : req.params.id}).exec((err, showroom) => {
        if(err) {
            console.log(err)
        } else if(!showroom) {
            console.log("showroom not found")
        } else {
            console.log(showroom)
            console.log(showroom.objects)
            showroom.objects.push(newObject)
            showroom.save((err, showroomUpdated) => {
                if(err) {
                    console.log(err)
                    res.status(412).send('failed')
                } else {
                    res.redirect('/showroom/' + req.params.id)
                }
            })
        }
    })

     */
}

exports.uploadObject = (req, res) => {
    res.render('createModelView', {
        id : req.params.id
    });
}

exports.delete = (req, res) => {

}