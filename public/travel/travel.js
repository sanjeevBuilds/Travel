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

// Route planning functionality
const routeOptionsContainer = document.getElementById('route-options');
const sourceDisplay = document.getElementById('source-display');
const destinationDisplay = document.getElementById('destination-display');
const distanceDisplay = document.getElementById('distance-display');

// Initialize route planner
const routePlanner = new RoutePlanner();

// Get source and destination from URL parameters or localStorage
function getRouteInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source') || localStorage.getItem('source') || 'Mumbai';
    const destination = urlParams.get('destination') || localStorage.getItem('destination') || 'Delhi';
    
    sourceDisplay.textContent = source;
    destinationDisplay.textContent = destination;
    
    return { source, destination };
}

// Initialize route info and generate routes
const routeInfo = getRouteInfo();
generateRouteOptions(routeInfo.source, routeInfo.destination);

// Generate and display route options
function generateRouteOptions(source, destination) {
    // Show loading
    routeOptionsContainer.innerHTML = '<div class="loading-message">🔍 Finding best routes...</div>';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        const optimizedRoutes = routePlanner.getOptimizedRoutes(source, destination);
        
        // Update distance display
        distanceDisplay.textContent = `Distance: ${optimizedRoutes.distance} km`;
        
        // Clear loading and display routes
        routeOptionsContainer.innerHTML = '';
        
        // Create route cards
        const routeTypes = ['fastest', 'cheapest', 'hybrid'];
        routeTypes.forEach(type => {
            const route = optimizedRoutes[type];
            if (route) {
                const routeCard = createRouteCard(route, type);
                routeOptionsContainer.appendChild(routeCard);
            }
        });
    }, 1000);
}

// Create route card element
function createRouteCard(route, type) {
    const card = document.createElement('div');
    card.className = `route-card ${type}`;
    card.setAttribute('data-route-type', type);
    
    const isMultiModal = route.type === 'multi-modal';
    const segments = route.segments || [route];
    
    card.innerHTML = `
        <div class="route-header">
            <div class="route-icon">${route.icon}</div>
            <div class="route-info">
                <h3 class="route-title">${route.title}</h3>
                <p class="route-description">${route.description}</p>
            </div>
            <div class="route-stats">
                <div class="stat time-stat ${route.highlight === 'time' ? 'highlighted' : ''}">
                    <span class="stat-icon">⏱️</span>
                    <span class="stat-value">${routePlanner.formatTime(route.totalTime)}</span>
                </div>
                <div class="stat cost-stat ${route.highlight === 'cost' ? 'highlighted' : ''}">
                    <span class="stat-icon">💰</span>
                    <span class="stat-value">${routePlanner.formatCost(route.totalCost)}</span>
                </div>
            </div>
        </div>
        ${isMultiModal ? `
            <div class="route-segments">
                <div class="segments-header">
                    <span class="segments-title">Journey Steps:</span>
                    <button class="view-path-btn" data-route-type="${type}">View Path</button>
                </div>
                <div class="segments-list">
                    ${segments.map((segment, index) => `
                        <div class="segment">
                            <div class="segment-icon">${segment.transport.icon}</div>
                            <div class="segment-details">
                                <div class="segment-route">${segment.from} → ${segment.to}</div>
                                <div class="segment-mode">${segment.transport.name}</div>
                            </div>
                            <div class="segment-stats">
                                <span class="segment-time">${routePlanner.formatTime(segment.time)}</span>
                                <span class="segment-cost">${routePlanner.formatCost(segment.cost)}</span>
                            </div>
                        </div>
                        ${index < segments.length - 1 ? '<div class="segment-connector">↓</div>' : ''}
                    `).join('')}
                </div>
            </div>
        ` : `
            <div class="route-single-mode">
                <div class="single-mode-info">
                    <span class="transport-icon">${segments[0].transport.icon}</span>
                    <span class="transport-name">${segments[0].transport.name}</span>
                    <span class="transport-distance">${Math.round(segments[0].distance)} km</span>
                </div>
            </div>
        `}
    `;
    
    // Add click handler for route selection
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('view-path-btn')) {
            selectRoute(card, route, type);
        }
    });
    
    // Add view path button handler
    const viewPathBtn = card.querySelector('.view-path-btn');
    if (viewPathBtn) {
        viewPathBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDetailedPath(route, type);
        });
    }
    
    return card;
}

// Select a route
function selectRoute(cardElement, route, type) {
    // Remove selected class from all cards
    document.querySelectorAll('.route-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    cardElement.classList.add('selected');
    
    // Store selection
    localStorage.setItem('selectedRoute', JSON.stringify({
        type: type,
        route: route
    }));
    
    // Add visual feedback
    cardElement.style.transform = 'scale(1.02)';
    setTimeout(() => {
        cardElement.style.transform = '';
    }, 200);
}

// Show detailed path for multi-modal routes
function showDetailedPath(route, type) {
    const modal = document.createElement('div');
    modal.className = 'path-modal';
    modal.innerHTML = `
        <div class="path-modal-content">
            <div class="path-modal-header">
                <h3>${route.title} - Detailed Path</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="path-modal-body">
                <div class="path-summary">
                    <div class="summary-item">
                        <span class="summary-label">Total Time:</span>
                        <span class="summary-value">${routePlanner.formatTime(route.totalTime)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Total Cost:</span>
                        <span class="summary-value">${routePlanner.formatCost(route.totalCost)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Distance:</span>
                        <span class="summary-value">${Math.round(route.totalDistance)} km</span>
                    </div>
                </div>
                <div class="detailed-segments">
                    ${route.segments.map((segment, index) => `
                        <div class="detailed-segment">
                            <div class="segment-number">${index + 1}</div>
                            <div class="segment-content">
                                <div class="segment-transport">
                                    <span class="transport-icon-large">${segment.transport.icon}</span>
                                    <span class="transport-name-large">${segment.transport.name}</span>
                                </div>
                                <div class="segment-route-large">
                                    <strong>From:</strong> ${segment.from}<br>
                                    <strong>To:</strong> ${segment.to}
                                </div>
                                <div class="segment-metrics">
                                    <div class="metric">
                                        <span class="metric-label">Time:</span>
                                        <span class="metric-value">${routePlanner.formatTime(segment.time)}</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Cost:</span>
                                        <span class="metric-value">${routePlanner.formatCost(segment.cost)}</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Distance:</span>
                                        <span class="metric-value">${Math.round(segment.distance)} km</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Add close functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Highlight selected transport with special effects (simplified)
function highlightTransport(transportType) {
    // Remove existing highlights
    document.querySelectorAll('.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });
    
    // Add highlight based on transport type
    if (transportType === 'flight') {
        document.querySelectorAll('.orbit-orb').forEach(orb => {
            orb.classList.add('highlighted');
        });
    } else if (transportType === 'train') {
        document.querySelectorAll('.train').forEach(train => {
            train.classList.add('highlighted');
        });
    } else if (transportType === 'car') {
        const car = document.getElementById('car');
        if (car) car.classList.add('highlighted');
    }
}

// Book journey functionality removed - button no longer exists

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
