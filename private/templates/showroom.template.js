exports.showroomGrid = [
    {
        '<>': 'div', 'class': 'showroomsName', 'html': [
            {
                '<>': 'a',
                'href': '/showroom/${_id}',
                'text': '${showroomname}'
            },
        ],
    },
    {
        '<>': 'div', 'html': [
            {
                '<>': 'a',
                'class': 'button button-outline',
                'href': '/vr/${_id}',
                'text': 'VR mode'
            },
        ],
    },
    {
        '<>': 'div', 'html': [
            {
                '<>': 'a',
                'class': 'button button-outline',
                'href': '/rename/${_id}',
                'text': 'Rename'
            },
        ]
    },
    {
        '<>': 'div', 'html': [
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
                    {'<>': 'button', 'type': 'submit', 'text': 'delete', 'class': 'button-outline button-delete'}
                ]
            }
        ],
    },
    {
        '<>': 'div', 'class': 'showroomsSpacer', 'html': []
    }
]