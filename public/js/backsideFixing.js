function setAllBackfaces(){
    const elementsInScene = document.querySelectorAll('a-entity');
    elementsInScene.forEach(elem => {
        if(elem.hasAttribute('gltf-model')) {
            elem.addEventListener('model-loaded', () => {
                setBackside(elem.object3D)
            })
        }
    })
    elementsInScene.forEach((elem) => setBacksideOfModel(elem.object3D))
}

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
    }
    if(element.type === 'Mesh'){
        element.material.shadowSide = THREE.BackSide;
    }
}