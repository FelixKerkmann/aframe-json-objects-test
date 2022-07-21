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
            const name      = event.detail.name;
            const key       = event.detail.key;
            const oldValue  = event.detail.oldValue;
            const newValue  = event.detail.newValue;

            if (this.isInvalidSelection(name)) {
                console.error('Ignoring update ' + updateToString(name, key, oldValue, newValue) + ' in scene because "'
                    + name + '" is not the selected object.');
                return;
            }

            console.log('Update ' + updateToString(name, key, oldValue, newValue) +  ' in scene.');

            this.setValue(key, newValue);
        });

        this.el.addEventListener('onValueSubmit', (event) => {
            const name      = event.detail.name;
            const key       = event.detail.key;
            const oldValue  = event.detail.oldValue;
            const newValue  = event.detail.newValue;

            if (this.isInvalidSelection(name)) {
                console.error('Ignoring update ' + updateToString(name, key, oldValue, newValue) + ' in database because '
                    + name + '" is not the selected object.');
                return;
            }

            if (newValue === oldValue) {
                console.warn('Ignoring update ' + updateToString(name, key, oldValue, newValue) + ' in database because '
                    + ' newValue(' + newValue + ') = oldValue(' + oldValue + ').');
                return;
            }

            console.log('Update ' + updateToString(name, key, oldValue, newValue) +  ' in database.');

            sendToServer(name, key, oldValue, newValue);

            this.updateRightPanel();
        });

        this.el.addEventListener('onFailedUpdate', (event) => {
            const name      = event.detail.name;
            const key       = event.detail.key;
            const oldValue  = event.detail.oldValue;
            const newValue  = event.detail.newValue;

            console.error('Reset ' + updateToString(name, key, oldValue, newValue));

            if(this.data.selectedObject === null || name !== this.data.selectedObject.getAttribute(SELECTABLE_COMPONENT).name){
                location.reload();
                return;
            }

            // If the selected object is changed before getting the response, the wrong object will be manipulated...
            // Should use something like setValueOfObjectByName(name, key, value) which modifies the attribute not based on current selection
            this.setValue(key, oldValue);

            this.updateRightPanel();
        })
    },

    deselectOldSelection : function(){
        const oldSelection = this.data.selectedObject;
        if(oldSelection !== null){
            this.data.selectedObject = null;
            console.log(oldSelection.getAttribute(SELECTABLE_COMPONENT).name + ' was de-selected.');
        }
    },

    selectObject : function (newSelection){
        if(newSelection === null){
            return;
        }

        this.data.selectedObject = newSelection;
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

        const positionX = selection.object3D.position.x;
        const positionY = selection.object3D.position.y;
        const positionZ = selection.object3D.position.z;
        const rotationX = THREE.Math.radToDeg(selection.object3D.rotation.x);
        const rotationY = THREE.Math.radToDeg(selection.object3D.rotation.y);
        const rotationZ = THREE.Math.radToDeg(selection.object3D.rotation.z);
        const scale = selection.object3D.scale.x;

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

    isInvalidSelection : function (name){
        return this.data.selectedObject === null || this.data.selectedObject.getAttribute(SELECTABLE_COMPONENT).name !== name
    }
});