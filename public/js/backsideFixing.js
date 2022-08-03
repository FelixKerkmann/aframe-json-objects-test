function setAllBackfaces(){

    const elementsInScene = document.querySelector('a-scene').sceneEl.object3D.children;

    elementsInScene.forEach(setBacksideOfModel);

    function setBacksideOfModel(model){
        if(isTheRoom(model) || isASelectable(model)){
            model.children.forEach(setBackside);
        }
    }

    function isTheRoom(element){
        try{
            return element.el.id === 'Room';

        }catch(_){
            return false; // Has no el (not an a-frame entity)
        }
    }

    function isASelectable(element){
        try{
            return element.el.getAttribute('selectable') !== null;

        }catch(_){
            return false; // Has no selectable component
        }
    }

    function setBackside(element)
    {
        if(element.type === 'Group'){
            element.children.forEach(setBackside);
            return;
        }

        if(element.type === 'Mesh'){
            element.material.shadowSide = THREE.BackSide;
            console.log('Changed backside of ' + element.name + ' of ' + element.parent.name);
        }
    }
}
