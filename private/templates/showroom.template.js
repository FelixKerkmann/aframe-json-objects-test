exports.listShowrooms = {
    '<>': 'li', 'html': [
        {
            '<>': 'ul', 'class': 'room', 'html': [
                {
                    '<>': 'li', 'class' : 'sname', 'html': [
                        {
                            '<>': 'a',
                            'href': '/showroom/${_id}',
                            'text': '${showroomname}'
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
                                {'<>': 'button', 'type': 'submit', 'text': 'delete', 'class' : 'btn-cancel'}
                            ]
                        }
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'a',
                            'class' : 'button button-outline',
                            'href': '/vr/${_id}',
                            'text': 'VR mode'
                        },
                    ]
                },
                {
                    '<>': 'li', 'html': [
                        {
                            '<>': 'a',
                            'class' : 'button button-outline',
                            'href': '/rename/${_id}',
                            'text': 'Rename'
                        },
                    ]
                }
            ]
        }
    ]
}

exports.tableShowrooms = {
    '<>': 'tr', 'html': [
        {
            '<>': 'td', 'class': 'sname', 'html': [
                {
                    '<>': 'a',
                    'href': '/showroom/${_id}',
                    'text': '${showroomname}'
                },
            ]
        },
        {
            '<>': 'td', 'html': [
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
            ]
        },
        {
            '<>': 'td', 'html': [
                {
                    '<>': 'a',
                    'class': 'button button-outline',
                    'href': '/vr/${_id}',
                    'text': 'VR mode'
                },
            ]
        },
        {
            '<>': 'td', 'html': [
                {
                    '<>': 'a',
                    'class': 'button button-outline',
                    'href': '/rename/${_id}',
                    'text': 'Rename'
                },
            ]
        }
    ]
}

exports.gridShowroom = {
    '<>' : 'div', 'class' : 'grid-container', 'html' : [
        {
            '<>': 'div', 'class': 'sname grid-item grid-text', 'html': [
                {
                    '<>' : 'p', 'html' : [
                        {
                            '<>': 'a',
                            'href': '/showroom/${_id}',
                            'text': '${showroomname}'
                        },
                    ]
                },
            ]
        },
        {
            '<>': 'div', 'class' : 'grid-item grid-button', 'html': [
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
            ]
        },
        {
            '<>': 'div', 'class' : 'grid-item grid-button', 'html': [
                {
                    '<>': 'a',
                    'class': 'button button-outline',
                    'href': '/vr/${_id}',
                    'text': 'VR mode'
                },
            ]
        },
        {
            '<>': 'div', 'class' : 'grid-item grid-button', 'html': [
                {
                    '<>': 'a',
                    'class': 'button button-outline',
                    'href': '/rename/${_id}',
                    'text': 'Rename'
                },
            ]
        }
    ]
}

exports.singleShowroomGrid = [
    {
        '<>': 'div', 'class': 'sname grid-item grid-text', 'html': [
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
        '<>': 'div', 'class': 'grid-item grid-button', 'html': [
            {
                '<>': 'a',
                'class': 'button button-outline',
                'href': '/vr/${_id}',
                'text': 'VR mode'
            },
        ],
    },
    {
        '<>': 'div', 'class' : 'grid-item grid-button', 'html': [
            {
                '<>': 'a',
                'class': 'button button-outline',
                'href': '/rename/${_id}',
                'text': 'Rename'
            },
        ]
    },
    {
        '<>': 'div', 'class': 'grid-item grid-button', 'html': [
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