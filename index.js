require('dotenv').config();
let mongoose = require('mongoose')
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require("socket.io")(server)
const bodyParser = require('body-parser')
const router = require('./private/routes/model.route')
const session = require("express-session")
const path = require("path")
const cors = require("cors")
const db = require("./private/configs/db.config")

mongoose.connect(db.dbString, { useNewUrlParser: true})

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


io.on('connection', (socket) => {
    console.log('socket connection')
    /*
    if(socket.handshake.url !== '/showroom/*') {
        socket.disconnect();
        console.log("disconnected")
        return
    }
    */
    socket.on('update value', (obj) => {
        console.log("obj : ", obj)

        io.emit('update value', obj)
    })
    /*
    socket.on('update value', (value) => {
        io.emit('update value', value)
        console.log("test", value)
    })
    */
})

server.listen(8888, '127.0.0.1', () => {
    console.log('listening at http://127.0.0.1:8888')
})

function updateDb(object) {

}