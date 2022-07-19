AFRAME.registerComponent('selectable', {
    schema: {
        name:{type: 'string', default: 'Kein Name'},
        objectSelectorController: {default: ''},
        isSelected: {type: 'boolean', default: false} // TODO: Remove if not used.git
    },

    init: function(){
        this.data.objectSelectorController = document.querySelector('#ObjectSelector');
        this.el.addEventListener('click', () => {
            console.log("Click on " + this.data.name);
            this.data.objectSelectorController.emit('changeSelection', {selectedObject: this.el});
        })
    }
});

