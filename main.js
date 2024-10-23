const catto = document.querySelector('.catto');
const explosion = document.querySelector('.explosion');
let lastMouseX = 0;
let lastMouseY = 0;
let shaking = false;

const popSound = new Audio('assets/sounds/pop.mp3'); // Replace with your sound file path
const explodeSound = new Audio('assets/sounds/Explosion.mp3')

let fraction = .1;

// Function to calculate and set shake magnitude based on mouse movement
function updateShakeMagnitude(event) {
    const deltaX = Math.abs(event.clientX - lastMouseX);
    const deltaY = Math.abs(event.clientY - lastMouseY);
    const distance = Math.floor(Math.sqrt(deltaX ** 2 + deltaY ** 2)) - 1; // Calculate distance moved

    // Update shake magnitude based on distance moved, clamp to a reasonable range
    const newShakeMagnitude = Math.min(distance, 30); // Adjust min and max values as needed
    catto.style.setProperty('--shakeMagnitude', `${newShakeMagnitude * fraction}px`);

    const newTimeScale = Math.max(10 - fraction, 0.3 - distance * 0.01); // Adjust this multiplier for sensitivity
    catto.style.setProperty('--timeScale', `${newTimeScale}s`);

    // Update last mouse positions
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    fraction = Math.min(20, fraction + (distance / 100));

    if (fraction%0.3 <= .05) {
        const meowSound = new Audio('assets/sounds/meow.mp3'); // Replace with your sound file path
        meowSound.play();
    }

    if (fraction >= 2) {
        const newSaturation = fraction - 1;
        console.log(newSaturation)
        catto.style.setProperty('--saturation', `${newSaturation}`);
    }

    if (fraction >= 10) {
        catto.style.backgroundImage = 'url("assets/images/Cat-Angry.png")'
    }

    if (fraction >= 15) {
        explodeSound.play();
        explosion.style.display = 'block';

        catto.removeEventListener('mousemove', updateShakeMagnitude);
        catto.classList.remove('shake');
        shaking = false;
        catto.style.setProperty('--saturation', `${1}`);
        fraction = .1;
        catto.style.setProperty('--shakeMagnitude', '5px'); // Reset shake magnitude
    }
}

// Add mousemove event listener when hovering over the catto
catto.addEventListener('mouseenter', () => {
    shaking = true;
    lastMouseX = event.clientX; // Initialize last mouse positions
    lastMouseY = event.clientY;
    catto.addEventListener('mousemove', updateShakeMagnitude);
    catto.classList.add('shake');
});

// Remove mousemove event listener when leaving the catto
catto.addEventListener('mouseleave', () => {
    catto.removeEventListener('mousemove', updateShakeMagnitude);
    catto.classList.remove('shake');
    shaking = false;
    catto.style.setProperty('--saturation', `${1}`);
    fraction = .1;
    catto.style.setProperty('--shakeMagnitude', '5px'); // Reset shake magnitude
});

catto.addEventListener('click', () => {
    popSound.play();
    const currentWidth = parseInt(getComputedStyle(catto).width);
    const currentHeight = parseInt(getComputedStyle(catto).height);

    catto.style.backgroundImage = 'url("assets/images/Cat-Open.png")'
    catto.style.width = `${currentWidth * 1.2}px`;
    catto.style.height = `${currentHeight * 1.2}px`;

    setTimeout(function() {
        const currentWidth = parseInt(getComputedStyle(catto).width);
        const currentHeight = parseInt(getComputedStyle(catto).height);
        catto.style.backgroundImage = 'url("assets/images/Cat-Default.png")'
        catto.style.width = `${currentWidth / 1.2}px`;
        catto.style.height = `${currentHeight / 1.2}px`;
    }, 250);
})
