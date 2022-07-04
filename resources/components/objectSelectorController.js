AFRAME.registerComponent('object-selector', {
    schema: {
        selectedObject: {default: null},
        transformController: {default: ''}
    },

    init: function(){
        console.log('Init on ' + this.el.id);
        // Instantiate TransformControls here
        this.el.addEventListener('changeSelection', (event) => {
            const oldSelection = this.data.selectedObject;
            if(oldSelection !== null){
                oldSelection.setAttribute('isSelected', false);
                this.data.selectedObject = null;
                console.log(oldSelection.id + ' was de-selected.');
            }

            this.data.selectedObject = event.detail.selectedObject;
            // Attach TransformControls to selected object here
            this.data.selectedObject.setAttribute('isSelected', true);
            console.log(this.data.selectedObject.id + ' was selected.');
        });
    },
});