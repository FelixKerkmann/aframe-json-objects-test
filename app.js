var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
const path = require('path');
let ejs = require('ejs');
const json2html = require('node-json2html');

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/listEntities', function (req, res) {
    fs.readFile( "data.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
})

app.get('/form', function (req, res){
    res.render('form', );
})

app.get('/', function (req, res) {
    fs.readFile( "data.json", 'utf8', function (err, data) {
        let template = {'<>':'${entity}','position':'${positionx} ${positiony} ${positionz}','color':'${color}'}
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
    var objects = JSON.parse(cur);
    objects.push(response);
    var newData = JSON.stringify(objects);
    fs.writeFileSync('data.json', newData);
    res.redirect('/');
})

var server = app.listen(8888, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Json Entities app listening at http://%s:%s", host, port)
})