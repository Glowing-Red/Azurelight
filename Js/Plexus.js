const canvas = document.getElementById("Plexus Canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Add a gradient canvas
const gradientCanvas = document.createElement("canvas");
const gradientCtx = gradientCanvas.getContext("2d");
gradientCanvas.id = "canvas2";
gradientCanvas.width = canvas.width;
gradientCanvas.height = canvas.height;

// Create a gradient on the gradient canvas (adjust gradient colors and style as needed)
const gradient = gradientCtx.createLinearGradient(
    0, 0, canvas.width, canvas.height
);

gradient.addColorStop(0, "rgba(179,0,255,1)"); // End color
gradient.addColorStop(0.45, "rgba(84,53,255,1)");
gradient.addColorStop(0.6, "rgba(0,100,255,1)");
gradient.addColorStop(1, "rgba(0,173,255,1)"); // Start color

gradientCtx.fillStyle = gradient;
gradientCtx.fillRect(0, 0, canvas.width, canvas.height);


// Function to sample color from the gradient canvas
function getColorAtPosition(x, y) {
  const pixel = gradientCtx.getImageData(x, y, 1, 1);
  const color = `rgba(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}, ${pixel.data[3] / 255})`;
  return color;
}

// Optimized Math.random() function
function RandomInteger(min, max) {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxValid = Math.pow(256, bytesNeeded) - Math.pow(256, bytesNeeded) % range;
  
    let randomBytes = new Uint8Array(bytesNeeded);
    let randomValue = 0;
  
    do {
        window.crypto.getRandomValues(randomBytes);
        randomValue = randomBytes.reduce((acc, byte) => acc * 256 + byte);
    } while (randomValue >= maxValid);
  
    return min + (randomValue % range);
  }

// get mouse position
let mouse = {
    x: undefined,
    y: undefined,
    radius: (canvas.height/80) * (canvas.width/80)
}

/*window.addEventListener("mousemove",
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);*/

document.addEventListener("scroll", function(event) {
   console.log(event);
});

// create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = getColorAtPosition(x, y); // Sample color from gradient
    }
    //method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // check particle position, check mouse position, move the particle, draw the particle
    update() {
        // check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
        // draw particle
        this.color = getColorAtPosition(this.x, this.y);
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (RandomInteger(3000, 6000)/1000);
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2) + size * 2));
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2) + size * 2));
        let directionX = (Math.random() * 5) - 2;
        let directionY = (Math.random() * 5) - 2;
        let color = this.color;

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
}

// check if particles are close enough to draw line between them
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y)));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                const colour = ctx.createLinearGradient(0, 0, 1, 1);
                colour.addColorStop(0, getColorAtPosition(particlesArray[a].x, particlesArray[a].y));
                colour.addColorStop(1, getColorAtPosition(particlesArray[b].x, particlesArray[b].y));
                ctx.strokeStyle = colour;
                ctx.lineWidth = (particlesArray[a].size + particlesArray[b].size)/3;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    
    connect();
}
// resize event
window.addEventListener("resize",
    function() {
        canvas.width = this.innerWidth;
        canvas.height = this.innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init()
    }
);

init();
animate();