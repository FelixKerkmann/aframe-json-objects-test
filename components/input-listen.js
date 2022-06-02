AFRAME.registerComponent('input-listen', {
    init:
        function () {
            //which exprains grip button is pressed or not.
            //"this.el" reffers ctlR or L in this function
            this.el.grip = false;

            //Grip Pressed
            this.el.addEventListener('gripdown', function (e) {
                //Setting grip flag as true.
                this.grip = true;
            });
            //Grip Released
            this.el.addEventListener('gripup', function (e) {
                //Setting grip flag as false.
                this.grip = false;
            });

            //Raycaster intersected with something.
            this.el.addEventListener('raycaster-intersection', function (e) {
                //Store first selected object as selectedObj
                this.selectedObj = e.detail.els[0];
            });
            //Raycaster intersection is finished.
            this.el.addEventListener('raycaster-intersection-cleared', function (e) {
                //Clear information of selectedObj
                this.selectedObj = null;
            });

            //X-buttorn Pressed
            this.el.addEventListener('xbuttondown', function (e) {
                //Start pointing position to teleport
                this.emit('teleportstart');
            });

            //X-buttorn Released
            this.el.addEventListener('xbuttonup', function (e) {
                //Jump to pointed position
                this.emit('teleportend');
            });

            //A-buttorn Pressed
            this.el.addEventListener('abuttondown', function (e) {
                //Start pointing position to teleport
                this.emit('teleportstart');
            });

            //A-buttorn Released
            this.el.addEventListener('abuttonup', function (e) {
                //Jump to pointed position
                this.emit('teleportend');
            });

            this.el.addEventListener('bbuttondown', function (e) {
                changeskybox();
            })
        },

    //called every frame.
    tick: function () {

        if (!this.el.selectedObj) { return; }
        if (!this.el.grip) { return; }

        //Getting raycaster component which is attatched to ctlR or L
        //this.el means entity of ctlR or L in this function.
        var ray = this.el.getAttribute("raycaster").direction;
        //setting tip of raycaster as 1.1m forward of controller.
        var p = new THREE.Vector3(ray.x, ray.y, ray.z);
        p.normalize();
        p.multiplyScalar(1.2);
        //Convert local position into world coordinate.
        this.el.object3D.localToWorld(p);
        //Move selected object to follow the tip of raycaster.
        this.el.selectedObj.object3D.position.set(p.x, p.y, p.z);
    }
});

function changeskybox() {
    let elem = document.getElementById("#skybox");
    let skybox = elem.getAttribute("src");
    const skyboxes = [
        "hall",
        "architecture",
        "room-parkett",
        "room-white-wood",
        "track",
    ];
    let index = skyboxes.indexOf(skybox) + 1;
    if (index >= skyboxes.length) { index = 0; }
    elem.setAttribute('src', skyboxes[index]);
}

