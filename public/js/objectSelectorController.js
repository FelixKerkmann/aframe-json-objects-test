// Constants for elements in the scene
const SELECTABLE_COMPONENT = 'selectable'
const SELECTOR_COMPONENT = 'objectselector'
const OBJECT_SELECTOR_ID = 'ObjectSelector'
const OBJECT_NAME_ID = 'objectName';
// Constants for events and event details
const ON_CHANGE_SELECTION_EVENT = 'onChangeSelection';
const ON_MANIPULATION_MODE_EVENT = 'changeTransformManipulation';
const ON_VALUES_CHANGE_EVENT = 'onValuesChange';
const ON_OBJECT_SUBMIT_EVENT = 'onObjectSubmit';
const ON_FAILED_UPDATE_VALUES_EVENT = 'onFailedUpdateValues';
const ON_REMOVE_SUBMIT_EVENT = 'onRemoveSubmit';
const ON_FAILED_REMOVE_EVENT = 'onFailedRemove';
const MANIPULATION_TRANSLATION = 'translation';
const MANIPULATION_ROTATION = 'rotation';
const MANIPULATION_SCALE = 'scale';
// Constants for key inputs
const DESELECT_KEY = 'Escape';
const TRANSLATE_KEY = 't';
const ROTATE_KEY = 'r';
const SCALE_KEY = 'e'
// Constants for the gui
const SCENE_CONTAINER = 'sceneView';
const SCENE_FULLSCREEN = 'wide';
const RIGHT_PANEL_CONTAINER = 'rightPanel';
const RIGHT_PANEL_DISABLED = 'disabled';

let objectSelector = null;
let transformControls = null;
let currentSelection = null;
let selectionCopy = null;
let oldValue = null;

function initialiseObjectSelection() {
    objectSelector = document.querySelector('#' + OBJECT_SELECTOR_ID);
    objectSelector.setAttribute(SELECTOR_COMPONENT, '');

    selectionCopy = {
        id: undefined,
        positionX: undefined,
        positionY: undefined,
        positionZ: undefined,
        rotationX: undefined,
        rotationY: undefined,
        rotationZ: undefined,
        scale: undefined
    };

    if(objectSelector === null || objectSelector === undefined){
        throw 'Failed to initialise object selection. Not found "' + OBJECT_SELECTOR_ID + '" (' + objectSelector + ').';
    }

    // It has to the "keyup" event because "keydown" doesn't register some keys like escape
    window.addEventListener("keyup", function (event) {
        if (event.key === DESELECT_KEY) {
            objectSelector.emit(ON_CHANGE_SELECTION_EVENT,
                {
                    selectedObject: null
                });
        }

        if(event.key === TRANSLATE_KEY){
            objectSelector.emit(ON_MANIPULATION_MODE_EVENT, {'mode': MANIPULATION_TRANSLATION});
        }

        if(event.key === ROTATE_KEY){
            objectSelector.emit(ON_MANIPULATION_MODE_EVENT, {'mode': MANIPULATION_ROTATION});
        }

        if(event.key === SCALE_KEY){
            objectSelector.emit(ON_MANIPULATION_MODE_EVENT, {'mode': MANIPULATION_SCALE});
        }
    });
}

function storeOldValue(key){
    const value = getValueFromField(key);
    if(value === undefined){
        return;
    }
    oldValue = value;
    emitOnValueSubmit(key); // If object is moved with gizmo before, all (changed) values should be updated
}

function emitOnValuesChange(key) {
    const value = getValueFromField(key);
    if(value === undefined){
        return;
    }
    const eventDetails = createEventDetailsForKey(key);
    console.log('Emit "' + ON_VALUES_CHANGE_EVENT + '" with key: ' + eventDetails.key + ', value: ' + eventDetails.newValue + '.');
    objectSelector.emit(ON_VALUES_CHANGE_EVENT, eventDetails);
}

function emitOnValueSubmit(key) {
    const eventDetails = createEventDetailsForKey(key);
    console.log('Emit "' + ON_OBJECT_SUBMIT_EVENT + '.');
    objectSelector.emit(ON_OBJECT_SUBMIT_EVENT, eventDetails);
    oldValue = null;
}

function emitRemoveObject() {
    objectSelector.emit(ON_REMOVE_SUBMIT_EVENT,
        {
            'name' : document.getElementById("objectName").textContent
        })
}

function createEventDetailsForKey(key){
    const newValue  = getValueFromField(key);
    const name      = document.getElementById(OBJECT_NAME_ID).textContent;

    return {
            'name' :     name,
            'key':       [key],
            'newValue':  [newValue]
        };
}

/**
 * Extract the value of the element with the id of parameter.
 * @param {string} key ID of the html element.
 * @returns {number | undefined} Value of the element or undefined of the value is not a number.
 */
function getValueFromField(key){
    let value = parseFloat(document.getElementById(key).value);
    if(isNaN(value)){
        return undefined;
    }
    return value;
}


