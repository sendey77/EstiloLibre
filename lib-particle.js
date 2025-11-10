window.onload = init;

function init() {
    const container = document.getElementById("three-container");

    // Inicializa Three.js
    const root = new THREERoot({
        createCameraControls: false,
        antialias: window.devicePixelRatio === 1,
        fov: 80
    });

    // Fondo transparente y render nítido
    root.renderer.setClearColor(0x000000, 0);
    root.renderer.setPixelRatio(window.devicePixelRatio || 1);
    root.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(root.renderer.domElement);

    // Cámara centrada
    root.camera.position.set(0, 0, 60);
    root.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Función para centrar y escalar el plano
    function centerPlane(plane, image) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const distance = root.camera.position.z;
        const fov = root.camera.fov * (Math.PI / 180);

        const heightVisible = 2 * Math.tan(fov / 2) * distance;
        const widthVisible = heightVisible * (containerWidth / containerHeight);

        // Aspect ratio de la imagen
        const aspect = image.width / image.height;

        // Escalado seguro para que quepa
        let planeHeight = heightVisible * 0.9;
        let planeWidth = planeHeight * aspect;
        if (planeWidth > widthVisible * 0.9) {
            planeWidth = widthVisible * 0.9;
            planeHeight = planeWidth / aspect;
        }

        plane.scale.set(planeWidth / plane.width, planeHeight / plane.height, 1);
        plane.position.set(0, 0, 0);
    }

    // Función para cargar una imagen y crear un slide
    function loadSlide(url, type, callback) {
        const loader = new THREE.ImageLoader();
        loader.setCrossOrigin("Anonymous");
        loader.load(url, function(image) {
            const size = getPlaneSize(image, container.offsetWidth, container.offsetHeight);
            const slide = new Slide(size.width, size.height, type);
            slide.setImage(image);
            centerPlane(slide, image);
            root.scene.add(slide);
            callback(slide);
        });
    }

    // Carga las dos imágenes y crea la animación
    loadSlide("https://img.webme.com/pic/e/eros-ramazzotti/particulas1.jpg", "out", function(slide1) {
        loadSlide("https://img.webme.com/pic/e/eros-ramazzotti/particulas2.jpg", "in", function(slide2) {

            // Animación con TimelineMax
            const tl = new TimelineMax({ repeat: -1, repeatDelay: 1.0, yoyo: true });
            tl.add(slide1.transition(), 0);
            tl.add(slide2.transition(), 0);

            createTweenScrubber(tl);

            window.addEventListener("keyup", function(e) {
                if (e.keyCode === 80) tl.paused(!tl.paused());
            });

        });
    });
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
