const PREF_KEY = 'painkyl_sound';

let ctx = null;
let master = null;
let loopTimer = null;
let chordIndex = 0;
let playing = false;
let noiseBuf = null;

const CHORDS = [
  {
    bass: 65.41,
    pad: [261.63, 329.63, 392.0],
    arp: [523.25, 659.25, 783.99, 1046.5]
  },
  {
    bass: 98.0,
    pad: [246.94, 293.66, 392.0],
    arp: [587.33, 739.99, 880.0, 1174.66]
  },
  {
    bass: 110.0,
    pad: [220.0, 261.63, 329.63],
    arp: [440.0, 523.25, 659.25, 880.0]
  },
  {
    bass: 87.31,
    pad: [349.23, 440.0, 523.25],
    arp: [698.46, 880.0, 1046.5, 1318.51]
  }
];

const ARP_PATTERN = [0, 1, 2, 3, 2, 1, 0, 1];
const STEP_DUR = 0.125;
const CHORD_DUR = STEP_DUR * 16;

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
}

function pluck(freq, t, vol, dur) {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  const filt = ctx.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = 3200;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(filt);
  filt.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function bassNote(freq, t, vol, dur) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function hat(t, vol) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const filt = ctx.createBiquadFilter();
  filt.type = 'highpass';
  filt.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  src.connect(filt);
  filt.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + 0.06);
}

function kick(t) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(48, t + 0.1);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.2, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + 0.2);
}

function pad(freqs, t) {
  freqs.forEach(f => {
    [0, 6].forEach(detune => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = f;
      osc.detune.value = detune;
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 520;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.018, t + 0.35);
      g.gain.linearRampToValueAtTime(0.012, t + CHORD_DUR * 0.7);
      g.gain.linearRampToValueAtTime(0, t + CHORD_DUR);
      osc.connect(filt);
      filt.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + CHORD_DUR + 0.1);
    });
  });
}

function scheduleChord(startTime) {
  const chord = CHORDS[chordIndex % CHORDS.length];
  pad(chord.pad, startTime);

  for (let step = 0; step < 16; step++) {
    const t = startTime + step * STEP_DUR;
    if (step === 0 || step === 8) kick(t);
    if (step === 2 || step === 6 || step === 10 || step === 14) hat(t, 0.04);
    if (step % 2 === 0) {
      const noteIdx = ARP_PATTERN[step / 2];
      pluck(chord.arp[noteIdx], t, 0.075, 0.19);
    }
  }

  bassNote(chord.bass, startTime, 0.13, 0.42);
  bassNote(chord.bass * 2, startTime + STEP_DUR * 6, 0.08, 0.13);
  bassNote(chord.bass, startTime + STEP_DUR * 8, 0.11, 0.3);

  if (Math.random() > 0.6) {
    pluck(chord.arp[3] * 2, startTime, 0.04, 1.1);
  }
}

function startLoops() {
  scheduleChord(ctx.currentTime + 0.08);
  chordIndex += 1;
  loopTimer = setInterval(() => {
    scheduleChord(ctx.currentTime + 0.08);
    chordIndex += 1;
  }, CHORD_DUR * 1000);
}

function stopLoops() {
  clearInterval(loopTimer);
  loopTimer = null;
}

export function startAmbient() {
  if (playing) return;
  ensureCtx();
  if (ctx.state === 'suspended') ctx.resume();
  playing = true;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2);
  startLoops();
  updateButton(true);
}

export function stopAmbient() {
  if (!playing) return;
  playing = false;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
  setTimeout(stopLoops, 550);
  updateButton(false);
}

export function toggleAmbient() {
  if (playing) {
    localStorage.setItem(PREF_KEY, 'off');
    stopAmbient();
  } else {
    localStorage.setItem(PREF_KEY, 'on');
    startAmbient();
  }
}

export function sfxClick() {
  if (!playing || !ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.exponentialRampToValueAtTime(1320, t + 0.07);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.1, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + 0.13);
}

export function sfxSuccess() {
  if (!ctx || !playing) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    const t = ctx.currentTime + i * 0.1;
    pluck(f, t, 0.12, 0.5);
  });
}

function updateButton(isPlaying) {
  const btn = document.getElementById('musicToggle');
  if (!btn) return;
  btn.classList.toggle('playing', isPlaying);
  btn.setAttribute('aria-label', isPlaying ? '關閉背景音樂' : '開啟背景音樂');
  btn.innerHTML = isPlaying
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
}

function injectUI() {
  if (document.getElementById('musicToggle')) return;

  const decor = document.createElement('div');
  decor.className = 'bg-decor';
  decor.setAttribute('aria-hidden', 'true');
  decor.innerHTML = `
    <span class="blob blob-1"></span>
    <span class="blob blob-2"></span>
    <span class="blob blob-3"></span>
    <span class="float-icon fi-1"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/></svg></span>
    <span class="float-icon fi-2"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
    <span class="float-icon fi-3"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg></span>
    <span class="float-icon fi-4"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/></svg></span>
    <span class="float-icon fi-5"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>`;
  document.body.prepend(decor);

  const btn = document.createElement('button');
  btn.id = 'musicToggle';
  btn.className = 'music-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', '開啟背景音樂');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
  btn.addEventListener('click', e => {
    e.stopPropagation();
    toggleAmbient();
  });
  document.body.appendChild(btn);
}

function bindAutoplay() {
  if (window.__pkAutoplayBound) return;
  window.__pkAutoplayBound = true;
  document.addEventListener(
    'pointerdown',
    () => {
      if (localStorage.getItem(PREF_KEY) !== 'off') startAmbient();
    },
    { once: true }
  );
}

injectUI();
bindAutoplay();
