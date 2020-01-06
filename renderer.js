window.addEventListener('load', function(){ 

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        30, window.innerWidth / window.innerHeight,
        1, 1000
    );
    camera.position.z = 100;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Cube
    var geometry = new THREE.IcosahedronGeometry(20, 4);
    var material = new THREE.MeshBasicMaterial({
        color:0x00aff,
        wireframe: true});

    var cube = new THREE.Mesh(geometry,material);
    scene.add(cube);

    // Orbit controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    onWindowResize();
    window.addEventListener('resize', onWindowResize);
    render();

    function render(){
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function onWindowResize(){
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Update camera for correct shape
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

})