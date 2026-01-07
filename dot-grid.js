// DotGrid Physics Animation
// High-performance replacement for GSAP implementation
// Theme: Triada (Red/Black)

class DotGrid {
    constructor(options = {}) {
        this.containerId = options.containerId || 'dot-grid-container';

        // Configuration matched to user screenshots
        this.dotSize = options.dotSize || 5;
        this.gap = options.gap || 15;
        this.baseColor = options.baseColor || '#333333';
        this.activeColor = options.activeColor || '#ff0033';
        this.proximity = options.proximity || 120; // Interaction radius

        // Physics constants
        this.friction = 0.92; // Damping (0.9 - 0.95 usually good)
        this.springFactor = 0.1; // Snap back speed
        this.mouseForce = 0.4; // Push strength

        this.container = document.getElementById(this.containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.dots = [];
        this.pointer = { x: -500, y: -500, vx: 0, vy: 0, lastX: 0, lastY: 0, lastTime: 0 }; // Start off-screen

        this.init();
    }

    init() {
        if (!this.container) return;

        // Container Styles
        // Explicitly set styles to ensure visibility and layering
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '1', // Explicit Layer 1
            pointerEvents: 'none', // Allow clicks to pass through
            opacity: '1'
        });

        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);

        this.resize();

        // Event Listeners
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Prepare colors
        this.baseRgb = this.hexToRgb(this.baseColor);
        this.activeRgb = this.hexToRgb(this.activeColor);

        // Start Loop
        this.loop();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

        this.ctx.scale(dpr, dpr);

        this.buildGrid(rect.width, rect.height);
    }

    buildGrid(width, height) {
        const cols = Math.floor((width + this.gap) / (this.dotSize + this.gap));
        const rows = Math.floor((height + this.gap) / (this.dotSize + this.gap));
        const cell = this.dotSize + this.gap;

        const gridW = cell * cols - this.gap;
        const gridH = cell * rows - this.gap;

        const extraX = width - gridW;
        const extraY = height - gridH;

        const startX = extraX / 2 + this.dotSize / 2;
        const startY = extraY / 2 + this.dotSize / 2;

        this.dots = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = startX + x * cell;
                const cy = startY + y * cell;
                this.dots.push({
                    ox: cx, // Origin X
                    oy: cy, // Origin Y
                    x: cx,  // Current X
                    y: cy,  // Current Y
                    vx: 0,  // Velocity X
                    vy: 0   // Velocity Y
                });
            }
        }
    }

    hexToRgb(hex) {
        const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return m ? {
            r: parseInt(m[1], 16),
            g: parseInt(m[2], 16),
            b: parseInt(m[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    onMouseMove(e) {
        const now = performance.now();
        const dt = this.pointer.lastTime ? now - this.pointer.lastTime : 16;

        const dx = e.clientX - this.pointer.lastX;
        const dy = e.clientY - this.pointer.lastY;

        // Simple velocity tracking
        this.pointer.vx = (dx / dt) * 1000;
        this.pointer.vy = (dy / dt) * 1000;

        this.pointer.lastTime = now;
        this.pointer.lastX = e.clientX;
        this.pointer.lastY = e.clientY;
        this.pointer.x = e.clientX;
        this.pointer.y = e.clientY;
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);

        const px = this.pointer.x;
        const py = this.pointer.y;
        const proxSq = this.proximity * this.proximity;

        // Pre-calculate color variations to avoid constant object creation
        // but for now, simple lerp in loop is fine for performance

        const TwoPI = Math.PI * 2;
        const radius = this.dotSize / 2;

        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];

            // 1. Calculate vector to mouse
            const dx = dot.x - px;
            const dy = dot.y - py;
            const dSq = dx * dx + dy * dy;

            // 2. Interaction Force (Repel)
            if (dSq < proxSq) {
                const dist = Math.sqrt(dSq);
                // Stronger force closer to center
                const force = (1 - dist / this.proximity) * this.mouseForce;

                // Add velocity away from mouse
                const angle = Math.atan2(dy, dx);
                dot.vx += Math.cos(angle) * force * 15; // Scaled force
                dot.vy += Math.sin(angle) * force * 15;
            }

            // 3. Spring Force (Return to Origin)
            const dxOrigin = dot.ox - dot.x;
            const dyOrigin = dot.oy - dot.y;

            dot.vx += dxOrigin * this.springFactor;
            dot.vy += dyOrigin * this.springFactor;

            // 4. Friction (Damping)
            dot.vx *= this.friction;
            dot.vy *= this.friction;

            // 5. Update Position
            dot.x += dot.vx;
            dot.y += dot.vy;

            // 6. Color Logic
            // If dot is moved significantly from origin, brighten it
            const moveDistSq = dxOrigin * dxOrigin + dyOrigin * dyOrigin;

            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, radius, 0, TwoPI);

            if (moveDistSq > 4) { // Threshold for "active" color
                // Calculate intensity based on displacement
                const intensity = Math.min(1, Math.sqrt(moveDistSq) / 20);

                const r = this.baseRgb.r + (this.activeRgb.r - this.baseRgb.r) * intensity;
                const g = this.baseRgb.g + (this.activeRgb.g - this.baseRgb.g) * intensity;
                const b = this.baseRgb.b + (this.activeRgb.b - this.baseRgb.b) * intensity;

                this.ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
            } else {
                this.ctx.fillStyle = this.baseColor;
            }

            this.ctx.fill();
        }

        requestAnimationFrame(() => this.loop());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('dot-grid-container');
    if (container) {
        new DotGrid({
            // These settings match the user's high-density request
            dotSize: 5,
            gap: 15,
            proximity: 120,
            baseColor: '#333333',
            activeColor: '#ff0033'
        });
    }
});
