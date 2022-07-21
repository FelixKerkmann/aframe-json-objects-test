const mongoose = require("mongoose")
const json2html = require("node-json2html")
const ejs = require("ejs")
const prompt = require("prompt-sync")({ sigint: true });
const util = require("../util/util")
const showroomSchema = require('../models/showroom')
const modelTemplate = require("../templates/model.template")
const inventoryTemplate = require("../templates/inventory.template")
const showroomTemplate = require("../templates/showroom.template")


//REST Functions
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

exports.addObject = (req, res) => {
    const userEmail = req.session.email
    const Showroom = mongoose.model(userEmail, showroomSchema)
    const myId = mongoose.Types.ObjectId();
    const newObject = {
        _id : myId,
        filename : req.body.files,
        modelname : req.body.name,
    }
    Showroom.findOne({_id: req.params.id}, (err, showroom) => {
        if (err) {
            console.log(err)
        }
        const exists = showroom.objects.find(obj => obj.modelname === req.body.name)
        console.log(exists)
        if(exists !== undefined) {
            return res.send('modelname already exists')
        }
        showroom.objects.push(newObject);
        showroom.save((err, _) => {
            if (err) {
                console.error("failed to save new 3DModel: " + err)
                return res.status(412).send(err)
            }
            res.redirect('/showroom/' + req.params.id + '/edit')
        })
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
        const files = util.getFilesByEmail(req.session.email)
        const selectionHtml = json2html.render(files, inventoryTemplate.selection)
        res.render('view', {
            selection: ejs.render(selectionHtml),
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

// Socket Functions
exports.removeModel = (mail, showroom, name) => {
    const Showroom = mongoose.model(mail, showroomSchema);
    let result = null
    Showroom.updateOne({ _id : showroom },
        { $pull: { objects : { modelname : name} } },
        { safe: true}, (err, _) => {
            if(err){
                result = err;
            }
        })
    return result
}

module.exports.updateModel = async function updateModel(mail, showroom, name, key, oldValue, newValue) {
    const Showroom = mongoose.model(mail, showroomSchema);
    let caughtError;

    if(debug()){
        if(prompt('Throw invalid newValue?[y|any]') === 'y'){
            throw '[Test] Invalid newValue';
        }
    }
    if (newValue === null || newValue === undefined) {
        throw 'Value "' + newValue + '" is an invalid value';
    }
    if (key === 'scale' && newValue <= 0) {
        throw "scale must be grater than 0"
    }
    let currentShowroom = await Showroom.findOne({_id: showroom}).catch((error) => {
        caughtError = 'Failed to get showroom for update on ' + mail + ' with showroomId ' + showroom + 'due:\n' + error;
    });
    if(debug()){
        if(prompt('Throw fail to get showroom?[y|any]') === 'y'){
            throw '[Test] Failed to get showroom.';
        }
    }
    if (caughtError) {
        throw caughtError;
    }
    try {
        findObjectAndUpdateAttribute(currentShowroom.objects, name, key, oldValue, newValue);
    } catch (exception) {
        throw 'Failed to update "' + key + '" for object "' + name + '" due:\n' + exception;
    }
    await currentShowroom.save((error, _) => {
        if (error) {
            caughtError = 'Failed to update showroom from "' + mail + '" with showroom ID "' + showroom + '"due:\n' + error;
        }
    });
    if(debug()){
        if(prompt('Throw fail to update showroom?[y|any]') === 'y'){
            throw '[Test] Failed to update showroom.';
        }
    }
    if (caughtError) {
        throw caughtError;
    }

}

function findObjectAndUpdateAttribute(objects, name, key, oldValue, newValue){
    let caughtError;
    let found = false;
    objects.forEach((object) => {
        if(object["modelname"] === name){
            found = true;
            if(object[key] !== oldValue){
                console.warn(typeof object[key] + ' vs ' + typeof oldValue)
                caughtError = 'The old value of "' + key + '" should be ' + oldValue + ' but is ' + object[key] + ' instead.';
                oldValue = object[key]; // Transmit the current value on the database to the client
            }
            object[key] = newValue;
        }
    });

    if(debug()){
        if(prompt('Throw no object with this name?[y|any]') === 'y'){
            throw '[Test] No object with name.';
        }
    }
    if(!found){
        throw 'There is no object with name "' + name + '"';
    }
    if(debug()){
        if(prompt('Throw oldValue is incorrect?[y|any]') === 'y'){
            throw '[Test] Old value is incorrect.';
        }
    }
    if(caughtError){
        throw caughtError;
    }
}

function debug(){
    return  process.argv.find((element) => {return element === "debug-updateDB"}) !== undefined;
}

