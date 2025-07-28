// Cinematic Snowfall Animation (lake background)
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
    ctx.shadowColor = '#60a5fa';
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

// Individual snowflake accumulation for inputs and button
class AccumulationSnow {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.flakes = [];
        this.width = 0;
        this.height = 0;
        this.options = Object.assign({
            minRadius: 1.2,
            maxRadius: 2.2,
            minSpeed: 0.4,
            maxSpeed: 0.7,
            density: 0.12, // flakes per px width
            sparkle: true
        }, options);
        this.setSize();
        window.addEventListener('resize', () => this.setSize());
        this.spawnInterval = setInterval(() => this.spawnFlake(), 1200 + Math.random() * 800);
        requestAnimationFrame(() => this.animate());
    }
    setSize() {
        this.width = this.canvas.offsetWidth || this.canvas.parentElement.offsetWidth;
        this.height = this.canvas.offsetHeight || this.canvas.parentElement.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    spawnFlake() {
        if (this.flakes.length > this.width * this.options.density) return;
        const x = Math.random() * this.width;
        this.flakes.push({
            x,
            y: -8,
            radius: this.options.minRadius + Math.random() * (this.options.maxRadius - this.options.minRadius),
            speed: this.options.minSpeed + Math.random() * (this.options.maxSpeed - this.options.minSpeed),
            opacity: 0.18 + Math.random() * 0.22,
            resting: false,
            settleY: null,
            sparkle: this.options.sparkle && Math.random() < 0.18
        });
    }
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // Draw resting flakes first (bottom up)
        let restingFlakes = this.flakes.filter(f => f.resting).sort((a, b) => a.settleY - b.settleY);
        for (let flake of restingFlakes) {
            this.drawFlake(flake, true);
        }
        // Animate falling flakes
        for (let flake of this.flakes) {
            if (!flake.resting) {
                // Easing for soft landing
                if (flake.settleY === null) {
                    // Find where to settle (top of previous flakes or bottom)
                    let below = restingFlakes.filter(rf => Math.abs(rf.x - flake.x) < flake.radius * 1.8 && Math.abs(rf.settleY - (this.height - flake.radius)) < 2);
                    if (below.length > 0) {
                        flake.settleY = Math.min(...below.map(rf => rf.settleY)) - flake.radius * 1.2;
                    } else {
                        flake.settleY = this.height - flake.radius * 1.1;
                    }
                }
                // Soft ease
                let dist = flake.settleY - flake.y;
                flake.y += Math.max(0.5, Math.abs(dist) * 0.12);
                if (flake.y >= flake.settleY - 0.5) {
                    flake.y = flake.settleY;
                    flake.resting = true;
                }
                this.drawFlake(flake, false);
            }
        }
        // Sparkle effect
        for (let flake of this.flakes) {
            if (flake.resting && flake.sparkle && Math.random() < 0.03) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.7;
                this.ctx.beginPath();
                this.ctx.arc(flake.x, flake.y, flake.radius * 0.7, 0, 2 * Math.PI);
                this.ctx.fillStyle = '#eaf6ff';
                this.ctx.shadowColor = '#fff';
                this.ctx.shadowBlur = 8;
                this.ctx.fill();
                this.ctx.restore();
            }
        }
        requestAnimationFrame(() => this.animate());
    }
    drawFlake(flake, resting) {
        this.ctx.save();
        this.ctx.globalAlpha = flake.opacity * (resting ? 0.9 : 1);
        this.ctx.beginPath();
        this.ctx.arc(flake.x, flake.y, flake.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowColor = resting ? '#eaf6ff' : '#60a5fa';
        this.ctx.shadowBlur = resting ? 4 : 8;
        if (!resting && Math.random() < 0.08) {
            // subtle motion blur for falling
            this.ctx.filter = 'blur(0.5px)';
        }
        this.ctx.fill();
        this.ctx.restore();
    }
}

// Attach accumulation snow to each input and button
const inputSnowEmail = new AccumulationSnow(document.getElementById('input-snow-email'));
const inputSnowPassword = new AccumulationSnow(document.getElementById('input-snow-password'));
const inputSnowLogin = new AccumulationSnow(document.getElementById('input-snow-login'), { minRadius: 1.1, maxRadius: 2, density: 0.09 });

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

// Login form validation
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const forgotLink = document.getElementById('forgot-link');

loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // If validation passes, you can redirect or show success message
    alert('Login successful!');
    // Redirect to home page
    window.location.href = '../Home/index.html';
});

// Forgot password functionality
forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter your email address first');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    alert('Password reset link has been sent to your email address');
});
