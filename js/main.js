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
    camera.position.set(0, 2, 5);  // Kamerayı yukarı ve geriye alıyoruz

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("laviaCanvas"),
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);  // Renderer'ı body'ye ekliyoruz

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    loader = new THREE.GLTFLoader();
    loader.load(
        './lavia/laviaModel.glb',
        (gltf) => {
            model = gltf.scene;
            scene.add(model);

            console.log('✅ Lavia modeli yüklendi:', model);
            model.position.set(0, 3, 0);  // Modeli yukarıya taşıyoruz
            model.scale.set(0.5, 0.5, 0.5);  // Modeli %50 oranında küçültüyoruz

            // Modelin boyutunu konsola yazdıralım
            console.log('Model Boyutu:', model.scale);
        },
        undefined,
        (error) => {
            console.error("Model yüklenemedi:", error);
        }
    );

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

init();
