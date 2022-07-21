exports.listShowrooms = {
    '<>': 'ul', 'class': 'model', 'html': [
        {
            '<>': 'a',
            'href': '/showroom/${_id}/edit',
            'html': [
                {
                    '<>': 'li', 'html': [
                        {'<>': 'h3', 'text': '${showroomname}'}
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
                        {'<>': 'input', 'type': 'submit', 'value': 'delete'}
                    ]
                }
            ]
        }
    ]
}