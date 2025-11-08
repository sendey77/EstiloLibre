window.onload = init;

function init() {
    var container = document.getElementById("three-container");

    var root = new THREERoot({
        createCameraControls: false,
        antialias: window.devicePixelRatio === 1,
        fov: 80
    });

    root.renderer.setClearColor(0x000000, 0);
    root.renderer.setPixelRatio(window.devicePixelRatio || 1);
    root.camera.position.set(0, 0, 60);

    // Margen superior opcional
    var topMargin = 5; // ajusta según necesites

    // Carga la primera imagen
    var l1 = new THREE.ImageLoader();
    l1.setCrossOrigin("Anonymous");
    l1.load("https://dl.dropboxusercontent.com/s/fi8fjz2tw5ma8rx/particulas1.jpg", function(image1) {
        var size1 = getPlaneSize(image1, container.offsetWidth, container.offsetHeight);
        var slide1 = new Slide(size1.width, size1.height, "out");
        slide1.position.y += topMargin; // aplicar margen superior
        slide1.setImage(image1);
        root.scene.add(slide1);

        // Carga la segunda imagen
        var l2 = new THREE.ImageLoader();
        l2.setCrossOrigin("Anonymous");
        l2.load("https://dl.dropboxusercontent.com/s/73tobxn10pqtm4d/particulas2.jpg", function(image2) {
            var size2 = getPlaneSize(image2, container.offsetWidth, container.offsetHeight);
            var slide2 = new Slide(size2.width, size2.height, "in");
            slide2.position.y += topMargin; // aplicar margen superior
            slide2.setImage(image2);
            root.scene.add(slide2);

            // Animación
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
}

// Función para ajustar tamaño del plano según proporción de la imagen y contenedor
function getPlaneSize(image, containerWidth, containerHeight) {
    const imageAspect = image.width / image.height;
    const containerAspect = containerWidth / containerHeight;

    let width, height;

    if (imageAspect > containerAspect) {
        // Imagen más ancha que contenedor
        width = containerWidth;
        height = containerWidth / imageAspect;
    } else {
        // Imagen más alta que contenedor
        height = containerHeight;
        width = containerHeight * imageAspect;
    }

    return { width, height };
}
