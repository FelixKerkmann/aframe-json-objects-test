require('dotenv').config();
let mongoose = require('mongoose')
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require("socket.io")(server)
const bodyParser = require('body-parser')
const session = require("express-session")
const path = require("path")
const cors = require("cors")
const util = require('./private/util/util')
const router = require('./private/routes/model.route')
const db = require("./private/configs/db.config")
const showroomController = require('./private/controllers/showroom.controller')

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
    console.log('Socket connection established');

    socket.on('updateValue', async (mail, showroom, name, key, oldValue, newValue) => {
        console.log('Received update request: ' + util.updateToString(name, key, oldValue, newValue) +
            ' for user "' + mail + '" on showroom with ID "' + showroom + '".');


        try {
            await showroomController.updateModel(mail, showroom, name, key, oldValue, newValue);
            console.log('Successfully executed update: ' + util.updateToString(name, key, oldValue, newValue) +
                ' for user "' + mail + '" on showroom with ID "' + showroom + '".');
            io.emit('updateSuccess', name, key, oldValue, newValue);
        } catch (exception) {
            console.log('Failed to execute update: ' + util.updateToString(name, key, oldValue, newValue) +
                ' for user "' + mail + '" on showroom with ID "' + showroom + '" due:\n' + exception);
            io.emit('updateFailed', name, key, oldValue, newValue);
        }
    })

    socket.on('removeObject', (mail, showroom, name) => {
        if(showroomController.removeModel(mail, showroom, name) === null) {
            io.emit('removeSuccess')
        } else {
            io.emit('removeFailed', name)
        }
    })

})

server.listen(8888, '127.0.0.1', () => {
    console.log('listening at http://127.0.0.1:8888')
})
