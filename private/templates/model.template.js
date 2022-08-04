exports.aframeModelTemplate = {
    '<>': '${entity}',
    'id' : '${modelname}',
    'gltf-model': 'url(/public/resources/uploads/${filename})',
    'position': '${positionX} ${positionY} ${positionZ}',
    'rotation': '${rotationX} ${rotationY} ${rotationZ}',
    'scale': '${scale} ${scale} ${scale}',
    'selectable' : 'name:${modelname}',
    'shadow' : 'cast:true receive:true',
}

exports.aframeAssetModel = {
    '<>': '${entity}',
    'id' : 'entity_${objectNumber}',
    'gltf-model': '#${objectNumber}',
    'position': '${positionX} ${positionY} ${positionZ}',
    'rotation': '${rotationX} ${rotationY} ${rotationZ}',
    'scale': '${scale} ${scale} ${scale}',
    'selectable' : 'name:${modelname}',
    'shadow' : 'cast:true receive:true',
}

exports.aframeAssets = {
    '<>' : 'a-asset-item',
    'id' : '${objectNumber}',
    'src' : '/public/resources/uploads/${filename}'
}

exports.listModelTemplate = {
    '<>': 'ul', 'class': 'model', 'html': [
        {
            '<>': 'form',
            'action': '/models/${_id}',
            'method': 'post',
            'enctype': 'application/json',
            'html': [
                {
                    '<>': 'li', 'html': [
                        {'<>': 'h3', 'text': '${modelname}'}
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_positionX',
                            'name': 'positionX',
                            'step': 'any',
                            'value': '${positionX}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_positionY',
                            'name': 'positionY',
                            'step': 'any',
                            'value': '${positionY}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_positionZ',
                            'name': 'positionZ',
                            'step': 'any',
                            'value': '${positionZ}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_rotationX',
                            'name': 'rotationX',
                            'step': 'any',
                            'value': '${rotationX}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_rotationY',
                            'name': 'rotationY',
                            'step': 'any',
                            'value': '${rotationY}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_rotationZ',
                            'name': 'rotationZ',
                            'step': 'any',
                            'value': '${rotationZ}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_scale',
                            'name': 'scale',
                            'step': 'any',
                            'value': '${scale}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'hidden',
                            'name': 'id',
                            'value': '${_id}',
                            'style': 'visibility: hidden;'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {'<>': 'input', 'type': 'submit', 'value': 'update'}
                    ]
                },
            ]
        },
        {
            '<>': 'li', 'html': [
                {
                    '<>': 'form',
                    'action': '/delete/${_id}',
                    'method': 'post',
                    'enctype': 'application/json',
                    'html': [
                        {
                            '<>': 'input',
                            'type': 'hidden',
                            'name': 'id',
                            'value': '${_id}',
                            'style': 'visibility: hidden;'
                        },
                        {
                            '<>': 'input',
                            'type': 'hidden',
                            'name': 'filename',
                            'value': '${filename}',
                            'style': 'visibility: hidden;'
                        },
                        {'<>': 'input', 'type': 'submit', 'value': 'delete'}
                    ]
                }
            ]
        },
        {
            '<>': 'li', 'html': [
                {
                    '<>': 'a',
                    'href': '/public/resources/uploads/${filename}',
                    'text': 'download'
                }
            ]
        }
    ]
}
