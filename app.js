const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const path = require('path');
let ejs = require('ejs');
const json2html = require('node-json2html');
const multer = require("multer");
const {ObjectId, BSONType} = require("mongodb");
const DbConnectionString = 'mongodb+srv://aframe:Owi93zQUubpASo5V@cluster0.u4bj4.mongodb.net/aframe-prototype?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient
const app = express();

const HOST = "127.0.0.1"
const PORT = 8888

// Database information
const DATABASE_NAME         = "aframe-gltf-models";
const MODELS_COLLECTION     = "models";
const SHOWROOMS_COLLECTION  = "showrooms";

// Routes
const START_ROUTE               = '/';
const SHOWROOMS_ROUTE           = '/showrooms';
const CONFIGURATOR_ROUTE        = '/showroom';
const MODELS_ROUTE              = '/models/:name';
const SHOWROOM_CREATION_ROUTE   = '/createShowroom';
const SHOWROOM_DELETION_ROUTE   = '/deleteShowroom';

// Views
const SHOWROOMS_VIEW        = 'showroomsView';
const CONFIGURATOR_VIEW     = 'configuratorView';
const NOT_FOUND_VIEW        = 'notFoundView';
const NEW_SHOWROOM_VIEW     = 'createShowroomView';
const DELETE_SHOWROOM_VIEW  = 'deleteShowroomView';

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
MongoClient.connect(DbConnectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.static('public'));
        app.use('/uploads', express.static(__dirname + '/uploads'));
        app.use('/resources/components', express.static(__dirname + '/resources/components'));
        const db = client.db(DATABASE_NAME);
        const modelsCollection = db.collection(MODELS_COLLECTION);
        const showroomsCollection = db.collection(SHOWROOMS_COLLECTION);

        makeCopyOfCollectionAndInsert("Demo Showroom Copy", "Demo Showroom");

        app.get(START_ROUTE, function (req, res) {
            res.redirect(SHOWROOMS_ROUTE);
        });

        app.get(SHOWROOMS_ROUTE, function(req, res){
            showroomsCollection.find().toArray()
                .then(results => {
                let template =
                    {'<>' : 'tr', 'html' : [
                            {'<>' : 'td', 'text' : '${name}'},
                            {'<>' : 'td', 'html' : [
                                    {'<>' : 'form', 'action' : '/showroom/${name}', 'method' : 'get', 'enctype' : 'application/json', 'html' : [
                                            {'<>' : 'input', 'type' : 'submit', 'value' : 'open'}
                                        ]},
                                    ]},
                            {'<>' : 'td', 'html' : [
                                    {'<>' : 'form', 'action' : '/deleteShowroom/${name}', 'method' : 'get', 'enctype' : 'application/json', 'html' : [
                                            {'<>' : 'input', 'type' : 'submit', 'value' : 'delete'}
                                ]}
                        ]}
                    ]};
                let html = json2html.render(results, template);
                res.render(SHOWROOMS_VIEW, {
                    showrooms: ejs.render(html),
                    createShowroomRoute:"<a href=\"" + SHOWROOM_CREATION_ROUTE + "\"> Create new Showroom </a>"});
            });
        });

        app.get(SHOWROOM_CREATION_ROUTE, function (req, res){
            res.render(NEW_SHOWROOM_VIEW);
        });

        app.post(SHOWROOM_CREATION_ROUTE, function (req, res) {
            console.log("Try to create a new showroom: ");
            console.log(req.body)

            let nameOfShowroom = req.body.name;

            // Check if there is an entry in showrooms
            showroomsCollection.findOne({name: nameOfShowroom}).then(result => {
                if (result) {
                    // showroom already exists (in showrooms)
                    console.warn("Showroom already exists in showrooms.");
                    res.redirect(SHOWROOM_CREATION_ROUTE);
                    return;
                }

                // Create collection
                db.createCollection(nameOfShowroom).then((_) => {
                    // Insert entry in showrooms
                    showroomsCollection.insertOne({
                        name: nameOfShowroom,
                        description: req.body.description,
                        created: new Date(),
                        lastUpdated: null
                    }).then(result => {
                        console.log("Showroom " + nameOfShowroom + "(Id: " + result.insertedId + ") was created successfully.");
                        res.redirect(CONFIGURATOR_ROUTE + "/" + nameOfShowroom);
                    }).catch(error => {
                        console.error("Failed to insert " + nameOfShowroom + " into showrooms.");
                        db.dropCollection(nameOfShowroom).then(result => {
                            console.warn(nameOfShowroom + " collection was dropped.");
                        }).catch(error => {
                            console.warn("Failed to drop collection " + nameOfShowroom + ".");
                            res.redirect(SHOWROOM_CREATION_ROUTE);
                            return;
                        });
                    });
                }).catch(error => {
                    console.error("Failed to create collection for " + nameOfShowroom);
                    console.error(error);
                    res.redirect(SHOWROOM_CREATION_ROUTE);
                    return;
                    });
            }).catch(error => {
                console.error("Failed to check if showroom already exists.")
                console.error(error);
                res.redirect(SHOWROOM_CREATION_ROUTE);
                return;
            });
        });

        app.get(SHOWROOM_DELETION_ROUTE + "/:name", function (req, res){
            res.render(DELETE_SHOWROOM_VIEW, {
                showroom: req.params.name
            });
        });

        app.post(SHOWROOM_DELETION_ROUTE, function (req, res){
            const nameOfShowroom = req.body.name;
            const showroom = showroomsCollection.findOne({name : nameOfShowroom});
            showroomsCollection.deleteOne({name : nameOfShowroom})
                .then(_ => {
                    const collection = db.collection(nameOfShowroom);
                    collection.drop()
                        .catch(error =>{
                            console.error("Failed to delete " + nameOfShowroom + " from showrooms.");
                            showroomsCollection.insertOne(showroom);
                        })
                })
                .catch(error => {
                    console.error("Failed to drop collection " + nameOfShowroom + ".");
                    console.error(error);
                })
            res.redirect(START_ROUTE);
        });

        app.get(CONFIGURATOR_ROUTE + "/:name", function (req, res) {
            try {
                db.collection(req.params.name).find().toArray()
                    .then(results => {
                        let template = {
                            '<>': '${entity}',
                            'gltf-model': 'url(/uploads/${fname})',
                            'position': '${positionx} ${positiony} ${positionz}',
                            'rotation': '${rotationx} ${rotationy} ${rotationz}',
                            'scale': '${scale} ${scale} ${scale}'
                        }
                        let html = json2html.render(results, template);
                        res.render(CONFIGURATOR_VIEW, {
                            title: req.params.name,
                            entities: ejs.render(html),
                        });
                    });
            } catch (error) {
                // Add error page
                console.error('Failed to get entities of showroom ' + req.params.name + '\n', error);
                res.redirect(START_ROUTE);
            }
        });

        app.get(MODELS_ROUTE, function (req, res){
            db.collection(req.params.name).find().toArray()
                .then(results => {
                    let template =
                        {'<>' : 'ul', 'class': 'model', 'html':[
                                {'<>' : 'form', 'action' : '/update/${_id}', 'method' : 'post', 'enctype' : 'application/json', 'html' : [
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'h3' , 'text' : '${fname}' }
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'number', 'id' : '${_id}_positionx', 'name': 'positionx', 'step' : 'any', 'value' : '${positionx}'}
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'number', 'id' : '${_id}_positiony', 'name': 'positiony', 'step' : 'any', 'value' : '${positiony}'}
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'number', 'id' : '${_id}_positionz', 'name': 'positionz', 'step' : 'any', 'value' : '${positionz}'}
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'number', 'id' : '${_id}_rotationx', 'name': 'rotationx', 'step' : 'any', 'value' : '${rotationx}'}
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'number', 'id' : '${_id}_rotationy', 'name': 'rotationy', 'step' : 'any', 'value' : '${rotationy}'}
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'number', 'id' : '${_id}_rotationz', 'name': 'rotationz', 'step' : 'any', 'value' : '${rotationz}'}
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'number', 'id' : '${_id}_scale', 'name': 'scale', 'step' : 'any', 'value' : '${scale}'}
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'hidden', 'name' : 'id','value' : '${_id}', 'style' : 'visibility: hidden;'}
                                            ]},
                                        {'<>' : 'li', 'html' : [
                                                {'<>' : 'input', 'type' : 'submit', 'value' : 'update'}
                                            ]},
                                    ]},
                                {'<>' : 'li', 'html' : [
                                        {'<>' : 'form', 'action' : '/delete', 'method' : 'post', 'enctype' : 'application/json', 'html' : [
                                                {'<>' : 'input', 'type' : 'hidden', 'name' : 'id','value' : '${_id}', 'style' : 'visibility: hidden;'},
                                                {'<>' : 'input', 'type' : 'hidden', 'name' : 'fname','value' : '${fname}', 'style' : 'visibility: hidden;'},
                                                {'<>' : 'input', 'type' : 'submit', 'value' : 'delete'}
                                            ]}
                                    ]}
                            ]};
                    let html = json2html.render(results, template);
                    res.render('models', {
                        models: ejs.render(html)
                    });
                })
        });

        app.get('/form', function (req, res){
            res.render('form', );
        });

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        })

        app.post('/object', multer({ storage: storage }).single("gltffile"), function (req,res) {
            console.log(req.file, req.body)
            modelsCollection.insertOne({
                entity: "a-entity",
                fname: req.file.originalname,
                positionx: parseFloat(req.body.positionx),
                positiony: parseFloat(req.body.positiony),
                positionz: parseFloat(req.body.positionz),
                rotationx: parseFloat(req.body.rotationx),
                rotationy: parseFloat(req.body.rotationy),
                rotationz: parseFloat(req.body.rotationz),
                scale: parseFloat(req.body.scale)
            })
            res.redirect('/models');
        })

        app.get('/updated/:id', function(req, res){
            modelsCollection.findOne( {"_id" : ObjectId(req.params.id)}, function (err, result) {
                res.render('update', {
                    positionx: result.positionx,
                    positiony: result.positiony,
                    positionz: result.positionz,
                    rotationx: result.rotationx,
                    rotationy: result.rotationy,
                    rotationz: result.rotationz,
                    scale: result.scale,
                    id: req.params.id,
                })
            })
        });

        app.post('/update/:id', function(req, res) {
            console.log(req.body);
            modelsCollection.updateOne({"_id": ObjectId(req.params.id)},
                {
                    $set: {
                        positionx: req.body.positionx,
                        positiony: req.body.positiony,
                        positionz: req.body.positionz,
                        rotationx: req.body.rotationx,
                        rotationy: req.body.rotationy,
                        rotationz: req.body.rotationz,
                        scale: req.body.scale,
                    }
                },
                function (err, result) {
                    if (err) {
                        throw err;
                    } else {
                        console.log("Updated");
                    }
                });
            res.redirect('/models');
        });

        app.post('/delete', function (req, res) {
            modelsCollection.deleteOne({"_id" : ObjectId(req.body.id)}, function (err, data) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log(data);
                    try {
                        fs.unlinkSync('./uploads/' + req.body.fname)
                        //file removed
                    } catch(err) {
                        console.error(err)
                    }
                    res.redirect('/models')
                }
            });
        });

        app.all('*', function (req, res){
            res.render(NOT_FOUND_VIEW);
        });

        app.listen(PORT, HOST,function () {
            console.log(`App listening at http://${HOST}:${PORT}`);
        });

        function makeCopyOfCollectionAndInsert(from){
            makeCopyOfCollection(from, from + " Copy");
        }

        function makeCopyOfCollectionAndInsert(from, to){
            db.createCollection(to)
                .then(() => {
                    db.collection(from)
                        .find()
                        .forEach(function (document){db.collection(to)
                            .insertOne(document)})
                        .then(() =>{
                            showroomsCollection.insertOne({
                                name : "Demo Showroom",
                                created : new Date(2022, 6, 10, 8, 30, 0),
                                lastUpdated : new Date()
                            }).catch(() => {});
                        })
                        .catch(error => db.dropCollection(to));
                })
                .catch(error => {
                    console.warn("Failed to copy " + from + ".");
                    console.warn(error);
            });
        }
    });