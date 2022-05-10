const mongoose = require('mongoose')
require('mongoose-double')(mongoose);
const SchemaTypes = mongoose.Schema.Types;
const Schema = mongoose.Schema

const threeDModel = new Schema({
    entity: String,
    fname: String,
    positionX: SchemaTypes.Double,
    positionY: SchemaTypes.Double,
    positionZ: SchemaTypes.Double,
    rotationX: SchemaTypes.Double,
    rotationY: SchemaTypes.Double,
    rotationZ: SchemaTypes.Double,
    scale: SchemaTypes.Double
});
module.exports = mongoose.model('3DModel', threeDModel)