const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const path = require('path');
let ejs = require('ejs');
const json2html = require('node-json2html');
const multer = require("multer");
const {ObjectId} = require("mongodb");
const DbConnectionString = 'mongodb+srv://aframe:Owi93zQUubpASo5V@cluster0.u4bj4.mongodb.net/aframe-prototype?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient
const session = require('express-session');
const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage })

MongoClient.connect(DbConnectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.static('public'));
        app.use('/uploads', express.static(__dirname + '/uploads'));
        const db = client.db('aframe-gltf-models');
        const modelsCollection = db.collection('models');
        const users = db.collection('users');

        app.get('/login', function (req, res) {
            res.render('login');
        });

        app.post('/login', function(req, res) {
            let email = req.body.email;
            let password = req.body.password;
            // Ensure the input fields exists and are not empty
            if (email && password) {
                users.findOne({"email" : email, "password" : password}, function (err, result) {
                    if(result != null) {
                        req.session.loggedin = true;
                        req.session.username = email;
                        res.redirect('/models')
                    } else {
                        res.send('Invalid Credentials')
                    }
                });
            } else {
                res.send('Please enter Username and Password!');
                res.end();
            }
        });

        app.get('/form', function (req, res){
            if (req.session.loggedin) {
                res.render('form', );
            } else {
                res.redirect('/login');
            }
        });

        app.get('/', function (req, res) {
            if (req.session.loggedin) {
                modelsCollection.find().toArray()
                    .then(results => {
                        let template = {
                            '<>': '${entity}',
                            'gltf-model': 'url(/uploads/${fname})',
                            'position': '${positionx} ${positiony} ${positionz}',
                            'rotation': '${rotationx} ${rotationy} ${positionz}',
                            'scale': '${scale} ${scale} ${scale}'
                        };
                        let html = json2html.render(results, template);
                        res.render('view', {
                            entities: ejs.render(html)
                        });
                    })
                    .catch(error => console.error(error))
            } else {
                res.redirect('/login');
            }
        });

        app.get('/models', function (req, res){
            if (req.session.loggedin) {
                modelsCollection.find().toArray()
                    .then(results => {
                        let template =
                            {
                                '<>': 'ul', 'class': 'model', 'html': [
                                    {
                                        '<>': 'form',
                                        'action': '/update/${_id}',
                                        'method': 'post',
                                        'enctype': 'application/json',
                                        'html': [
                                            {
                                                '<>': 'li', 'html': [
                                                    {'<>': 'h3', 'text': '${fname}'}
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'number',
                                                        'id': '${_id}_positionx',
                                                        'name': 'positionx',
                                                        'step': 'any',
                                                        'value': '${positionx}'
                                                    }
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'number',
                                                        'id': '${_id}_positiony',
                                                        'name': 'positiony',
                                                        'step': 'any',
                                                        'value': '${positiony}'
                                                    }
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'number',
                                                        'id': '${_id}_positionz',
                                                        'name': 'positionz',
                                                        'step': 'any',
                                                        'value': '${positionz}'
                                                    }
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'number',
                                                        'id': '${_id}_rotationx',
                                                        'name': 'rotationx',
                                                        'step': 'any',
                                                        'value': '${rotationx}'
                                                    }
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'number',
                                                        'id': '${_id}_rotationy',
                                                        'name': 'rotationy',
                                                        'step': 'any',
                                                        'value': '${rotationy}'
                                                    }
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'number',
                                                        'id': '${_id}_rotationz',
                                                        'name': 'rotationz',
                                                        'step': 'any',
                                                        'value': '${rotationz}'
                                                    }
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'number',
                                                        'id': '${_id}_scale',
                                                        'name': 'scale',
                                                        'step': 'any',
                                                        'value': '${scale}'
                                                    }
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'hidden',
                                                        'name': 'id',
                                                        'value': '${_id}',
                                                        'style': 'visibility: hidden;'
                                                    }
                                                ]
                                            },
                                            {
                                                '<>': 'li', 'html': [
                                                    {'<>': 'input', 'type': 'submit', 'value': 'update'}
                                                ]
                                            },
                                        ]
                                    },
                                    {
                                        '<>': 'li', 'html': [
                                            {
                                                '<>': 'form',
                                                'action': '/delete',
                                                'method': 'post',
                                                'enctype': 'application/json',
                                                'html': [
                                                    {
                                                        '<>': 'input',
                                                        'type': 'hidden',
                                                        'name': 'id',
                                                        'value': '${_id}',
                                                        'style': 'visibility: hidden;'
                                                    },
                                                    {
                                                        '<>': 'input',
                                                        'type': 'hidden',
                                                        'name': 'fname',
                                                        'value': '${fname}',
                                                        'style': 'visibility: hidden;'
                                                    },
                                                    {'<>': 'input', 'type': 'submit', 'value': 'delete'}
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        let html = json2html.render(results, template);
                        res.render('models', {
                            models: ejs.render(html)
                        });
                    })
            } else {
                res.redirect('/login');
            }
        });

        app.post('/object', upload.single("gltffile"), function (req,res) {
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
            if (req.session.loggedin) {
                modelsCollection.findOne({"_id": ObjectId(req.params.id)}, function (err, result) {
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
            } else {
                res.redirect('/login');
            }
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

        app.get('/stop', function (req, res) {
            if (req.session.loggedin) {
                process.kill(process.pid, 'SIGTERM')
            } else {
                res.redirect('/login');
            }
        });

        const server = app.listen();

        process.on('SIGTERM', () => {
            server.close(() => {
                console.log('Process terminated')
            });
        });
    })
    .catch(console.error)


