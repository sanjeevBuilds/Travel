// Cinematic Snowfall Animation (cityscape background)
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');
let snowflakes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createSnowflake() {
    return {
        x: Math.random() * canvas.width,
        y: -10,
        radius: 2 + Math.random() * 4,
        speed: 0.5 + Math.random() * 1.5,
        wind: -0.5 + Math.random() * 1,
        opacity: 0.7 + Math.random() * 0.3,
    };
}

function drawSnowflake(flake) {
    ctx.save();
    ctx.globalAlpha = flake.opacity;
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#54a8fc';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
}

function updateSnowflakes() {
    if (snowflakes.length < 180) {
        snowflakes.push(createSnowflake());
    }
    for (let flake of snowflakes) {
        flake.x += flake.wind;
        flake.y += flake.speed;
        if (flake.y > canvas.height + 10) {
            flake.x = Math.random() * canvas.width;
            flake.y = -10;
        }
    }
}

function renderSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let flake of snowflakes) {
        drawSnowflake(flake);
    }
    updateSnowflakes();
    requestAnimationFrame(renderSnow);
}
renderSnow();

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load theme from localStorage
if (localStorage.getItem('theme') === 'night') {
    body.classList.add('night');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.add('night');
        localStorage.setItem('theme', 'night');
    } else {
        body.classList.remove('night');
        localStorage.setItem('theme', 'day');
    }
});

// Transport selection functionality
const transportOptions = document.querySelectorAll('.transport-option');
const selectedTransportText = document.getElementById('selected-transport-text');
const bookBtn = document.getElementById('book-btn');
const sourceDisplay = document.getElementById('source-display');
const destinationDisplay = document.getElementById('destination-display');

// Get source and destination from URL parameters or localStorage
function getRouteInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source') || localStorage.getItem('source') || 'New York';
    const destination = urlParams.get('destination') || localStorage.getItem('destination') || 'Los Angeles';
    
    sourceDisplay.textContent = source;
    destinationDisplay.textContent = destination;
    
    return { source, destination };
}

// Initialize route info
const routeInfo = getRouteInfo();

// Transport option selection
transportOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        transportOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        option.classList.add('selected');
        
        // Get transport type
        const transportType = option.getAttribute('data-transport');
        
        // Update selected transport text
        const transportName = option.querySelector('h3').textContent;
        selectedTransportText.textContent = `Selected: ${transportName}`;
        
        // Enable book button
        bookBtn.disabled = false;
        
        // Add special effects based on transport type
        highlightTransport(transportType);
        
        // Store selection
        localStorage.setItem('selectedTransport', transportType);
    });
});

// Highlight selected transport with special effects
function highlightTransport(transportType) {
    // Reset all animations
    const airplane = document.getElementById('airplane');
    const train = document.getElementById('train');
    const car = document.getElementById('car');
    
    // Remove all highlight classes
    airplane.classList.remove('highlighted');
    train.classList.remove('highlighted');
    car.classList.remove('highlighted');
    
    // Add highlight to selected transport
    switch(transportType) {
        case 'flight':
            airplane.classList.add('highlighted');
            break;
        case 'train':
            train.classList.add('highlighted');
            break;
        case 'car':
            car.classList.add('highlighted');
            break;
    }
}

// Book journey functionality
bookBtn.addEventListener('click', () => {
    const selectedOption = document.querySelector('.transport-option.selected');
    if (!selectedOption) {
        alert('Please select a mode of transportation first.');
        return;
    }
    
    const transportType = selectedOption.getAttribute('data-transport');
    const transportName = selectedOption.querySelector('h3').textContent;
    const { source, destination } = routeInfo;
    
    // Create booking confirmation
    const confirmation = `
        🎉 Journey Booked Successfully!
        
        From: ${source}
        To: ${destination}
        Transport: ${transportName}
        
        Your booking has been confirmed. 
        Check your email for details.
    `;
    
    alert(confirmation);
    
    // Redirect to result page or show success message
    // You can redirect to a result page here
    // window.location.href = '../result/result.html';
});

// Add CSS for highlighted transport
const style = document.createElement('style');
style.textContent = `
    .airplane.highlighted {
        filter: drop-shadow(0 0 20px #54a8fc) drop-shadow(0 0 40px #54a8fc);
        animation-duration: 4s !important;
    }
    
    .train.highlighted {
        filter: drop-shadow(0 0 20px #54a8fc) drop-shadow(0 0 40px #54a8fc);
        animation-duration: 6s !important;
    }
    
    .car.highlighted {
        filter: drop-shadow(0 0 20px #54a8fc) drop-shadow(0 0 40px #54a8fc);
        animation-duration: 5s !important;
    }
    
    body.night .airplane.highlighted,
    body.night .train.highlighted,
    body.night .car.highlighted {
        filter: drop-shadow(0 0 20px #1e90ff) drop-shadow(0 0 40px #1e90ff);
    }
`;
document.head.appendChild(style);