// Handlers for the events
function changeSelectionHandler(event) {
    const newSelection = event.detail.selectedObject;

    if(objectIsAlreadySelected(newSelection)){
        return;
    }

    deselectOldSelection();
    selectObject(newSelection);

    // Disable right panel if no object is selected. Will be removed soon
    if(currentSelection === null){
        hideRightPanel();
    }else{
        displayRightPanel();
    }
}

function onChangeManipulationModeHandler(event){
    const mode = event.detail.mode;
    transformControls.showX = true;
    transformControls.showY = true;

    switch(mode){
        case MANIPULATION_TRANSLATION:
            transformControls.setMode('translate');
            break;
        case MANIPULATION_ROTATION:
            transformControls.setMode('rotate');
            break;
        case MANIPULATION_SCALE:
            transformControls.setMode('scale');
            transformControls.showX = false;
            transformControls.showY = false;
            break;
        case _:
            console.warn('Invalid transform mode ' + mode);
            break;
    }
}

function onValuesChangedHandler(event) {
    const name    = event.detail.name;
    let keys      = event.detail.key;
    let oldValues = getAllOldValuesByKeys(keys);
    let newValues = event.detail.newValue;

    // Only true through non UI-interactions
    if (isInvalidSelection(name)) {
        console.error('Ignoring update ' + updateValuesToString(keys, oldValues, newValues) + ' in scene because "'
            + name + '" is not the selected object.');
        return;
    }

    console.log('Update ' + updateValuesToString(keys, oldValues, newValues) +  ' in scene.');

    for(let i = 0; i < keys.length; ++i){
        setValueOfCurrentSelection(keys[i], newValues[i])
    }
}

function onValueSubmitHandler(event) {
    const name      = event.detail.name;
    const keys      = ['positionX', 'positionY', 'positionZ', 'rotationX', 'rotationY', 'rotationZ', 'scale'];
    let changedKeys = [];
    let oldValues   = [];
    let newValues   = [];

    if (isInvalidSelection(name)) {
        console.warn('Ignoring update on Object "' + name + '" in database because "'
            + name + '" is not the selected object.');
        return;
    }

    keys.forEach((key) => {
        const oldValue =  getOldValueByKey(key);
        const newValue = getValueFromField(key)

        if(oldValue !== newValue && newValue !== undefined){
            changedKeys.push(key);
            oldValues.push(oldValue);
            newValues.push(newValue);
        }
    });

    if(changedKeys.length > 0){
        sendUpdateValuesToServer(name, changedKeys, oldValues, newValues);
        updateSelectionCopy();
    }
}

function onUpdateValuesFailedHandler(event) {
    const name          = event.detail.name;
    const keys          = event.detail.keys;
    const oldValues     = event.detail.oldValues;
    const newValues     = event.detail.newValues;
    let objectToUpdate  = currentSelection;

    console.error('Reset ' + updateValuesToString(keys, newValues, oldValues) + ' for ' + name);

    // If the selected object is changed before getting the response
    if(objectToUpdate === null || name !== objectToUpdate.getAttribute(SELECTABLE_COMPONENT).name){
        objectToUpdate = document.getElementById(name);
    }

    if(objectToUpdate === null){
        console.error('Reload because object to redo update is not found in scene.');
        location.reload();
    }else{
        for(let i = 0; i < keys.length; ++i){
            setValueOfObject(objectToUpdate, keys[i], oldValues[i]);
        }
        updateSelectionCopy();
    }
}

function onRemoveSubmitHandler(event){
    const name = event.detail.name;
    sendRemoveToServer(name);
}

function onFailedToRemoveHandler(event){
    const name = event.detail.name;
    alert("failed to remove: " + name)
}

function objectIsAlreadySelected(object){
    return currentSelection === object;
}

function deselectOldSelection(){
    const oldSelection = currentSelection;
    if(oldSelection !== null){
        document.querySelector(OBJECT_SELECTOR).emit('onObjectSubmit', {'name': oldSelection.getAttribute(SELECTABLE_COMPONENT).name});
        transformControls.detach();
        currentSelection = null;
        console.log(oldSelection.getAttribute(SELECTABLE_COMPONENT).name + ' was de-selected.');
    }
}

function selectObject(newSelection){
    if(newSelection === null){
        return;
    }

    currentSelection = newSelection;
    transformControls.attach(newSelection.object3D);

    updateSelectionCopy();

    console.log(currentSelection.getAttribute(SELECTABLE_COMPONENT).name + ' was selected.');

    updateRightPanel();
}

function updateSelectionCopy(){
    const selection = currentSelection;

    if(selection === null){
        return;
    }

    const position =  selection.getAttribute('position');
    const rotation =  new THREE.Vector3(
        THREE.Math.radToDeg(selection.object3D.rotation.x),
        THREE.Math.radToDeg(selection.object3D.rotation.y),
        THREE.Math.radToDeg(selection.object3D.rotation.z));
    const scale =  selection.getAttribute('scale');

    selectionCopy.id = selection.getAttribute(SELECTABLE_COMPONENT).name;
    selectionCopy.positionX = position.x;
    selectionCopy.positionY = position.y;
    selectionCopy.positionZ = position.z;
    selectionCopy.rotationX = rotation.x;
    selectionCopy.rotationY = rotation.y;
    selectionCopy.rotationZ = rotation.z;
    selectionCopy.scale = scale.x;
}

