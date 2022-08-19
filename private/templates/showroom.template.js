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
        '<>': 'div',
        'class' : 'listen-delete',
        'html': [
            {
                '<>': 'form',
                'action': '/delete/${_id}',
                'method': 'post',
                'enctype': 'application/json',
                'html': [
                    {
                        '<>' : 'div',
                        'class' : 'id-elem',
                        'id' : '${_id}',
                        'style' : 'visibility: hidden',
                        'html' : [
                            {
                                '<>': 'div',
                                'class': 'popup-content',
                                'html': [
                                    {
                                        '<>' : 'p',
                                        'html' : 'Are you sure you want to delete <b>${showroomname}</b>?'
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
                        '<>': 'input',
                        'type': 'hidden',
                        'name': 'id',
                        'value': '${_id}',
                        'style': 'visibility: hidden;'
                    },
                    {
                        '<>': 'a',
                        'text': 'delete',
                        'class': 'button button-outline button-delete safe-delete'
                    }
                ]
            }
        ],
    },
    {
        '<>': 'div', 'class': 'showroomsSpacer', 'html': []
    }
]