window.onload = init;

function init() {
    var container = document.getElementById("three-container");

    // Inicializa Three.js
    var root = new THREERoot({
        createCameraControls: false,
        antialias: window.devicePixelRatio === 1,
        fov: 80
    });

    // Fondo transparente y render nítido
    root.renderer.setClearColor(0x000000, 0);
    root.renderer.setPixelRatio(window.devicePixelRatio || 1);

    // Centra la cámara
    root.camera.position.set(0, 0, 60);
    root.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Ajusta tamaño del renderer al contenedor
    root.renderer.setSize(container.clientWidth, container.clientHeight);

    // Función para centrar y escalar los planos de manera segura
    function centerPlane(plane) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const distance = root.camera.position.z;
        const fov = root.camera.fov * (Math.PI / 180);

        const heightVisible = 2 * Math.tan(fov / 2) * distance;
        const widthVisible = heightVisible * (containerWidth / containerHeight);

        // Posición centrada
        plane.position.set(0, 0, 0);

        // Escalado seguro para que quepa completamente en el contenedor
        const scaleX = widthVisible / plane.width;
        const scaleY = heightVisible / plane.height;
        const scale = Math.min(scaleX, scaleY) * 0.9; // deja margen
        plane.scale.set(scale, scale, 1);
    }

    // --- Carga la primera imagen ---
    var l1 = new THREE.ImageLoader();
    l1.setCrossOrigin("Anonymous");
    l1.load("https://dl.dropboxusercontent.com/s/fi8fjz2tw5ma8rx/particulas1.jpg", function(image1) {
        var size1 = getPlaneSize(image1, container.offsetWidth, container.offsetHeight);
        var slide1 = new Slide(size1.width, size1.height, "out");
        slide1.setImage(image1);
        centerPlane(slide1);
        root.scene.add(slide1);

        // --- Carga la segunda imagen ---
        var l2 = new THREE.ImageLoader();
        l2.setCrossOrigin("Anonymous");
        l2.load("https://dl.dropboxusercontent.com/s/73tobxn10pqtm4d/particulas2.jpg", function(image2) {
            var size2 = getPlaneSize(image2, container.offsetWidth, container.offsetHeight);
            var slide2 = new Slide(size2.width, size2.height, "in");
            slide2.setImage(image2);
            centerPlane(slide2);
            root.scene.add(slide2);

            // --- Animación ---
            var tl = new TimelineMax({ repeat: -1, repeatDelay: 1.0, yoyo: true });
            tl.add(slide1.transition(), 0);
            tl.add(slide2.transition(), 0);

            createTweenScrubber(tl);

            window.addEventListener("keyup", function(e) {
                if (e.keyCode === 80) {
                    tl.paused(!tl.paused());
                }
            });
        });
    });

    // Asegura que el canvas esté centrado
    root.renderer.domElement.style.display = "block";
    root.renderer.domElement.style.margin = "0 auto";
}

// Mantén esta función igual
function getPlaneSize(image, containerWidth, containerHeight) {
    const imageAspect = image.width / image.height;
    const containerAspect = containerWidth / containerHeight;

    let width, height;

    if (imageAspect > containerAspect) {
        width = containerWidth;
        height = containerWidth / imageAspect;
    } else {
        height = containerHeight;
        width = containerHeight * imageAspect;
    }

    return { width, height };
}
