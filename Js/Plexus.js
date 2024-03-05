const canvas = document.getElementById("Plexus Canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const colours = ['#264ce47d', '#e34f267e', '#d6bb3297'];

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

// create particle
class Particle {
   constructor(x, y, directionX, directionY, size, colour) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.colour = colours[Math.floor(Math.random() * colours.length)];
   }

   //method to draw individual particle
   draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.colour;
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
      
      // move particle
      this.x += this.directionX;
      this.y += this.directionY;

      // draw particle
      this.draw();
   }
}

// check if particles are close enough to draw line between them
function connect() {
   for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
         let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y)));
         if (distance < (canvas.width/7) * (canvas.height/7)) {
            const colour = ctx.createLinearGradient(0, 0, 1, 1);
            colour.addColorStop(0, particlesArray[a].colour);
            colour.addColorStop(1, particlesArray[b].colour);
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

function init() {
   particlesArray = [];
   let numberOfParticles = (canvas.height * canvas.width) / 15000;

   for (let i = 0; i < numberOfParticles; i++) {
      let size = (RandomInteger(3000, 6000)/1000);
      let x = (Math.random() * ((innerWidth - size * 2) - (size * 2) + size * 2));
      let y = (Math.random() * ((innerHeight - size * 2) - (size * 2) + size * 2));
      let directionX = (Math.random() * 5) - 2;
      let directionY = (Math.random() * 5) - 2;
      let colour = this.colour;

      particlesArray.push(new Particle(x, y, directionX, directionY, size, colour))
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
        
      init()
   }
);

init();
animate();