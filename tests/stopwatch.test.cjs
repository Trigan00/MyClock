const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function stopwatch() {
    let now = 0;
    let nextId = 0;
    const frames = new Map();
    const elements = new Map();
    const context = {
        document: { querySelector(selector) {
            if (!elements.has(selector)) elements.set(selector, {
                textContent: '',
                addEventListener(event, callback) { this[event] = callback; },
            });
            return elements.get(selector);
        } },
        performance: { now: () => now },
        requestAnimationFrame(callback) { frames.set(++nextId, callback); return nextId; },
        cancelAnimationFrame(id) { frames.delete(id); },
    };
    vm.runInNewContext(readFileSync(require('node:path').join(__dirname, '../main.js'), 'utf8'), context);
    return {
        click: selector => elements.get(selector).click(),
        advance(ms) {
            now += ms;
            const pending = [...frames.values()];
            frames.clear();
            pending.forEach(callback => callback());
        },
        display: () => ['.hour', '.minute', '.second', '.millisecond'].map(s => elements.get(s).textContent).join(':'),
        pending: () => frames.size,
    };
}

test('Start is idempotent; Stop freezes immediately; Start resumes without counting paused time', () => {
    const clock = stopwatch();
    assert.equal(clock.display(), '00:00:00:00');
    clock.click('.Stop');
    clock.click('.Start');
    clock.advance(1250);
    assert.equal(clock.display(), '00:00:01:25');
    clock.click('.Start');
    assert.equal(clock.pending(), 1);
    clock.advance(250);
    assert.equal(clock.display(), '00:00:01:50');
    clock.click('.Stop');
    assert.equal(clock.pending(), 0);
    clock.advance(5000);
    assert.equal(clock.display(), '00:00:01:50');
    clock.click('.Stop');
    clock.click('.Start');
    clock.advance(500);
    assert.equal(clock.display(), '00:00:02:00');
});

test('time rolls over correctly and hours do not wrap at 60', () => {
    const clock = stopwatch();
    clock.click('.Start');
    clock.advance(59990);
    assert.equal(clock.display(), '00:00:59:99');
    clock.advance(10);
    assert.equal(clock.display(), '00:01:00:00');
    clock.advance(3540000);
    assert.equal(clock.display(), '01:00:00:00');
    clock.advance(59 * 3600000);
    assert.equal(clock.display(), '60:00:00:00');
});
