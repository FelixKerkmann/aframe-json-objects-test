const MAIL = 'useremail'
const SHOWROOM = 'showroomid'
let socket = io();

socket.on('updateValueDone', (name, key, value) => {
    console.log('[answerFromServer] ' + name + ', ' + key + ', ' + value);
});

function sendToServer(name, key, value){
    console.log('[sendToServer] ' + name + ', ' + key + ', ' + value)
    const mail = document.getElementById(MAIL).value;
    const showroom = document.getElementById(SHOWROOM).value;

    socket.emit('updateValue', mail, showroom, name, key, value);
}