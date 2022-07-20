const showroomSchema = require('../models/showroom')
const mongoose = require("mongoose")
const util = require("../util/util")
const json2html = require("node-json2html")
const ejs = require("ejs")
const modelTemplate = require("../templates/model.template")
const inventoryTemplate = require("../templates/inventory.template")
const showroomTemplate = require("../templates/showroom.template")

// response edit-view of a showroom
exports.showroomView = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema)
    Showroom.findById(req.params.id, (err, showroom) => {
        if(err) {
            return res.status(404).send('not found')
        }
        const files = util.getFilesByEmail(req.session.email)
        const modelsHtml = json2html.render(showroom.objects, modelTemplate.listModelTemplate)
        const selectionHtml = json2html.render(files, inventoryTemplate.selection)
        res.render('models', {
            models: ejs.render(modelsHtml),
            selection: ejs.render(selectionHtml),
            id : req.params.id
        })
    })
}

exports.findAllShowrooms = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema);
    Showroom.find((err, showrooms) => {
        if (err) {
            return res.status(500).send('Database error')
        }
        const files = util.getFilesByEmail(req.session.email)
        const showroomsHtml = json2html.render(showrooms, showroomTemplate.listShowrooms)
        const inventoryHtml = json2html.render(files, inventoryTemplate.listModels)
        const message = req.query.glbalert === '1' ? '<p class="alert">Only glb files allowed</p>' : '<br>'
        res.render('showrooms', {
            showrooms: ejs.render(showroomsHtml),
            inventory: ejs.render(inventoryHtml),
            glbalert: ejs.render(message)
        });
    })
}

exports.addObject = (req, res) =>{
    const userEmail = req.session.email
    const Showroom = mongoose.model(userEmail, showroomSchema)
    const myId = mongoose.Types.ObjectId();
    const newObject = {
        _id : myId,
        filename : req.body.files,
        modelname : req.body.name,
    }
    Showroom.updateOne(
        {_id : req.params.id},
        { $push: {objects : [newObject] }},
        function (err, _) {
            if(err) {
                console.log("Unable to add Object, error: " + err)
                return res.send(err)
            }
            res.redirect('/showroom/' + req.params.id + '/edit')
        })
}

exports.delete = (req, res) => {
    const userEmail = req.session.email
    const Showroom = mongoose.model(userEmail, showroomSchema)
    Showroom.findByIdAndDelete( req.params.id, (err, _) => {
        if(err) {
           return res.status(404).send("not found")
        }
        res.redirect('/showrooms')
    })
}

exports.showScene = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema)
    Showroom.findById( req.params.id, (err, models) => {
        if (err) {
            return res.status(500).send('database error')
        }
        const result = models.objects
        result.forEach(object => object.filename = req.session.email + '/' + object.filename)
        const modelHtml = json2html.render(result, modelTemplate.aframeModelTemplate)
        res.render('view', {
            useremail : req.session.email,
            showroomid : req.params.id,
            entities : ejs.render(modelHtml)
        });
    })
}

exports.upload = (req, res) => {
    if(req.file !== undefined) {
        return res.redirect('/showrooms')
    }
    res.redirect('/showrooms?glbalert=1')

}

exports.newShowroom = (req, res) => {
    const userEmail = req.session.email
    const Showroom = mongoose.model(userEmail, showroomSchema)
    let newShowroom = new Showroom()
    newShowroom._id = mongoose.Types.ObjectId()
    newShowroom.showroomname = req.body.name
    newShowroom.save((err, _) => {
        if(err) {
            console.error("failed to save new Showroom: " + err)
            return res.status(412).send(err)
        }
        res.redirect('/showrooms')
    })
}
