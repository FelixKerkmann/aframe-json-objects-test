const mongoose = require("mongoose")
const json2html = require("node-json2html")
const ejs = require("ejs")
const prompt = require("prompt-sync")({ sigint: true });
const util = require("../util/util")
const showroomSchema = require('../models/showroom')
const modelTemplate = require("../templates/model.template")
const inventoryTemplate = require("../templates/inventory.template")
const showroomTemplate = require("../templates/showroom.template")

const DEBUG_FLAG_UPDATE_DB = 'debug-updateDB';
const FLOAT_COMPARING_DIFFERENCE = 0.0001;

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

exports.renameShowroomView = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema)
    Showroom.findById(req.params.id, (err, showroom) => {
        if(err) {
            return res.status(404).send('not found')
        }
        res.render('popup', {
            showroomid : req.params.id,
            oldname : showroom.showroomname
        })
    })
}

exports.renameShowroom = (req, res) => {
    const userEmail = req.session.email
    const Showroom = mongoose.model(userEmail, showroomSchema)
    Showroom.updateOne({_id: req.params.id},
        { $set: { showroomname : req.body.sname}  },
        { safe: true}, (err, _) => {
            if(err){
                return res.status(412).send(err)
            }
            res.redirect('/showrooms')
        })
}

exports.addObject = (req, res) => {
    const userEmail = req.session.email
    const Showroom = mongoose.model(userEmail, showroomSchema)
    Showroom.findOne({_id: req.params.id}, (err, showroom) => {
        if (err) {
            console.log(err)
        }
        const exists = showroom.objects.find(obj => obj.modelname === req.body.name)
        if(exists !== undefined) {
            return res.send('modelname already exists')
        }
        const myId = mongoose.Types.ObjectId();
        const newObject = {
            _id : myId,
            filename : req.body.files,
            modelname : req.body.name,
        }
        showroom.objects.push(newObject);
        showroom.save((err, _) => {
            if (err) {
                console.error("failed to save new 3DModel: " + err)
                return res.status(412).send(err)
            }
            res.redirect('/showroom/' + req.params.id)
        })
    })
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
        const assetHtml = json2html.render(result, modelTemplate.aframeAssets)
        const modelHtml = json2html.render(result, modelTemplate.aframeAssetModel)
        const files = util.getFilesByEmail(req.session.email)
        const selectionHtml = json2html.render(files, inventoryTemplate.selection)
        const inventoryHtml = json2html.render(files, inventoryTemplate.listModels)
        res.render('view', {
            assets : ejs.render(assetHtml),
            selection: ejs.render(selectionHtml),
            inventory: ejs.render(inventoryHtml),
            useremail : req.session.email,
            showroomid : req.params.id,
            entities : ejs.render(modelHtml)
        });
    })
}

exports.showVR = (req, res) => {
    const Showroom = mongoose.model(req.session.email, showroomSchema)
    Showroom.findById( req.params.id, (err, models) => {
        if (err) {
            return res.status(500).send('database error')
        }
        const result = models.objects
        result.forEach(object => object.filename = req.session.email + '/' + object.filename)
        const assetHtml = json2html.render(result, modelTemplate.aframeAssets)
        const modelHtml = json2html.render(result, modelTemplate.aframeAssetModel)
        res.render('vrview', {
            assets : ejs.render(assetHtml),
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

module.exports.updateModel = async function updateModel(mail, showroom, name, keys, oldValues, newValues) {
    const Showroom = mongoose.model(mail, showroomSchema);
    let caughtError;

    askToThrowExceptionWhenDebuggingFlagIsSet(DEBUG_FLAG_UPDATE_DB, 'Invalid newValue');

    for(let i = 0; i < keys.length; ++i){
        if (newValues[i] === null || newValues[i] === undefined) {
            throw 'Value "' + newValues[i] + '" is an invalid value';
        }

        if (keys[i] === 'scale' && newValues[i] <= 0) {
            throw "Scale must be grater than 0"
        }
    }

    let currentShowroom = await Showroom.findOne({_id: showroom}).catch((error) => {
        caughtError = 'Failed to get showroom for update on ' + mail + ' with showroomId ' + showroom + 'due:\n' + error;
    });

    askToThrowExceptionWhenDebuggingFlagIsSet(DEBUG_FLAG_UPDATE_DB, 'Fail to get showroom');

    if (caughtError) {
        throw caughtError;
    }

    try {
        findObjectAndUpdateAttributes(currentShowroom.objects, name, keys, oldValues, newValues);
    } catch (exception) {
        throw 'Failed to update object "' + name + '" due:\n' + exception;
    }
    await currentShowroom.save((error, _) => {
        if (error) {
            caughtError = 'Failed to update showroom from "' + mail + '" with showroom ID "' + showroom + '"due:\n' + error;
        }
    });

    askToThrowExceptionWhenDebuggingFlagIsSet(DEBUG_FLAG_UPDATE_DB, 'Failed to update showroom');

    if (caughtError) {
        throw caughtError;
    }
}

function findObjectAndUpdateAttributes(objects, name, keys, oldValues, newValues){
    let caughtError = '';
    let found = false;
    objects.forEach((object) => {
        if(object["modelname"] === name){
            found = true;
            for(let i = 0; i < keys.length; ++i){
                let oldValuesAreEqual = false;
                switch (typeof object[keys[i]]){
                    case 'string':
                        oldValuesAreEqual = object[keys[i]] !== oldValues[i];
                        break;
                    case 'number' :
                        oldValuesAreEqual = Math.abs(object[keys[i]] - oldValues[i]) < FLOAT_COMPARING_DIFFERENCE;
                }
                if(!oldValuesAreEqual){
                    caughtError += 'The value of "' + keys[i] + '" in database is ' + object[keys[i]] + ' but got ' +  oldValues[i] + ' instead.';
                    oldValues[i] = object[keys[i]]; // Transmit the current value on the database to the client
                }
                object[keys[i]] = newValues[i];
            }
        }
    });

    askToThrowExceptionWhenDebuggingFlagIsSet(DEBUG_FLAG_UPDATE_DB, 'No object with name');

    if(!found){
        throw 'There is no object with name "' + name + '"';
    }

    askToThrowExceptionWhenDebuggingFlagIsSet(DEBUG_FLAG_UPDATE_DB, 'Old value is incorrect');

    if(caughtError){
        throw caughtError;
    }
}

function askToThrowExceptionWhenDebuggingFlagIsSet(flag, text){
    if(debugFlagIsSet(flag)){
        if(prompt('Throw ' + text + '?[y|any]') === 'y'){
            throw '[Test] ' + text;
        }
    }
}

function debugFlagIsSet(flag){
    return  process.argv.find((element) => {return element === flag}) !== undefined;
}

