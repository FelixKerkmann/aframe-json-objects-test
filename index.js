require('dotenv').config();
let mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./private/routes/model.route')
const session = require("express-session")
const path = require("path")
const cors = require("cors")
const db = require("./private/configs/db.config");

mongoose.connect(db.dbString, { useNewUrlParser: true})

const app = express()

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/', router)

app.listen(8888, '127.0.0.1', function () {
    console.log('listening at http://127.0.0.1:8888')
})