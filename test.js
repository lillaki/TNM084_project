var camera, scene, renderer, geometry, mesh, cubeCamera, otherMesh, otherMesh2;

// This material is applied to the PlaneBufferGeometry
var material = new THREE.RawShaderMaterial({
    fragmentShader: [
    'precision highp float;',

'uniform vec3 cameraPosition;',
'varying vec3 vReflect;',
        'varying vec3 vNormal;',

'uniform samplerCube reflectionSampler;',

'void main() {',
    'vec3 reflectVec = vReflect;',
    'vec4 cubeColor = textureCube( reflectionSampler, vec3( 1.0 * reflectVec.x, reflectVec.yz ) );',
    'gl_FragColor = vec4( vNormal.y + cubeColor.xyz, 1.0 );',
'}'

    ]
    .join('\n'),
    vertexShader: [
    'precision highp float;',
    'precision highp int;',
    
    'uniform mat4 modelMatrix;',
    'uniform mat4 modelViewMatrix;',
    'uniform mat4 projectionMatrix;',
    'uniform mat3 normalMatrix;',
    'uniform vec3 cameraPosition;',
    
    'attribute vec3 position;',
    'attribute vec3 normal;',
    'attribute vec2 uv;',
    'attribute vec2 uv2;',
    'varying vec3 vReflect;',
    'varying vec3 vNormal;',
    'varying vec3 vWorldPosition;',
   
    'void main() {',
        'vNormal = normalize( normalMatrix * normal );',
        'vec3 worldPosition = ( modelMatrix * vec4( position, 1.0 )).xyz;',
        'vec3 cameraToVertex = normalize( worldPosition - cameraPosition );',
        'vReflect = reflect( cameraToVertex, vNormal );',
        'vWorldPosition = worldPosition;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'

    ].join('\n'),
    uniforms: {
        reflectionSampler: {
            type: 't',
            value: null
        },
        cameraPosition: {
            type: 'v3',
            value: null
        },
        viewMatrix: {
            type: 'm4',
            value: null
        }
    }
});

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;
    scene.add(camera);
    
    cubeCamera = new THREE.CubeCamera( 0.1, 1000, 128 );
    scene.add(cubeCamera);

    var redShere = new THREE.MeshBasicMaterial({
        envMap: cubeCamera.renderTarget,
        reflectivity: 0.9,
        color: 0xff0000
    });
    
    geometry = new THREE.SphereGeometry( 20, 20, 50, 50 );
    mesh = new THREE.Mesh(geometry, redShere);
    scene.add(mesh);
    
    var whiteSphere = new THREE.SphereGeometry( 10, 20, 50, 50 );
    otherMesh = new THREE.Mesh(whiteSphere, new THREE.MeshBasicMaterial({
        color: 0xffffff
    }));
    otherMesh.position.x -= 35;
    scene.add(otherMesh);

   
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x555555 )
    

    material.uniforms.reflectionSampler.value = cubeCamera.renderTarget;

    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

var radius = 100;
var spinSpeed = 0.001;

function render() {

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    material.uniforms.cameraPosition.value = camera.position.clone();
    
    camera.position.x = radius * Math.sin( new Date() * spinSpeed );
    camera.position.z = radius * Math.cos( new Date() * spinSpeed );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    cubeCamera.lookAt( camera.position.clone() );
    
    mesh.visible = false;
    cubeCamera.updateCubeMap(renderer, scene);
    mesh.visible = true;
    
    renderer.render(scene, camera);
}
