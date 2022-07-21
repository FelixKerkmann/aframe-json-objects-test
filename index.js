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
const showroomSchema = require("./private/models/showroom");
const prompt = require("prompt-sync")({ sigint: true });

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
        console.log('Received update request: ' + updateToString(name, key, oldValue, newValue) +
            ' for user "' + mail + '" on showroom with ID "' + showroom + '".');

        try {
            await executeUpdate(mail, showroom, name, key, oldValue, newValue);
            console.log('Successfully executed update: ' + updateToString(name, key, oldValue, newValue) +
                ' for user "' + mail + '" on showroom with ID "' + showroom + '".');
            io.emit('updateSuccess', name, key, oldValue, newValue);
        } catch (exception) {
            console.log('Failed to execute update: ' + updateToString(name, key, oldValue, newValue) +
                ' for user "' + mail + '" on showroom with ID "' + showroom + '" due:\n' + exception);
            io.emit('updateFailed', name, key, oldValue, newValue);
        }
    })})

async function executeUpdate(mail, showroom, name, key, oldValue, newValue) {
    const Showroom = mongoose.model(mail, showroomSchema);
    let caughtError;

    if(debug()){
        if(prompt('Throw invalid newValue?[y|any]') === 'y'){
            throw '[Test] Invalid newValue';
        }
    }

    if (newValue === null || newValue === undefined) {
        throw 'Value "' + newValue + '" is an invalid value';
    }

    let currentShowroom = await Showroom.findOne({_id: showroom}).catch((error) => {
        caughtError = 'Failed to get showroom for update on ' + mail + ' with showroomId ' + showroom + 'due:\n' + error;
    });

    if(debug()){
        if(prompt('Throw fail to get showroom?[y|any]') === 'y'){
            throw '[Test] Failed to get showroom.';
        }
    }

    if (caughtError) {
        throw caughtError;
    }

    try {
        findObjectAndUpdateAttribute(currentShowroom.objects, name, key, oldValue, newValue);
    } catch (exception) {
        throw 'Failed to update "' + key + '" for object "' + name + '" due:\n' + exception;
    }

    await currentShowroom.save((error, _) => {
        if (error) {
            caughtError = 'Failed to update showroom from "' + mail + '" with showroom ID "' + showroom + '"due:\n' + error;
        }
    });

    if(debug()){
        if(prompt('Throw fail to update showroom?[y|any]') === 'y'){
            throw '[Test] Failed to update showroom.';
        }
    }

    if (caughtError) {
        throw caughtError;
    }
}

function updateToString(name, key, oldValue, newValue){
    return '"' + key + '" of "' + name + '" from ' + oldValue + ' to ' + newValue;
}

function findObjectAndUpdateAttribute(objects, name, key, oldValue, newValue){
    let caughtError;
    let found = false;
    objects.forEach((object) => {
        if(object["modelname"] === name){
            found = true;
            if(object[key] !== oldValue){
                console.warn(typeof object[key] + ' vs ' + typeof oldValue)
                caughtError = 'The old value of "' + key + '" should be ' + oldValue + ' but is ' + object[key] + ' instead.';
                oldValue = object[key]; // Transmit the current value on the database to the client
            }
            object[key] = newValue;
        }
    });

    if(debug()){
        if(prompt('Throw no object with this name?[y|any]') === 'y'){
            throw '[Test] No object with name.';
        }
    }
    if(!found){
        throw 'There is no object with name "' + name + '"';
    }

    if(debug()){
        if(prompt('Throw oldValue is incorrect?[y|any]') === 'y'){
            throw '[Test] Old value is incorrect.';
        }
    }
    if(caughtError){
        throw caughtError;
    }
}

function debug(){
    return  process.argv.find((element) => {return element === "debug-updateDB"}) != null;
}

server.listen(8888, '127.0.0.1', () => {
    console.log('listening at http://127.0.0.1:8888')
})
