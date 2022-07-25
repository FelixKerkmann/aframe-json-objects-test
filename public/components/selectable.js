AFRAME.registerComponent('selectable', {
    schema: {
        name:{type: 'string', default: 'Kein Name'},
        objectSelectorController: {default: ''},
    },
    init: function(){
        this.data.objectSelectorController = document.querySelector('#ObjectSelector');
        this.el.addEventListener('click', () => {
            console.log("Click on " + this.data.name);
            this.data.objectSelectorController.emit(ON_CHANGE_SELECTION_EVENT, {selectedObject: this.el});
        })
    }
});

