AFRAME.registerComponent('selectable', {
    schema: {
        name:{type: 'string', default: 'Kein Name'},
        objectSelectorController: {default: ''},
    },
    init: function(){
        this.data.objectSelectorController = document.querySelector('#ObjectSelector');
        this.el.addEventListener('click', () => {
            console.log("Click on " + this.data.name);
            this.data.objectSelectorController.emit('changeSelection', {selectedObject: this.el});
        })
    }
});

