const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showroomSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    room: String,
    light: [[String]],
    objects: [[String]],
});

module.exports = mongoose.model('Kerki', showroomSchema);