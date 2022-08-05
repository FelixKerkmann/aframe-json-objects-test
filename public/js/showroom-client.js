const MAIL = 'useremail'
const SHOWROOM = 'showroomid'
const OBJECT_SELECTOR = '#ObjectSelector'
let socket = io();

socket.on("connect", () => {
    console.log("Client Socket connection established")
})

socket.on("disconnect", () => {
    location.reload()
})

socket.on('updateValuesSuccess', (name, keys, oldValues, newValues) => {
    console.log('Update ' + updateValuesToString(keys, oldValues, newValues) + ' deployed successfully in database.');
})

socket.on('updateValuesFailed', (name, keys, oldValues, newValues) => {
    console.log('Failed to updating values of ' + name + ':\n' + updateValuesToString(keys, oldValues, newValues) + 'in database.')

    document.querySelector(OBJECT_SELECTOR).dispatchEvent(createOnFailedUpdateValuesEvent(name, keys, oldValues, newValues));
})

function createOnFailedUpdateValuesEvent(name, keys, oldValues, newValues){
    return new CustomEvent('onFailedUpdateValues',
        {
            detail:
                {
                    name: name,
                    keys: keys,
                    oldValues: oldValues,
                    newValues: newValues
                }
        });
}

socket.on('removeSuccess', () => {
    location.reload()
})

socket.on('removeFailed', name => {
    document.querySelector(OBJECT_SELECTOR).dispatchEvent(new CustomEvent('onFailedRemove',
        {
            detail: { name: name }
        }))
})

function sendUpdateValuesToServer(name, keys, oldValues, newValues){
    console.log('Send update of values of ' + name + ':\n' + updateValuesToString(keys, oldValues, newValues) + 'to server.')
    const mail = document.getElementById(MAIL).value;
    const showroom = document.getElementById(SHOWROOM).value;
    socket.emit('updateValues', mail, showroom, name, keys, oldValues, newValues);
}

function updateValuesToString(keys, oldValues, newValues){
    let result = '';
    for(let i = 0; i < keys.length; ++i){
        result += keys[i] + ' from ' + oldValues[i] + ' to ' + newValues[i] + '\n';
    }
    return result;
}

function sendRemoveToServer(name) {
    const mail = document.getElementById(MAIL).value;
    const showroom = document.getElementById(SHOWROOM).value;
    socket.emit('removeObject', mail, showroom, name)
}