const MAIL = 'useremail'
const SHOWROOM = 'showroomid'
const OBJECT_SELECTOR = '#ObjectSelector'
let socket = io();

socket.on('updateFailed', (name, key, oldValue, newValue) => {
    console.error('Update ' + updateToString(name, key, oldValue, newValue) + ' failed to update in database.');
    document.querySelector(OBJECT_SELECTOR).dispatchEvent(createOnFailedUpdateEvent(name, key, oldValue, newValue));
})

socket.on('updateSuccess', (name, key, oldValue, newValue) => {
    console.log('Update ' + updateToString(name, key, oldValue, newValue) + ' deployed successfully in database.');
})

function updateToString(name, key, newValue, oldValue){
    return '"' + key + '" of "' + name + '" from ' + oldValue + ' to ' + newValue;
}

function createOnFailedUpdateEvent(name, key, oldValue, newValue){
    return new CustomEvent('onFailedUpdate',
        {
            detail:
                {
                    name: name,
                    key: key,
                    oldValue: oldValue,
                    newValue: newValue
                }
        });
}

function sendToServer(name, key, oldValue, newValue) {
    console.log('Send update: ' + updateToString(name, key, newValue, oldValue) + ' to server.')

    const mail = document.getElementById(MAIL).value;
    const showroom = document.getElementById(SHOWROOM).value;

    socket.emit('updateValue', mail, showroom, name, key, oldValue, newValue);
}