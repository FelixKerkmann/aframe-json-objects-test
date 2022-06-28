exports.aframemodeltemplate = {
    '<>': '${entity}',
    'gltf-model': 'url(/public/resources/uploads/${fname})',
    'position': '${positionx} ${positiony} ${positionz}',
    'rotation': '${rotationx} ${rotationy} ${positionz}',
    'scale': '${scale} ${scale} ${scale}'
};

exports.listmodeltemplate = {
    '<>': 'ul', 'class': 'model', 'html': [
        {
            '<>': 'form',
            'action': '/models/${_id}',
            'method': 'post',
            'enctype': 'application/json',
            'html': [
                {
                    '<>': 'li', 'html': [
                        {'<>': 'h3', 'text': '${fname}'}
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_positionx',
                            'name': 'positionx',
                            'step': 'any',
                            'value': '${positionx}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_positiony',
                            'name': 'positiony',
                            'step': 'any',
                            'value': '${positiony}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_positionz',
                            'name': 'positionz',
                            'step': 'any',
                            'value': '${positionz}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_rotationx',
                            'name': 'rotationx',
                            'step': 'any',
                            'value': '${rotationx}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_rotationy',
                            'name': 'rotationy',
                            'step': 'any',
                            'value': '${rotationy}'
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'input',
                            'type': 'number',
                            'id': '${_id}_rotationz',
                            'name': 'rotationz',
                            'step': 'any',
                            'value': '${rotationz}'
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
                            'name': 'fname',
                            'value': '${fname}',
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
                    'href': '/public/resources/uploads/${fname}',
                    'text': 'download'
                }
            ]
        }
    ]
}

exports.examplemodel = {
    '<>': 'a-entity',
    'gltf-model': 'url(/public/resources/uploads/${objects[1][0]})',
    'position': '${positionx} ${positiony} ${positionz}',
    'rotation': '${rotationx} ${rotationy} ${positionz}',
    'scale': '${scale} ${scale} ${scale}'
}