// Add hover effects for transport options
transportOptions.forEach(option => {
    option.addEventListener('mouseenter', () => {
        const transportType = option.getAttribute('data-transport');
        const element = document.getElementById(transportType === 'flight' ? 'airplane' : transportType);
        element.style.filter = 'drop-shadow(0 0 15px #54a8fc)';
    });
    
    option.addEventListener('mouseleave', () => {
        const transportType = option.getAttribute('data-transport');
        const element = document.getElementById(transportType === 'flight' ? 'airplane' : transportType);
        if (!element.classList.contains('highlighted')) {
            element.style.filter = 'drop-shadow(0 0 10px #54a8fc)';
        }
    });
});

// Add some interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add sparkle effect to transport icons
    const transportIcons = document.querySelectorAll('.transport-icon');
    transportIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'all 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Add click sound effect (optional)
    transportOptions.forEach(option => {
        option.addEventListener('click', () => {
            // You can add a subtle sound effect here
            option.style.transform = 'scale(0.95)';
            setTimeout(() => {
                option.style.transform = 'translateY(-4px)';
            }, 150);
        });
    });
});

// Add parallax effect to background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const cityscape = document.querySelector('.cityscape-bg');
    if (cityscape) {
        cityscape.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add some dynamic content updates
function updateTransportDetails() {
    const { source, destination } = routeInfo;
    
    // Calculate approximate distances and update times
    const distances = {
        'New York': { 'Los Angeles': 2789, 'Chicago': 787, 'Miami': 1288 },
        'Los Angeles': { 'New York': 2789, 'San Francisco': 383, 'Las Vegas': 270 },
        'Chicago': { 'New York': 787, 'Los Angeles': 1744, 'Miami': 1389 }
    };
    
    const distance = distances[source]?.[destination] || 1000;
    
    // Update transport details based on distance
    const flightTime = Math.max(2, Math.round(distance / 500));
    const trainTime = Math.max(30, Math.round(distance / 50));
    const carTime = Math.max(1, Math.round(distance / 60));
    
    const timeElements = document.querySelectorAll('.time');
    timeElements[0].textContent = `⏱️ ${flightTime}-${flightTime + 2} hours`;
    timeElements[1].textContent = `⏱️ ${trainTime}-${trainTime + 30} min`;
    timeElements[2].textContent = `⏱️ ${carTime}-${carTime + 2} hours`;
}

// Initialize transport details
updateTransportDetails();

// Mini-car animation logic
const miniCar = document.getElementById('mini-car');
const frostedCard = document.querySelector('.frosted-card');
const transportOptionEls = document.querySelectorAll('.transport-option');
const inputEls = document.querySelectorAll('.frosted-card input, .frosted-card select');
const miniPortal = document.getElementById('mini-portal');

function animateMiniCar(type) {
    // Reset
    miniCar.style.transition = 'left 0.7s cubic-bezier(.7,1.7,.5,1), transform 0.5s cubic-bezier(.7,1.7,.5,1)';
    miniCar.style.transform = 'none';
    // Animate based on type
    if (type === 'flight') {
        miniCar.style.left = '70%';
        miniCar.style.transform = 'scale(1.1) rotate(-8deg)';
        setTimeout(() => { miniCar.style.transform = 'scale(1)'; }, 700);
    } else if (type === 'train') {
        miniCar.style.left = '40%';
        miniCar.style.transform = 'translateY(-10px) scale(1.05)';
        setTimeout(() => { miniCar.style.transform = 'none'; }, 700);
    } else if (type === 'car') {
        miniCar.style.left = '15%';
        miniCar.style.transform = 'scale(1.15)';
        setTimeout(() => { miniCar.style.transform = 'scale(1)'; }, 700);
    } else {
        miniCar.style.left = '15%';
        miniCar.style.transform = 'none';
    }
}

function portalSparkleBurst() {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'mini-portal-sparkle';
        sparkle.style.left = (48 + Math.random() * 4 - 2) + '%';
        sparkle.style.bottom = (18 + Math.random() * 8) + 'px';
        sparkle.style.width = sparkle.style.height = (6 + Math.random() * 6) + 'px';
        sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
        document.querySelector('.mini-scene').appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1200);
    }
}

