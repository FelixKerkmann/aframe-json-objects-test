import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

AFRAME.registerComponent('objectselector', {

    init: function(){
        const camera        = this.el.sceneEl.camera;
        const renderer      = this.el.sceneEl.renderer;
        const scene         = this.el.sceneEl.object3D;
        transformControls   = new TransformControls(camera, renderer.domElement);
        scene.add(transformControls);

        this.el.addEventListener(ON_CHANGE_SELECTION_EVENT, changeSelectionHandler);

        this.el.addEventListener(ON_MANIPULATION_MODE_EVENT, onChangeManipulationModeHandler)

        // Used for changes through the panel, update scene only
        this.el.addEventListener(ON_VALUES_CHANGE_EVENT, onValuesChangedHandler);

        // Used if object will is deselected, necessary if changes are made through 3D-Gizmos because inValueChange and onValueSubmit are not emitted.
        this.el.addEventListener(ON_OBJECT_SUBMIT_EVENT, onValueSubmitHandler);

        this.el.addEventListener(ON_FAILED_UPDATE_VALUES_EVENT, onUpdateValuesFailedHandler);

        this.el.addEventListener(ON_REMOVE_SUBMIT_EVENT, onRemoveSubmitHandler);

        this.el.addEventListener(ON_FAILED_REMOVE_EVENT, onFailedToRemoveHandler);
    },

    tick: function(){
        try{
            updateRightPanel();
        }catch(exception){
            console.error('Failed to update right panel due: ' + exception);
        }
    }
});