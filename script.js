const canvas = document.getElementById("circuitCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let paths = [];
let pulses = [];
let nodes = [];

const STEP = 120;

// generate PCB style paths
function generatePCB() {
    paths = [];
    pulses = [];
    nodes = [];

    let count = 35;

    for (let i = 0; i < count; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;

        let segments = 3 + Math.random() * 5;

        for (let j = 0; j < segments; j++) {

            // choose direction (only 90° turns)
            let dir = Math.floor(Math.random() * 4);

            let length = STEP * (1 + Math.floor(Math.random() * 5));

            let x2 = x;
            let y2 = y;

            if (dir === 0) x2 += length;       // right
            if (dir === 1) x2 -= length;       // left
            if (dir === 2) y2 += length;       // down
            if (dir === 3) y2 -= length;       // up

            paths.push({ x1: x, y1: y, x2, y2 });
            // store node at start
            nodes.push({ x: x, y: y });

            // store node at end
            nodes.push({ x: x2, y: y2 });

            if (Math.random() > 0.5) {
                pulses.push({
                path: { x1: x, y1: y, x2, y2 },
                progress: Math.random(),
                speed: 0.002 + Math.random() * 0.004
                });
            }

            x = x2;
            y = y2;

            // occasional branch
            if (Math.random() > 0.88) {
                let bx = x;
                let by = y;

                let branchLen = 2 + Math.random() * 4;

                for (let k = 0; k < branchLen; k++) {
                    let by2 = by + STEP;
                    paths.push({ x1: bx, y1: by, x2: bx, y2: by2 });
                    by = by2;
                }
            }
        }
    }
}

generatePCB();

// draw
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // glow layer (draw multiple times)
    for (let g = 0; g < 3; g++) {
        ctx.lineWidth = 2 + g * 2;

        ctx.strokeStyle = "rgba(0,255,255,0.08)";
        ctx.shadowBlur = 20;

        paths.forEach(p => {
            ctx.beginPath();
            ctx.moveTo(p.x1, p.y1);
            ctx.lineTo(p.x2, p.y2);
            ctx.stroke();
        });
    }

    // main lines
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "#00ffff77";
    ctx.shadowBlur = 8;

    paths.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.x1, p.y1);
        ctx.lineTo(p.x2, p.y2);
        ctx.stroke();
    });

    nodes.forEach(n => {
        // outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,255,0.2)";
        ctx.fill();

        // inner core
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff";
        ctx.shadowBlur = 25;
        ctx.fill();
    });

    // pulses
    pulses.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        let x = p.path.x1 + (p.path.x2 - p.path.x1) * p.progress;
        let y = p.path.y1 + (p.path.y2 - p.path.y1) * p.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 20;
        ctx.fill();
    });

    requestAnimationFrame(draw);
}

draw();

// SCROLL ANIMATION FIX (move here)
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".hidden").forEach(el => {
    observer.observe(el);
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generatePCB();
});
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});
document.addEventListener("click", () => {
    cursor.classList.add("click");

    setTimeout(() => {
        cursor.classList.remove("click");
    }, 400);
});
const hoverElements = document.querySelectorAll("a, button, .btn");

hoverElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
    });
});
