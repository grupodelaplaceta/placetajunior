const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'music.js'), 'utf8');

function createMusic(fetchAudio = async (url) => Promise.resolve({ arrayBuffer: async () => url })) {
  const events = {};
  const starts = [];
  const requests = [];
  class AudioContext {
    state = 'running';
    currentTime = 0;
    destination = {};
    resume() { return Promise.resolve(); }
    decodeAudioData(buffer) { return Promise.resolve({ url: buffer }); }
    createGain() {
      return {
        gain: {
          value: 0,
          cancelScheduledValues() {},
          setValueAtTime(value) { this.value = value; },
          linearRampToValueAtTime(value) { this.value = value; }
        },
        connect() {},
        disconnect() {}
      };
    }
    createBufferSource() {
      return {
        buffer: null,
        playbackRate: { value: 1 },
        connect() {},
        start() { starts.push(this.buffer.url); },
        stop() {}
      };
    }
  }
  const window = {
    AudioContext,
    addEventListener(name, fn) { (events[name] ||= []).push(fn); }
  };
  const document = {
    visibilityState: 'visible',
    addEventListener(name, fn) { (events[name] ||= []).push(fn); }
  };
  const context = {
    window,
    document,
    fetch(url) { requests.push(url); return fetchAudio(url); },
    setTimeout,
    clearTimeout
  };
  vm.runInNewContext(source, context, { filename: 'music.js' });
  return {
    music: window.PJMusic,
    starts,
    requests,
    event(name) { (events[name] || []).forEach((fn) => fn()); },
    visibility(state) { document.visibilityState = state; this.event('visibilitychange'); },
    flush() { return new Promise((resolve) => setImmediate(resolve)); }
  };
}

test('la primera interacción conserva la música seleccionada para la actividad', async () => {
  const audio = createMusic();
  audio.music.actividad('Matemáticas');
  audio.event('pointerdown');
  await audio.flush();

  assert.deepEqual(audio.starts, ['sounds/Logicamente.mp3']);
  assert.ok(!audio.requests.includes('sounds/Dia.mp3'));
});

test('silenciar cancela cargas pendientes y desmutear restaura la pista de actividad', async () => {
  let releaseFirst;
  const audio = createMusic((url) => {
    if (audio.requests.length === 1) return new Promise((resolve) => { releaseFirst = () => resolve({ arrayBuffer: async () => url }); });
    return Promise.resolve({ arrayBuffer: async () => url });
  });

  audio.music.actividad('Ciencias');
  audio.music.setSonido(false);
  releaseFirst();
  await audio.flush();
  assert.deepEqual(audio.starts, []);

  audio.music.setSonido(true);
  await audio.flush();
  assert.deepEqual(audio.starts, ['sounds/Animales.mp3']);
});

test('al volver a la pestaña restaura la última música elegida', async () => {
  const audio = createMusic();
  audio.music.actividad('Geografía');
  await audio.flush();
  audio.visibility('hidden');
  audio.visibility('visible');
  await audio.flush();

  assert.deepEqual(audio.starts, ['sounds/Mundo.mp3', 'sounds/Mundo.mp3']);
});