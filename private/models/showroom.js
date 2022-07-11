const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showroomSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    room: String,
    light: [[String]],
    objects: [[String]],
});

module.exports = showroomSchema
//module.exports = mongoose.model('Showroom', showroomSchema);