AFRAME.registerComponent('selectable', {
    schema: {
        name:{type: 'string', default: 'Kein Name'},
        objectSelectorController: {default: ''},
        isSelected: {type: 'boolean', default: false} // Remove if not used.
    },

    init: function(){
        this.data.objectSelectorController = document.querySelector('#ObjectSelector');
        this.el.addEventListener('click', () => {
            console.log("Click on " + this.el.id);
            this.data.objectSelectorController.emit('changeSelection', {selectedObject: this.el});
        })
    }
});

