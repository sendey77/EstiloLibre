window.onload = init;

function init() {
    const container = document.getElementById("three-container");

    // Escena y cámara
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 60;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Función para crear un plano centrado con textura
    function createPlane(url, callback) {
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin("Anonymous");
        loader.load(url, function(texture) {
            const aspect = texture.image.width / texture.image.height;

            // Ajuste según cámara y contenedor
            const fov = camera.fov * Math.PI / 180;
            const heightVisible = 2 * Math.tan(fov/2) * camera.position.z;
            const widthVisible = heightVisible * (container.clientWidth / container.clientHeight);

            let planeHeight = heightVisible * 0.9;
            let planeWidth = planeHeight * aspect;
            if (planeWidth > widthVisible * 0.9) {
                planeWidth = widthVisible * 0.9;
                planeHeight = planeWidth / aspect;
            }

            const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = { width: planeWidth, height: planeHeight }; // por si quieres animar
            scene.add(mesh);
            callback(mesh);
        }, undefined, function(err){
            console.error("Error cargando la imagen:", err);
        });
    }

    // Animación básica de transición entre dos planos
    createPlane("https://img.webme.com/pic/e/eros-ramazzotti/particulas1.jpg", function(plane1){
        createPlane("https://img.webme.com/pic/e/eros-ramazzotti/particulas2.jpg", function(plane2){

            // Posición inicial
            plane1.position.z = 0;
            plane2.position.z = -1; // detrás de la primera imagen

            // TimelineMax para transición
            const tl = new TimelineMax({ repeat: -1, yoyo: true });
            tl.to(plane1.position, 1, { z: -1 });
            tl.to(plane2.position, 1, { z: 0 }, 0); // animar simultáneamente

            window.addEventListener("keyup", function(e){
                if(e.keyCode === 80) tl.paused(!tl.paused()); // tecla P para pausar
            });

            // Render loop
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();
        });
    });
}
