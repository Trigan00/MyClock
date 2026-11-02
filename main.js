const millisecondElement = document.querySelector('.millisecond');
const secondElement = document.querySelector('.second');
const minuteElement = document.querySelector('.minute');
const hourElement = document.querySelector('.hour');

const StartEl = document.querySelector('.Start');
const PauseEl = document.querySelector('.Stop');

let elapsed = 0;
let startedAt = null;
let frameId = null;

function render(time) {
    const hundredths = Math.floor(time / 10);
    millisecondElement.textContent = String(hundredths % 100).padStart(2, '0');
    secondElement.textContent = String(Math.floor(hundredths / 100) % 60).padStart(2, '0');
    minuteElement.textContent = String(Math.floor(hundredths / 6000) % 60).padStart(2, '0');
    hourElement.textContent = String(Math.floor(hundredths / 360000)).padStart(2, '0');
}

function tick() {
    render(elapsed + performance.now() - startedAt);
    frameId = requestAnimationFrame(tick);
}

StartEl.addEventListener('click', () => {
    if (startedAt !== null) return;
    startedAt = performance.now();
    tick();
});

PauseEl.addEventListener('click', () => {
    if (startedAt === null) return;
    elapsed += performance.now() - startedAt;
    startedAt = null;
    cancelAnimationFrame(frameId);
    frameId = null;
    render(elapsed);
});

render(elapsed);
