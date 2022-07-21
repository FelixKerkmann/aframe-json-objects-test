let objectSelector;
let oldValue;

function initialiseObjectSelection() {
    objectSelector = document.querySelector('#ObjectSelector');
    // It has to the "keyup" event because "keydown" doesn't register some keys like escape
    window.addEventListener("keyup", function (event) {
        if (event.key === 'Escape') {
            document.querySelector('#ObjectSelector').emit('changeSelection',
                {
                    selectedObject: null
                });
        }
    });
}

// TODO: Remove storeOldValue
function storeOldValue(key) {
    oldValue = document.getElementById(key).value;
}

// TODO: Only emit event
function emitOnValueChange(key) {
    const newValue = document.getElementById(key).value;

    // TODO: If input is empty should be treated better
    if (newValue === '') {
        console.warn("Ignoring onValueChange with key " + key + ", because new value is null.");
        return;
    }

    console.log("Fire \"onValueChange\" with key: " + key + ", old value: " + oldValue + ", new value: " + newValue);

    objectSelector.emit("onValueChange",
        {
            'name' : document.getElementById("objectName").textContent,
            'key': key,
            'oldValue': oldValue,
            'newValue': newValue
        });
}
// TODO: Only emit event
function emitOnValueSubmit(key) {
    const newValue = document.getElementById(key).value;

    // TODO: If input is empty should be treated better
    if (newValue === '') {
        console.warn("Ignoring onValueChange with key " + key + ", because new value is null.");
        return;
    }

    if (oldValue === newValue) {
        console.warn("Ignoring onValueChange with key " + key + ", because value did not change.");
        return;
    }

    console.log("Fire \"onValueSubmit\" with key: " + key + ", old value: " + oldValue + ", new value: " + newValue);

    objectSelector.emit("onValueSubmit",
        {
            'name' : document.getElementById("objectName").textContent,
            'key': key,
            'oldValue': oldValue,
            'newValue': newValue
        });

    oldValue = null;
}

// TODO: Write function for event creation

function emitRemoveObject() {
    objectSelector.emit('onRemoveSubmit',
        {
            'name' : document.getElementById("objectName").textContent
        })
}
