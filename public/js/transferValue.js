const OBJECT_NAME_ID = 'objectName'
const OBJECT_SELECTOR_ID = '#ObjectSelector'
const ON_VALUE_CHANGE = 'onValueChange'
const ON_VALUE_SUBMIT = 'onValueSubmit'
let objectSelector;
let oldValue;

function initialiseObjectSelection() {
    objectSelector = document.querySelector(OBJECT_SELECTOR_ID);

    if(objectSelector === null || objectSelector === undefined){
        throw 'Failed to initialise object selection. Not found "' + OBJECT_SELECTOR_ID + '" (' + objectSelector + ').';
    }

    // It has to the "keyup" event because "keydown" doesn't register some keys like escape
    window.addEventListener("keyup", function (event) {
        if (event.key === 'Escape') {
            objectSelector.emit('changeSelection',
                {
                    selectedObject: null
                });
        }
    });
}

function storeOldValue(key) {
    oldValue = getValueFromField(key);
}

function emitOnValueChange(key) {
    const eventDetails = createEventDetailsForKey(key);
    console.log('Emit "' + ON_VALUE_CHANGE + '" with key: ' + eventDetails.key + ', old value: ' + eventDetails.oldValue + ', new value: ' + eventDetails.newValue + '.');
    objectSelector.emit(ON_VALUE_CHANGE, eventDetails);
}

function emitOnValueSubmit(key) {
    const eventDetails = createEventDetailsForKey(key);
    console.log('Emit "' + ON_VALUE_SUBMIT + '" with key: ' + eventDetails.key + ', old value: ' + eventDetails.oldValue + ', new value: ' + eventDetails.newValue + '.');
    objectSelector.emit(ON_VALUE_SUBMIT, eventDetails);
    oldValue = null;
}

function createEventDetailsForKey(key){
    const newValue  = getValueFromField(key);
    const name      = document.getElementById(OBJECT_NAME_ID).textContent;

    return {
            'name' :    name,
            'key':      key,
            'oldValue': oldValue,
            'newValue': newValue
        };
}

function getValueFromField(key){
    let value    = document.getElementById(key).value;
    if(document.getElementById(key).type === 'number'){
        value = parseFloat(value);
    }
    return value;
}

function emitRemoveObject() {
    objectSelector.emit('onRemoveSubmit',
        {
            'name' : document.getElementById("objectName").textContent
        })
}

