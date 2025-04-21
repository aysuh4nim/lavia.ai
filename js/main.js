"use strict";
THREE.GLTFLoader = GLTFLoader;

let scene, camera, renderer, loader;
let model;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.5, 3);  // Kamerayı daha iyi bir açıya getiriyoruz

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("laviaCanvas"),
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);  // Renderer'ı body'ye ekliyoruz

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2).normalize();  // Işığın konumunu daha verimli yapıyoruz
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);  // Ortam ışığı ekliyoruz
    scene.add(ambientLight);

    loader = new THREE.GLTFLoader();
    loader.load(
        './lavia/laviaModel.glb',
        (gltf) => {
            model = gltf.scene;
            scene.add(model);

            console.log('✅ Lavia modeli yüklendi:', model);
            model.position.set(0, 0, 0);  // Modeli merkeze yerleştiriyoruz
            model.scale.set(0.5, 0.5, 0.5);  // Modeli %50 oranında küçültüyoruz

            // Modelin boyutunu konsola yazdıralım
            console.log('Model Boyutu:', model.scale);
        },
        undefined,
        (error) => {
            console.error("Model yüklenemedi:", error);
        }
    );

    window.addEventListener('resize', onWindowResize, false);  // Pencere boyutu değiştiğinde yeniden render yapıyoruz

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);  // Pencere boyutuna göre renderer'ı ayarlıyoruz
}

init();
