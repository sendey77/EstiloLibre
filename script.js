const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const image1 = new Image();
const image2 = new Image();

// Evita error CORS usando proxy
const proxy = "https://corsproxy.io/?";
image1.crossOrigin = "anonymous";
image2.crossOrigin = "anonymous";

image1.src = proxy + "https://github.com/sendey77/EstiloLibre/blob/main/particulas1.jpg?raw=true";
image2.src = proxy + "https://github.com/sendey77/EstiloLibre/blob/main/particulas2.jpg?raw=true";

const particles = [];
const particleCount = 4000;
let switching = false;

class Particle {
  constructor(x, y, color) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.destX = x;
    this.destY = y;
    this.color = color;
    this.size = 1.5;
  }

  update() {
    this.x += (this.destX - this.x) * 0.07;
    this.y += (this.destY - this.y) * 0.07;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function getImageData(img) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  tempCtx.drawImage(img, 0, 0);
  const data = tempCtx.getImageData(0, 0, img.width, img.height).data;

  const points = [];
  for (let y = 0; y < img.height; y += 3) {
    for (let x = 0; x < img.width; x += 3) {
      const index = (y * img.width + x) * 4;
      const alpha = data[index + 3];
      if (alpha > 128) {
        const color = `rgb(${data[index]}, ${data[index + 1]}, ${data[index + 2]})`;
        points.push({ x, y, color });
      }
    }
  }
  return points;
}

function createParticles(points) {
  particles.length = 0;
  for (let i = 0; i < Math.min(points.length, particleCount); i++) {
    const p = points[i];
    particles.push(new Particle(p.x, p.y, p.color));
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
}

function animate() {
  drawParticles();
  requestAnimationFrame(animate);
}

function transitionTo(points) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const target = points[i % points.length];
    p.destX = target.x + (canvas.width - image1.width) / 2;
    p.destY = target.y + (canvas.height - image1.height) / 2;
    p.color = target.color;
  }
}

// Esperar hasta que las imágenes estén listas
Promise.all([image1.decode(), image2.decode()]).then(() => {
  console.log("Imágenes cargadas:", image1.width, image2.width);
  const points1 = getImageData(image1);
  const points2 = getImageData(image2);

  console.log("Partículas iniciales:", points1.length);

  createParticles(points1);
  animate();

  // Cambiar entre imágenes cada 4 segundos
  setInterval(() => {
    switching = !switching;
    transitionTo(switching ? points2 : points1);
  }, 4000);
});