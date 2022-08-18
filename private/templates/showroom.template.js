exports.showroomGrid = [
    {
        '<>': 'div', 'class': 'sname grid-item-sr grid-text-sr', 'html': [
            {
                '<>' : 'p', 'html' : [
                    {
                        '<>': 'a',
                        'href': '/showroom/${_id}',
                        'text': '${showroomname}'
                    },
                ]
            },
        ],
    },
    {
        '<>': 'div', 'class': 'grid-item-sr grid-button-sr', 'html': [
            {
                '<>': 'a',
                'class': 'button button-outline',
                'href': '/vr/${_id}',
                'text': 'VR mode'
            },
        ],
    },
    {
        '<>': 'div', 'class' : 'grid-item-sr grid-button-sr', 'html': [
            {
                '<>': 'a',
                'class': 'button button-outline',
                'href': '/rename/${_id}',
                'text': 'Rename'
            },
        ]
    },
    {
        '<>': 'div', 'class': 'grid-item-sr grid-button-sr', 'html': [
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
                    {'<>': 'button', 'type': 'submit', 'text': 'delete', 'class': 'btn-cancel'}
                ]
            }
        ],
    }
]