exports.aframeAssetModel = {
    '<>': '${entity}',
    'id' : 'entity_${_id}',
    'gltf-model': '#${_id}',
    'position': '${positionX} ${positionY} ${positionZ}',
    'rotation': '${rotationX} ${rotationY} ${rotationZ}',
    'scale': '${scale} ${scale} ${scale}',
    'selectable' : 'name:${modelname}',
    'shadow' : 'cast:true receive:true',
}

exports.aframeAssets = {
    '<>' : 'a-asset-item',
    'id' : '${_id}',
    'src' : '/public/resources/uploads/${filename}'
}

exports.modelNameList = {
    '<>' : 'li', 'html' : [
        {
            '<>' : 'a', 'class' : 'model-selection', 'text' : '${modelname}'
        }
    ]
}

