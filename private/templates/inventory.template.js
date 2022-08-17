exports.listModels = [
    {
        '<>': 'div', 'class' : 'grid-item-i grid-text-i', 'html': [
            {
                '<>' : 'p', 'html' : [
                    {
                        '<>': 'span',
                        'text': '${filename}'
                    },
                ]
            },
        ]
    },
    {
        '<>': 'div', 'class': 'grid-item-i grid-button-i', 'html': [
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

    /*{
    '<>' : 'div', 'html' : [
        {
            '<>' : 'span', 'text' : "${filename}"
        },
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
    ]
}*/

exports.selection = {"<>":"option","value":"${filename}","html":"${filename}"}