function mindBlowingPortalAnimation(type) {
    // Open portal
    miniPortal.classList.add('open');
    // Spin and frost car
    miniCar.classList.add('spin');
    setTimeout(() => {
        miniCar.classList.add('frosted');
        portalSparkleBurst();
        // Portal burst effect
        const burst = document.createElement('div');
        burst.className = 'mini-portal-burst';
        document.querySelector('.mini-scene').appendChild(burst);
        setTimeout(() => burst.remove(), 700);
    }, 500);
    // Reset after animation
    setTimeout(() => {
        miniPortal.classList.remove('open');
        miniCar.classList.remove('spin');
        miniCar.classList.remove('frosted');
        animateMiniCar(type); // Move car to correct position
    }, 1400);
}

// Override transport select to use mind-blowing animation
transportOptionEls.forEach(option => {
    option.addEventListener('click', () => {
        const type = option.getAttribute('data-transport');
        mindBlowingPortalAnimation(type);
    });
});

// Fun bounce on input focus or card hover
function bounceMiniCar() {
    miniCar.style.transition = 'transform 0.2s cubic-bezier(.7,1.7,.5,1)';
    miniCar.style.transform += ' translateY(-18px) scale(1.1)';
    setTimeout(() => {
        miniCar.style.transform = miniCar.style.transform.replace(' translateY(-18px) scale(1.1)', '');
    }, 220);
}

frostedCard.addEventListener('mouseenter', bounceMiniCar);
inputEls.forEach(input => {
    input.addEventListener('focus', bounceMiniCar);
});

// Orbiting Orbs Animation
const orbCount = 8;
const orbs = Array.from({length: orbCount}, (_, i) => document.getElementById(`orbit-orb-${i}`));
const orbSpeed = 2.5;
const orbBaseScale = 0.55;

let cursorCenter = null;
let trailingCenter = null;
function lerp(a, b, t) { return a + (b - a) * t; }

window.addEventListener('mousemove', e => {
    cursorCenter = { x: e.clientX, y: e.clientY };
});
window.addEventListener('mouseleave', () => {
    cursorCenter = null;
});
window.addEventListener('touchmove', e => {
    if (e.touches && e.touches.length > 0) {
        cursorCenter = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
});
window.addEventListener('touchend', () => {
    cursorCenter = null;
});

let orbsRed = false;
function triggerRedOrbs() {
    orbsRed = true;
    setTimeout(() => { orbsRed = false; }, 1000);
}
// Listen for any button click
window.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') triggerRedOrbs();
});

function animateOrbs3D() {
    const card = document.querySelector('.frosted-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    let targetX, targetY;
    if (cursorCenter) {
        targetX = cursorCenter.x;
        targetY = cursorCenter.y;
    } else {
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
    }
    // Lerp the trailing center toward the target
    if (!trailingCenter) trailingCenter = { x: targetX, y: targetY };
    trailingCenter.x = lerp(trailingCenter.x, targetX, 0.045);
    trailingCenter.y = lerp(trailingCenter.y, targetY, 0.045);

    const rx = Math.max(rect.width, rect.height) / 2 + 4; // even closer
    const now = performance.now() / 1000;
    const fade = cursorCenter ? 1 : 0.5;
    orbs.forEach((orb, i) => {
        const t = now * orbSpeed + (i * (2 * Math.PI / orbCount));
        const heartScaleX = 0.36 * rx; // even closer
        const heartScaleY = 0.22 * rx; // even closer
        const x = trailingCenter.x + heartScaleX * 16 * Math.pow(Math.sin(t), 3) / 18 - 8;
        const y = trailingCenter.y - heartScaleY * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) / 18 - 8;
        const z = Math.sin(t);
        const scale = orbBaseScale + 0.3 * (z + 1) / 2;
        const blur = 8 - 8 * ((z + 1) / 2);
        const opacity = (0.18 + 0.55 * ((z + 1) / 2)) * fade;
        orb.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        orb.style.filter = `blur(${Math.max(0, blur)}px) brightness(1.25)`;
        orb.style.opacity = opacity;
        orb.style.zIndex = z > 0 ? 20 : 2;
        orb.style.background = orbsRed
            ? 'radial-gradient(circle, #fff 60%, #d90429 100%)'
            : 'radial-gradient(circle, #fff 70%, #eaf6ff 100%)';
    });
    requestAnimationFrame(animateOrbs3D);
}
// Start the new 3D animation
requestAnimationFrame(animateOrbs3D);
