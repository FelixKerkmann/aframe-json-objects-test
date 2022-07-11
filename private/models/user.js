const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    password: String,
},{ _id : true});

module.exports = mongoose.model('Users', usersSchema);