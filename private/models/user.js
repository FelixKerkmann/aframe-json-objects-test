const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: String,
},{ _id : true});

module.exports = mongoose.model('Users', usersSchema);