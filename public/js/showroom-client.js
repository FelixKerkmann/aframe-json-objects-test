console.log("start of code")

let socket = io();

function start() {
    console.log("start function")
    let messages = document.getElementById('messages');
    let form = document.getElementById('form');
    let input = document.getElementById('input');

    form.addEventListener('test', function(e) {
        console.log("in listener")
        //e.preventDefault();
        /*if (input.value) {
            socket.emit('update value', input.value);
            input.value = '';
        }*/
    });

    socket.on('update value', function(msg) {
        let item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
        console.log("end of function")
    });
}

function test() {
    let x = document.getElementById('form');
    let input = document.getElementById('input');
    console.log(input.value)
    console.log(x)
    x.emit("test", {})
}

document.onload = () => start()

console.log("end of code")
/*
let form = document.getElementById('autosave');
let selectedObject = document.getElementsByName('');
let attribute = onmouseleave(ev);
let input = document.getElementsByName(attribute)

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