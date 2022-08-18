const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showroomSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    showroomname: String,
    room: { type: String, default: ''},
    light: [[String]],
    objects: [{
        entity: { type: String, default: 'a-entity'},
        filename: String,
        modelname: String,
        positionX: { type: Number, default: 0},
        positionY: { type: Number, default: 1},
        positionZ: { type: Number, default: -1},
        rotationX: { type: Number, default: 0},
        rotationY: { type: Number, default: 0},
        rotationZ: { type: Number, default: 0},
        scale: { type: Number, default: 1},
        _id: mongoose.Schema.Types.ObjectId,
    }],
});

module.exports = showroomSchema
//module.exports = mongoose.model('Showroom', showroomSchema);