function updateRightPanel(){
    const selection = currentSelection;

    if(selection === null){
        return;
    }

    updateAllScaleValues();
    updateTextContentIfNotFocused(['objectName']);
    updateValueIfNotFocused(['positionX', 'positionY', 'positionZ', 'scale']);
    updateValueIfNotFocused(['rotationX', 'rotationY', 'rotationZ'], THREE.Math.radToDeg);
}

function updateAllScaleValues(){
    const scaleZ = getValueByKey('scaleZ');  // If scaled by gizmo

    if(scaleZ !== getOldValueByKey('scale')){
        setValueOfCurrentSelection('scale', scaleZ);
    }
}

function getValueByKey(key){
    const selection = currentSelection;

    switch(key){
        case 'positionX':
            return selection.object3D.position.x;
        case 'positionY':
            return selection.object3D.position.y;
        case 'positionZ':
            return selection.object3D.position.z;
        case 'rotationX':
            return selection.object3D.rotation.x;
        case 'rotationY':
            return selection.object3D.rotation.y;
        case 'rotationZ':
            return selection.object3D.rotation.z;
        case 'scale':
            return selection.object3D.scale.x;
        case 'scaleX':
            return selection.object3D.scale.x;
        case 'scaleY':
            return selection.object3D.scale.y;
        case 'scaleZ':
            return selection.object3D.scale.z;
        case _ :
            throw 'Invalid key "' + key + '"';
    }
}

function getAllOldValuesByKeys(keys){
    let oldValues = [];

    keys.forEach((key) => {
        oldValues.push(getOldValueByKey(key));
    })

    return oldValues;
}

function getOldValueByKey(key){
    switch(key){
        case 'positionX':
            return selectionCopy.positionX;
        case 'positionY':
            return selectionCopy.positionY;
        case 'positionZ':
            return selectionCopy.positionZ;
        case 'rotationX':
            return selectionCopy.rotationX;
        case 'rotationY':
            return selectionCopy.rotationY;
        case 'rotationZ':
            return selectionCopy.rotationZ;
        case 'scale':
            return selectionCopy.scale;
        case 'scaleX':
            return selectionCopy.object3D.scale.x;
        case 'scaleY':
            return selectionCopy.object3D.scale.y;
        case 'scaleZ':
            return selectionCopy.object3D.scale.z;
        case _ :
            throw 'Invalid key "' + key + '"';
    }
}

function setValueOfCurrentSelection(key, value){
    setValueOfObject(currentSelection, key, value);
}

function setValueOfObject(object, key, value){
    switch(key){
        case 'positionX':
            object.object3D.position.x = value;
            break;
        case 'positionY':
            object.object3D.position.y = value;
            break;
        case 'positionZ':
            object.object3D.position.z = value;
            break;
        case 'rotationX':
            object.object3D.rotation.x = THREE.Math.degToRad(value);
            break;
        case 'rotationY':
            object.object3D.rotation.y = THREE.Math.degToRad(value);
            break;
        case 'rotationZ':
            object.object3D.rotation.z = THREE.Math.degToRad(value);
            break;
        case 'scale':
            object.object3D.scale.set(value, value, value);
            break;
    }
}

function updateTextContentIfNotFocused(keys, transformFunction = function(value) {return value.toString()}){
    keys.forEach((key => {
        let currentElement =  document.getElementById(key);

        if(currentElement === null){
            console.warn('No element with key"' + key +'" in document.')
            return;
        }

        if(currentElement !== document.activeElement){
            currentElement.textContent = transformFunction(currentSelection.getAttribute(SELECTABLE_COMPONENT).name);
        }
    }))
}

function updateValueIfNotFocused(keys, transformFunction = function(value) { return value}){
    keys.forEach((key => {
        let currentElement =  document.getElementById(key);

        if(currentElement === null){
            console.warn('No element with key"' + key +'" in document.')
            return;
        }

        if(currentElement !== document.activeElement){
            currentElement.value = transformFunction(getValueByKey(key));
        }
    }))
}

function hideRightPanel(){
    const sceneView = document.getElementById(SCENE_CONTAINER);
    sceneView.className = SCENE_FULLSCREEN;
    const rightPanel = document.getElementById(RIGHT_PANEL_CONTAINER);
    rightPanel.className = RIGHT_PANEL_DISABLED;
}

function displayRightPanel(){
    const sceneView = document.getElementById(SCENE_CONTAINER);
    sceneView.classList.remove(SCENE_FULLSCREEN);
    const rightPanel = document.getElementById(RIGHT_PANEL_CONTAINER);
    rightPanel.classList.remove(RIGHT_PANEL_DISABLED);
}

function isInvalidSelection(name){
    return currentSelection === null || currentSelection.getAttribute(SELECTABLE_COMPONENT).name !== name
}
