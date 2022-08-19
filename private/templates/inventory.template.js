exports.listModelsOld = [
    {
        '<>': 'div', 'class' : 'inventoryName', 'html': [
            {
                'text': '${filename}'
            },
        ]
    },
    {
        '<>': 'div', 'html': [
            {
                '<>': 'form',
                'action': '/deletemodel/${filename}',
                'method': 'post',
                'enctype': 'application/json',
                'html': [
                    {
                        '<>': 'button',
                        'type': 'submit',
                        'text': 'delete',
                        'class': 'button-outline button-delete'
                    }
                ]
            }
        ],
    }
]

exports.selection = {
    "<>":"option",
    "value":"${filename}",
    "html":"${filename}"
}

exports.listModels = [
    {
        '<>': 'div', 'class' : 'inventoryName', 'html': [
            {
                'text': '${filename}'
            },
        ]
    },
    {
        '<>': 'div',
        'class' : 'listen-delete',
        'html': [
            {
                '<>': 'form',
                'action': '/deletemodel/${filename}',
                'method': 'post',
                'enctype': 'application/json',
                'html': [
                    {
                        '<>' : 'div',
                        'class' : 'id-elem',
                        'id' : '${filename}',
                        'style' : 'visibility: hidden',
                        'html' : [
                            {
                                '<>' : 'div',
                                'class' : 'popup-content popup-center popup-absolute',
                                'html' : [
                                    {
                                        '<>' : 'p',
                                        'html' : 'Are you sure you want to delete <b>${filename}</b>?'
                                    },
                                    {
                                        '<>': 'a',
                                        'text': 'cancel',
                                        'class': 'button button-delete cancel-delete btn-cancel'
                                    },
                                    {
                                        '<>': 'button',
                                        'type': 'submit',
                                        'text': 'delete',
                                        'class': 'button-delete btn-accept float-right'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        '<>': 'a',
                        'text': 'delete',
                        'class': 'button button-outline button-delete safe-delete'
                    }

                ]
            }
        ],
    }
]