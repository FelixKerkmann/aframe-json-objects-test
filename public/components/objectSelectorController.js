const SELECTABLE_COMPONENT = 'selectable'
const SCENE_CONTAINER = 'sceneView';
const SCENE_FULLSCREEN = 'wide';
const RIGHT_PANEL_CONTAINER = 'rightPanel';
const RIGHT_PANEL_DISABLED = 'disabled';

AFRAME.registerComponent('objectselector', {
    schema: {
        selectedObject: {default: null},
    },

    init: function(){
        this.el.addEventListener('changeSelection', (event) => {
            this.deselectOldSelection();
            this.selectObject(event.detail.selectedObject);

            if(this.data.selectedObject === null){
                this.setSceneToFullScreen();
            }else{
                this.displayRightPanel();
            }
        });

        this.el.addEventListener('onValueChange', (event) => {
            const selection = this.data.selectedObject;
            const name      = selection.getAttribute('selectable').name;
            const key       = event.detail.key;
            const oldValue  = event.detail.oldValue;
            const newValue  = event.detail.newValue;

            console.log('Update "' + key + '" of "' + name + '" from ' + oldValue + ' to ' + newValue + ' in scene.');

            this.setValue(key, newValue);
        });

        this.el.addEventListener('onValueSubmit', (event) => {
            const selection = this.data.selectedObject;
            const name = selection.getAttribute('selectable').name;
            const key = event.detail.key;
            const oldValue = event.detail.oldValue;
            const newValue = event.detail.newValue;

            console.log('Update "' + key + '" of "' + name + '" from ' + oldValue + ' to ' + newValue + ' in database.');

            try {
                this.transferChangesToServer(key, newValue);
            } catch (exception) {
                console.error('Failed to upate "' + key + '" of "' + name + '" from ' + oldValue + ' to ' + newValue + ' in database due:\n' +
                    exception + '\n' +
                    'Therefore reset "' + key + '" of ' + name + ' back to ' + oldValue);

                this.setValue(key, oldValue);
            }
            document.getElementById(key).value = oldValue;
        });
    },

    deselectOldSelection : function(){
        const oldSelection = this.data.selectedObject;
        if(oldSelection !== null){
            oldSelection.setAttribute('isSelected', false);
            this.data.selectedObject = null;
            console.log(oldSelection.getAttribute(SELECTABLE_COMPONENT).name + ' was de-selected.');
        }
    },

    selectObject : function (newSelection){
        if(newSelection === null){
            return;
        }

        this.data.selectedObject = newSelection;
        newSelection.setAttribute('isSelected', true);
        console.log(this.data.selectedObject.getAttribute(SELECTABLE_COMPONENT).name + ' was selected.');
        this.updateRightPanel();
    },

    setSceneToFullScreen : function(){
        const sceneView = document.getElementById(SCENE_CONTAINER);
        sceneView.className = SCENE_FULLSCREEN;
        const rightPanel = document.getElementById(RIGHT_PANEL_CONTAINER);
        rightPanel.className = RIGHT_PANEL_DISABLED;
    },

    displayRightPanel : function (){
        const sceneView = document.getElementById(SCENE_CONTAINER);
        sceneView.classList.remove(SCENE_FULLSCREEN);
        const rightPanel = document.getElementById(RIGHT_PANEL_CONTAINER);
        rightPanel.classList.remove(RIGHT_PANEL_DISABLED);
    },

    updateRightPanel : function(){
        const selection = this.data.selectedObject;
        let objectName =  selection.getAttribute(SELECTABLE_COMPONENT).name;

        const positionX = selection.getAttribute('position').getComponent(0);
        const positionY = selection.getAttribute('position').getComponent(1);
        const positionZ = selection.getAttribute('position').getComponent(2);
        const rotationX = selection.getAttribute('rotation')['x'];
        const rotationY = selection.getAttribute('rotation')['y'];
        const rotationZ = selection.getAttribute('rotation')['z'];
        const scale = selection.getAttribute('scale').getComponent(0);

        document.getElementById('objectName').textContent = objectName;
        document.getElementById('positionX').value = positionX.toString();
        document.getElementById('positionY').value = positionY.toString();
        document.getElementById('positionZ').value = positionZ.toString();
        document.getElementById('rotationX').value = rotationX.toString();
        document.getElementById('rotationY').value = rotationY.toString();
        document.getElementById('rotationZ').value = rotationZ.toString();
        document.getElementById('scale').value = scale;
    },

    setValue : function(key, value){
        const selection = this.data.selectedObject;

        switch(key){
            case 'positionX':
                selection.object3D.position.x = value;
                break;
            case 'positionY':
                selection.object3D.position.y = value;
                break;
            case 'positionZ':
                selection.object3D.position.z = value;
                break;
            case 'rotationX':
                selection.object3D.rotation.x = THREE.Math.degToRad(value);
                break;
            case 'rotationY':
                selection.object3D.rotation.y = THREE.Math.degToRad(value);
                break;
            case 'rotationZ':
                selection.object3D.rotation.z = THREE.Math.degToRad(value);
                break;
            case 'scale':
                selection.object3D.scale.set(value, value, value);
                break;
        }
    },

    transferChangesToServer : function(key, value){
        throw "transferChangesToServer(key, value) is not implemented yet."
    }
});