const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showroomSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    showroomname: String,
    room: { type: Number, default: ''},
    light: [[String]],
    objects: [{
        entity: { type: String, default: 'a-entity'},
        filename: String,
        modelname: String,
        positionx: { type: Number, default: 0},
        positiony: { type: Number, default: 1},
        positionz: { type: Number, default: -1},
        rotationx: { type: Number, default: 0},
        rotationy: { type: Number, default: 0},
        rotationz: { type: Number, default: 0},
        scale: { type: Number, default: 1},
    }],
});

module.exports = showroomSchema
//module.exports = mongoose.model('Showroom', showroomSchema);