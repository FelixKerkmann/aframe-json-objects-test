exports.listshowrooms = {
    '<>': 'ul', 'class': 'model', 'html': [
        {
            '<>': 'a',
            'href': '/showroom/${_id}',
            'html': [
                {
                    '<>': 'li', 'html': [
                        {'<>': 'h3', 'text': '${name}'}
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
                            'name': 'name',
                            'value': '${name}',
                            'style': 'visibility: hidden;'
                        },
                        {'<>': 'input', 'type': 'submit', 'value': 'delete'}
                    ]
                }
            ]
        }
    ]
}