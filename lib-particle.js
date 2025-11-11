<script>
window.addEventListener("load", () => {
    const container = document.getElementById("three-container");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    let planes = [];

    function createPlane(url, callback) {
        new THREE.TextureLoader().load(url, (texture) => {
            const imgAspect = texture.image.width / texture.image.height;
            const containerAspect = container.clientWidth / container.clientHeight;

            let planeWidth, planeHeight;
            if (imgAspect > containerAspect) {
                planeWidth = 50;
                planeHeight = planeWidth / imgAspect;
            } else {
                planeHeight = 50;
                planeWidth = planeHeight * imgAspect;
            }

            const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, 0);

            scene.add(mesh);
            planes.push(mesh);
            callback(mesh);
        });
    }

    createPlane("https://img.webme.com/pic/e/eros-ramazzotti/particulas1b.jpg", (plane1) => {
        createPlane("https://img.webme.com/pic/e/eros-ramazzotti/particulas2b.jpg", (plane2) => {
            plane1.position.z = 0;
            plane2.position.z = -1;

            const tl = new TimelineMax({ repeat: -1, yoyo: true });
            tl.to(plane1.position, 1, { z: -1 });
            tl.to(plane2.position, 1, { z: 0 }, 0);

            window.addEventListener("keyup", (e) => {
                if (e.key === "p" || e.key === "P") tl.paused(!tl.paused());
            });

            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();
        });
    });

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);

        // Recalcular tamaño de los planos
        planes.forEach(plane => {
            const imgAspect = plane.material.map.image.width / plane.material.map.image.height;
            const containerAspect = container.clientWidth / container.clientHeight;

            if (imgAspect > containerAspect) {
                plane.scale.set(50, 50 / imgAspect, 1);
            } else {
                plane.scale.set(50 * imgAspect, 50, 1);
            }

            plane.position.set(0, 0, plane.position.z);
        });
    });
});
</script>
