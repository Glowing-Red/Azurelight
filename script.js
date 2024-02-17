function createLightBall() {
   const canvas = document.getElementById('canvas');
   const ball = document.createElement('div');
   ball.classList.add('ball');
   canvas.appendChild(ball);

   const maxSize = Math.random() * 100 + 50; // Random max size between 50 and 150 pixels
   const lifetime = Math.random() * 3000 + 2000; // Random lifetime between 2000 and 5000 milliseconds
   const gradientDeg = Math.random() * 360; // Random gradient angle between 0 and 360 degrees
   const { clientWidth, clientHeight } = canvas;

   const size = Math.random() * maxSize;
   const x = Math.random() * (clientWidth - size);
   const y = Math.random() * (clientHeight - size);

   // Set position to relative to canvas
   ball.style.position = 'absolute';
   ball.style.top = `${y}px`;
   ball.style.left = `${x}px`;

   ball.style.width = `${size}px`;
   ball.style.height = `${size}px`;

   // Adjust gradientDeg to make it more visually noticeable
   let adjustedGradientDeg = gradientDeg;
   if (gradientDeg < 10 || gradientDeg > 350) {
       adjustedGradientDeg += Math.random() * 10 - 5; // Add a small value to make it more visually noticeable
   }

   ball.style.background = `linear-gradient(${adjustedGradientDeg}deg, rgba(0,173,255,1) 0%, rgba(179,0,255,1) 100%)`;

   // Fade in
   setTimeout(() => {
       ball.style.opacity = 1;
   }, 500); // 500 milliseconds fade-in duration

   // Fade out and remove
   setTimeout(() => {
       ball.style.transition = 'opacity 1s'; // 1 second fade-out duration
       setTimeout(() => {
           ball.style.opacity = 0;
           setTimeout(() => {
               ball.remove();
           }, 1000); // Adjust this value to control the fade-out duration
       }, 1000); // 1 second fade-out delay
   }, 2000 + Math.random() * 1000); // Random lifetime between 2000 and 3000 milliseconds
}

setInterval(createLightBall, 500); // adjust this value to control spawn frequency