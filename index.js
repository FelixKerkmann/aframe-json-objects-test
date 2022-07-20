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

    socket.on('updateValue', (mail, showroom, name, key, value) => {
        console.log('[socket.on] ' + mail + ', ' + showroom + ', ' + name + ', ' + key + ', ' + value);
        // Write in DB
        //const Showroom = mongoose.model(mail, showroomSchema)
        // Showroom.find({_id : showroom, objects.modelname : name}, (err, result) => {
        //     if (err) {
        //         console.log("Unable to add Object, error: " + err)
        //         return res.send(err)
        //     }
        //     console.log(result);
        // });

        // })
        // const Showroom = mongoose.model(mail, showroomSchema)
        // Showroom.updateOne(
        //     {_id : showroom }, {
        //                 $set: {
        //                     "objects.: {
        //                         modelname : name,
        //                         key : value
        //                     }
        //                 }
        //     });
        //
        // io.emit('updateValueDone', name, key, value)
    })
})

server.listen(8888, '127.0.0.1', () => {
    console.log('listening at http://127.0.0.1:8888')
})
