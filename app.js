const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const path = require('path');
let ejs = require('ejs');
const json2html = require('node-json2html');
const multer = require("multer")
const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/listEntities', function (req, res) {
    fs.readFile( "data.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
})

app.get('/form', function (req, res){
    res.render('form', );
})
/*
app.get('/', function (req, res) {
    fs.readFile( "data.json", 'utf8', function (err, data) {
        let template = {'<>':'${entity}','position':'${positionx} ${positiony} ${positionz}','color':'${color}'}
        console.log(data);
        console.log(template);
        let html = json2html.render(data, template);
        console.log(html);
        res.render('view', {
            entities: ejs.render(html)
        });
        //<a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
    });
})
*/
app.get('/', function (req, res) {
    fs.readFile( "objects.json", 'utf8', function (err, data) {
        let template = {'<>':'${entity}', 'gltf-model': 'url(/uploads/${id})', 'position':'${positionx} ${positiony} ${positionz}', 'rotation':'${rotationx} ${rotationy} ${positionz}','scale':'${scale} ${scale} ${scale}'};
        console.log(template);
        let html = json2html.render(data, template);
        console.log(html);
        res.render('view', {
            entities: ejs.render(html)
        });
        //<a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
    });
})

app.post('/form', function (req,res) {
    response = {
        entity:req.body.entity,
        positionx:parseInt(req.body.positionx),
        positiony:parseInt(req.body.positiony),
        positionz:parseInt(req.body.positionz),
        color:req.body.color
    }
    let cur = fs.readFileSync('data.json');
    let objects = JSON.parse(cur);
    ;objects.push(response)
    let newData = JSON.stringify(objects);
    fs.writeFileSync('data.json', newData);
    res.redirect('/');
})

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
    response = {
        entity:"a-entity",
        id:req.file.originalname,
        positionx:parseInt(req.body.positionx),
        positiony:parseInt(req.body.positiony),
        positionz:parseInt(req.body.positionz),
        rotationx:parseInt(req.body.rotationx),
        rotationy:parseInt(req.body.rotationy),
        rotationz:parseInt(req.body.rotationz),
        scale:parseInt(req.body.scale)
    }
    let cur = fs.readFileSync('objects.json');
    var objects = JSON.parse(cur);
    objects.push(response);
    var newData = JSON.stringify(objects);
    fs.writeFileSync('objects.json', newData);
    res.redirect('/');
})

const server = app.listen(8888, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Json Entities app listening at http://%s:%s", host, port);
});