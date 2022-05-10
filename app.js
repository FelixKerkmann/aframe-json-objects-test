const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const path = require('path');
let ejs = require('ejs');
const json2html = require('node-json2html');
const multer = require("multer");
const DbConnectionString = 'mongodb+srv://aframe:Owi93zQUubpASo5V@cluster0.u4bj4.mongodb.net/aframe-prototype?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient
const app = express();

const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-double')(mongoose);
const SchemaTypes = mongoose.Schema.Types;

mongoose
    .connect(DbConnectionString, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })
const db = mongoose.connection
module.exports = db;

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
MongoClient.connect(DbConnectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.static('public'));
        app.use('/uploads', express.static(__dirname + '/uploads'));
        const db = client.db('aframe-gltf-models');
        const modelsCollection = db.collection('models');
        const skybox = db.collection('skybox')

        app.get('/form', function (req, res){
            res.render('form', );
        })

        app.get('/', function (req, res) {

            modelsCollection.find().toArray()
                .then(results => {
                    console.log(results)
                    let template = {'<>':'${entity}', 'gltf-model': 'url(/uploads/${fname})', 'position':'${positionx} ${positiony} ${positionz}', 'rotation':'${rotationx} ${rotationy} ${positionz}','scale':'${scale} ${scale} ${scale}'};
                    console.log(template);
                    let html = json2html.render(results, template);
                    console.log(html);
                    res.render('view', {
                        entities: ejs.render(html)
                    });
                })
                .catch(error => console.error(error))
        });

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        })

        const upload = multer({ storage: storage })

        app.post('/object', upload.single("gltffile"), function (req,res) {
            //console.log(req.file, req.body)
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
            res.redirect('/');
        })

        const server = app.listen(8888, function () {
            console.log("Json Entities app listening at http://localhost:8888");
        });
    })
    .catch(console.error)


