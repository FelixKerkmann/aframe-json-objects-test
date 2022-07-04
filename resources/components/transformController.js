AFRAME.registerComponent('transform-controls', {
    schema: {
        objectSelectorController: {default: ''},
        isSelected: {type: 'boolean', default: false}
    },

    init: function(){
        this.data.objectSelectorController = document.querySelector('#ObjectSelector');
        console.log('"ObjectController": ' + this.data.objectSelectorController.getAttribute('Id'));
        this.el.addEventListener('click', () => {
            console.log("Click on " + this.el.id);
            this.data.objectSelectorController.emit('changeSelection', {selectedObject: this.el});
        })
    }
});

