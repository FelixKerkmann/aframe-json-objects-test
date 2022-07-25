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

    socket.on('updateValues', async (mail, showroom, name, keys, oldValues, newValues) => {
        console.log('Received update request:\n' + util.updateValuesToString(keys, oldValues, newValues) +
            'For user "' + mail + '" on showroom with ID "' + showroom + '".');

        try{
            await showroomController.updateModel(mail, showroom, name, keys, oldValues, newValues);
            console.log('Successfully executed update:\n' + util.updateValuesToString(keys, oldValues, newValues) +
                'for user "' + mail + '" on showroom with ID "' + showroom + '".');
            io.emit('updateValuesSuccess', name, keys, oldValues, newValues);
        }catch(exception){
            console.log('Failed to executed update:\n' + util.updateValuesToString(keys, oldValues, newValues) +
                'for user "' + mail + '" on showroom with ID "' + showroom + '" due:\n' + exception);
            io.emit('updateValuesFailed', name, keys, oldValues, newValues);
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