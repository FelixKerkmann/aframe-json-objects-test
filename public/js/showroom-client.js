let socket = io();

function initSocket() {

    let messages = document.getElementById('messages');
    let input = document.getElementById('input');

    input.addEventListener('test', (e) => socket.emit('update value', e.detail))

    socket.on('update value', function(msg) {
        let item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}

function emitEvent () {
    document.getElementById('input').dispatchEvent(new CustomEvent('test', {
        detail: {
            'email' : 'email',
            'showroom' : 'showroom',
            'name' : 'testname',
            'value' : 'testvalue',
            'key' : 'testkey'
        }
    }))
}

/*

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(input.value) {
        socket.emit('update value', { obj: selectedObject, key: attribute, value: input.value})
    }
})

socket.on('connect', () => {
    socket.emit('update value', {obj: "test obj", key: "test key", value: "test value"})
})

socket.on('update value', (obj, key, value) => {
    console.log("success")
})
*/