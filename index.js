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
const router = require('./private/routes/model.route')
const db = require("./private/configs/db.config")
const showroomSchema = require("./private/models/showroom")
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
    console.log('socket connection established')

    socket.on('updateValue', (mail, showroom, name, key, oldValue, newValue) => {
        console.log('Server receive:  ' + mail + ', ' + showroom + ', ' + name + ', ' + key + ', ' + oldValue + ', ' + newValue);

        // Write in DB
        io.emit('updateFailed', name, key, oldValue, newValue);

        // TODO: Check if update is valid
        // name is correct
        // oldValue is equal
        // newValue is valid number

        const Showroom = mongoose.model(mail, showroomSchema);
        try{
            Showroom.findOne({_id: showroom}, (error, currentShowroom) => {
                if (error) {
                    console.error('Failed to get showroom for update on ' + mail + ' with showroomId ' + showroom + ':\n' + error);
                    throw error;
                }

                findObjectAndUpdateAttribute(currentShowroom.objects, name, key, newValue);

                currentShowroom.save((error, _) => {
                    if (error) {
                        console.error('Failed to update showroom for update on ' + mail + ' with showroomId ' + showroom + ':\b' + error);
                        throw error;
                    }

                    console.log(currentShowroom.showroomname + " was updated successfully");
                    io.emit('updateSuccess', name, key, oldValue, newValue);
                })
            });
        }catch (e){
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


function findObjectAndUpdateAttribute(objects, name, key, newValue){
    objects.forEach((object) => {
        if(object["modelname"] === name){
            object[key] = newValue;
        }
    })
}

server.listen(8888, '127.0.0.1', () => {
    console.log('listening at http://127.0.0.1:8888')
})
