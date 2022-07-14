const SELECTABLE_COMPONENT = 'selectable'

AFRAME.registerComponent('objectselector', {
    schema: {
        selectedObject: {default: null},
    },

    init: function(){
        this.el.addEventListener('changeSelection', (event) => {
            this.deselectOldSelection();
            this.selectObject(event.detail.selectedObject);
        });
    },

    deselectOldSelection : function(){
        const oldSelection = this.data.selectedObject;
        if(oldSelection !== null){
            oldSelection.setAttribute('isSelected', false);
            this.data.selectedObject = null;
            console.log(oldSelection.id + ' was de-selected.');
        }
    },

    selectObject : function (newSelection){
        this.data.selectedObject = newSelection;
        newSelection.setAttribute('isSelected', true);
        console.log(this.data.selectedObject.id + ' was selected.');
        this.updateRightPanel();
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
    }
});