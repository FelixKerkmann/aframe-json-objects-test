const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const test = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    room: String,
    light: [[String]],
    objects: [{
        entity: String,
        fname: String,
        positionx: Number,
        positiony: Number,
        positionz: Number,
        rotationx: Number,
        rotationy: Number,
        rotationz: Number,
        scale: Number,
    }],
});

module.exports = mongoose.model('test', test);