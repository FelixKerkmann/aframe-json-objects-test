exports.listModels = [
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
                        'class': 'btn-cancel'
                    }
                ]
            }
        ],
    }
]

exports.selection = {"<>":"option","value":"${filename}","html":"${filename}"}