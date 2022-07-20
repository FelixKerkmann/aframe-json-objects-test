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

function storeOldValue(key) {
    oldValue = document.getElementById(key).value;
}

function emitOnValueChange(key) {
    const newValue = document.getElementById(key).value;

    console.log("Fire \"onValueChange\" with key: " + key + ", old value: " + oldValue + ", new value: " + newValue);

    objectSelector.emit("onValueChange",
        {
            'name' : document.getElementById("objectName").textContent,
            'key': key,
            'oldValue': oldValue,
            'newValue': newValue
        });
}

function emitOnValueSubmit(key) {
    const newValue = document.getElementById(key).value;

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

