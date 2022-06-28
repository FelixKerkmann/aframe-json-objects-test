const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    entity: String,
    fname: String,
    positionx: Number,
    positiony: Number,
    positionz: Number,
    rotationx: Number,
    rotationy: Number,
    rotationz: Number,
    scale: Number,
});

module.exports = mongoose.model('Models', modelsSchema);