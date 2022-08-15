exports.listShowrooms = {
    '<>': 'li', 'html': [
        {
            '<>': 'ul', 'class': 'room', 'html': [
                {
                    '<>': 'li', 'html': [
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
