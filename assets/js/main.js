/* =============================================
   Arnold Rey Strader Lapuz Portfolio — main.js
   Full-Stack Web & Android Developer
   Advanced 5D Multi-Sensory Interactive Engine
   ============================================= */

'use strict';

// ─── 5D MULTI-SENSORY WEB AUDIO SYNTHESIZER & HAPTIC ENGINE ───
class FiveDAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initialized = false;
    this.droneGain = null;
    this.droneFilter = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    // Harmonic Pentatonic Scale: C5, D5, E5, G5, A5, C6, D6
    this.scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66];
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.initialized = true;
        this.initDrone();
      }
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  ensureState() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Animate mini spectrum bars in HUD & navbar
  triggerSpectrumActivity() {
    const bars = document.querySelectorAll('.sound-wave span, .hud-mini-spectrum span');
    bars.forEach((b, i) => {
      b.style.height = `${Math.floor(Math.random() * 8 + 4)}px`;
      setTimeout(() => { b.style.height = ''; }, 180 + i * 20);
    });
  }

  // 1. Ambient Cybernetic Reactor Drone (Subtle, Atmospheric Background)
  initDrone() {
    if (!this.ctx || this.droneGain) return;
    try {
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(this.enabled ? 0.012 : 0, this.ctx.currentTime);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 sub-root

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // Slight detuned A2

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {}
  }

  // Interactive filter modulation on cursor move
  modulateDrone(normX, normY) {
    if (!this.ctx || !this.droneFilter || !this.enabled) return;
    try {
      const now = this.ctx.currentTime;
      const targetFreq = 160 + (normX + normY) * 240;
      this.droneFilter.frequency.setTargetAtTime(targetFreq, now, 0.1);
    } catch (e) {}
  }

  // 2. Harmonic Pentatonic Chime on Hover
  playHover(noteIndex = null) {
    if (!this.enabled) return;
    this.ensureState();
    if (!this.ctx) return;
    this.triggerSpectrumActivity();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = (noteIndex !== null && this.scale[noteIndex % this.scale.length])
        ? this.scale[noteIndex % this.scale.length]
        : 1100;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  // 3. Punchy 5D Sub-Bass Energy Pulse & Laser Transient on Click + Haptics
  playClick() {
    if (navigator.vibrate) {
      try { navigator.vibrate(16); } catch (e) {}
    }
    if (!this.enabled) return;
    this.ensureState();
    if (!this.ctx) return;
    this.triggerSpectrumActivity();

    try {
      const now = this.ctx.currentTime;

      // Sub-bass thump
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(170, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.18);

      subGain.gain.setValueAtTime(0.13, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.2);

      // High cyber click transient
      const hiOsc = this.ctx.createOscillator();
      const hiGain = this.ctx.createGain();
      hiOsc.type = 'triangle';
      hiOsc.frequency.setValueAtTime(2600, now);
      hiOsc.frequency.exponentialRampToValueAtTime(750, now + 0.045);

      hiGain.gain.setValueAtTime(0.07, now);
      hiGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      hiOsc.connect(hiGain);
      hiGain.connect(this.ctx.destination);
      hiOsc.start(now);
      hiOsc.stop(now + 0.05);
    } catch (e) {}
  }

  // 4. Hyperspace Resonance Sweep (3D Mode Switch / Warp Jump) + Haptics
  playWarp() {
    if (navigator.vibrate) {
      try { navigator.vibrate([22, 35, 22]); } catch (e) {}
    }
    if (!this.enabled) return;
    this.ensureState();
    if (!this.ctx) return;
    this.triggerSpectrumActivity();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.38);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.32);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch (e) {}
  }

  // 5. Modal Open Ascending Holographic Chord
  playModalOpen() {
    if (navigator.vibrate) {
      try { navigator.vibrate([18, 30]); } catch (e) {}
    }
    if (!this.enabled) return;
    this.ensureState();
    if (!this.ctx) return;
    this.triggerSpectrumActivity();

    const notes = [440, 554.37, 659.25, 880]; // A major 7th chord
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        gain.gain.setValueAtTime(0.045, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 0.32);
      } catch (e) {}
    });
  }

  // 6. Modal Close Airlock Depressurization Swoosh
  playModalClose() {
    if (!this.enabled) return;
    this.ensureState();
    if (!this.ctx) return;
    this.triggerSpectrumActivity();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.28);

      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(this.enabled ? 0.012 : 0, this.ctx.currentTime, 0.05);
    }
    return this.enabled;
  }
}

const audio5D = new FiveDAudioEngine();

// First user gesture initializes audio context seamlessly
window.addEventListener('pointerdown', () => audio5D.init(), { once: true });
window.addEventListener('keydown', () => audio5D.init(), { once: true });


// ─── 5D SOUND TOGGLE UI ───
const soundToggle = document.getElementById('soundToggle');
if (soundToggle) {
  soundToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isNowOn = audio5D.toggle();
    soundToggle.classList.toggle('active', isNowOn);
    const label = soundToggle.querySelector('.sound-label');
    if (label) label.textContent = isNowOn ? '5D AUDIO' : 'MUTED';
    if (isNowOn) audio5D.playClick();
  });
}


// ─── CUSTOM CURSOR & TELEMETRY COORDINATES ───
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
const hudCoords = document.getElementById('hudCoords');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let trailX = mouseX, trailY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }
  if (hudCoords) {
    hudCoords.textContent = `X: ${String(Math.round(mouseX)).padStart(4, '0')} | Y: ${String(Math.round(mouseY)).padStart(4, '0')}`;
  }
  // Modulate subtle cyber drone
  audio5D.modulateDrone(mouseX / window.innerWidth, mouseY / window.innerHeight);
});

(function animateTrail() {
  if (cursorTrail) {
    trailX += (mouseX - trailX) * 0.14;
    trailY += (mouseY - trailY) * 0.14;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
  }
  requestAnimationFrame(animateTrail);
})();


let currentWarpFactor = 1.0;

// ─── 5D MULTI-STAGE FULLPAGE BACKGROUND ENGINE (5 DYNAMIC SCENE WORLDS) ───
class FiveDMultiStageBackground {
  constructor() {
    this.canvas = document.getElementById('bgCanvas5D');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.sectionWeights = [1, 0, 0, 0, 0];
    this.sectionNames = [
      '1/5 [COSMIC_WARP]',
      '2/5 [CYBER_TERRAIN]',
      '3/5 [NEURAL_PLEXUS]',
      '4/5 [QUANTUM_VORTEX]',
      '5/5 [AURORA_MATRIX]'
    ];
    this.droneFrequencies = [55, 65.4, 73.4, 82.4, 98];
    this.time = 0;
    this.activeDimensionIndex = 0;

    // 1. Cosmic Warp Stars (110 3D Warp Stars for Hero)
    this.warpStars = [];
    for (let i = 0; i < 110; i++) {
      this.warpStars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000 + 1,
        color: Math.random() > 0.4 ? '#f5b942' : (Math.random() > 0.5 ? '#00e5ff' : '#ffffff')
      });
    }

    // 2. 3D Undulating Cyber Matrix Terrain (About)
    this.gridCols = 20;
    this.gridRows = 14;

    // 3. Neural Synaptic Plexus & Constellation Graph (Skills)
    this.neuralNodes = [];
    for (let i = 0; i < 45; i++) {
      this.neuralNodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2.2 + 1.2,
        color: Math.random() > 0.35 ? '#f5b942' : '#00e5ff'
      });
    }
    this.synapticPulses = [];
    for (let i = 0; i < 8; i++) {
      this.synapticPulses.push({
        idxA: Math.floor(Math.random() * 45),
        idxB: Math.floor(Math.random() * 45),
        progress: Math.random(),
        speed: Math.random() * 0.02 + 0.012
      });
    }

    // 4. Quantum Accretion Vortex (Projects)
    this.vortexParticles = [];
    for (let i = 0; i < 100; i++) {
      this.vortexParticles.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * (Math.min(window.innerWidth, window.innerHeight) * 0.42) + 25,
        speed: Math.random() * 0.012 + 0.006,
        size: Math.random() * 2.4 + 0.8,
        color: Math.random() > 0.45 ? '#f5b942' : (Math.random() > 0.5 ? '#00e5ff' : '#ffffff'),
        alpha: Math.random() * 0.7 + 0.25
      });
    }

    // 5. Electromagnetic Aurora & Digital Rain (Contact)
    this.auroraCurtains = [
      { freq: 0.0028, speed: 0.018, amp: 55, colorA: 'hsla(42, 90%, 58%, 0.16)', colorB: 'hsla(187, 100%, 50%, 0.01)' },
      { freq: 0.0042, speed: 0.025, amp: 75, colorA: 'hsla(187, 100%, 50%, 0.14)', colorB: 'hsla(42, 90%, 58%, 0.01)' },
      { freq: 0.0035, speed: 0.014, amp: 45, colorA: 'hsla(36, 95%, 52%, 0.12)', colorB: 'hsla(160, 100%, 50%, 0.01)' }
    ];
    this.matrixColumns = [];
    const cols = Math.min(24, Math.floor(window.innerWidth / 45));
    for (let i = 0; i < cols; i++) {
      this.matrixColumns.push({
        x: i * 45 + 14,
        y: Math.random() * window.innerHeight,
        speed: Math.random() * 2.0 + 1.0,
        glyph: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)),
        changeTime: 0
      });
    }

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initScrollTracker();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initScrollTracker() {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'contact'];

    const updateWeights = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const scrollCenter = scrollY + vh * 0.45;

      const centers = sectionIds.map(id => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return scrollY + rect.top + rect.height * 0.5;
      });

      let minIdx = 0;
      let minDist = Infinity;
      let rawWeights = [];

      for (let i = 0; i < centers.length; i++) {
        const dist = Math.abs(scrollCenter - centers[i]);
        if (dist < minDist) {
          minDist = dist;
          minIdx = i;
        }
        const w = 1 / (1 + Math.pow(dist / (vh * 0.65), 3));
        rawWeights.push(w);
      }

      const sum = rawWeights.reduce((a, b) => a + b, 0) || 1;
      this.sectionWeights = rawWeights.map(w => w / sum);

      if (minIdx !== this.activeDimensionIndex) {
        this.activeDimensionIndex = minIdx;
        const hudDim = document.getElementById('hudDimension');
        if (hudDim) {
          hudDim.textContent = this.sectionNames[minIdx];
        }
        if (audio5D && audio5D.droneOsc1 && audio5D.ctx) {
          try {
            audio5D.droneOsc1.frequency.setTargetAtTime(
              this.droneFrequencies[minIdx],
              audio5D.ctx.currentTime,
              0.5
            );
            audio5D.droneOsc2.frequency.setTargetAtTime(
              this.droneFrequencies[minIdx] * 2 + 0.5,
              audio5D.ctx.currentTime,
              0.5
            );
          } catch (e) {}
        }
      }
    };

    window.addEventListener('scroll', updateWeights, { passive: true });
    updateWeights();
  }

  renderCosmicWarp(weight) {
    if (weight < 0.02) return;
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const speed = (3.0 + currentWarpFactor * 8) * (1 + (mouseX - cx) * 0.0003);

    ctx.save();
    ctx.globalAlpha = weight;

    for (let i = 0; i < this.warpStars.length; i++) {
      const s = this.warpStars[i];
      const prevZ = s.z;
      s.z -= speed;

      if (s.z <= 1) {
        s.z = 1000;
        s.x = (Math.random() - 0.5) * 2000;
        s.y = (Math.random() - 0.5) * 2000;
      }

      const k = 420 / s.z;
      const px = cx + s.x * k + (mouseX - cx) * 0.04;
      const py = cy + s.y * k + (mouseY - cy) * 0.04;

      if (px >= 0 && px <= this.width && py >= 0 && py <= this.height) {
        const starSize = Math.max(0.6, (1 - s.z / 1000) * 2.5);
        ctx.fillStyle = s.color;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = starSize;

        if (currentWarpFactor > 1.25) {
          const prevK = 420 / prevZ;
          const prevX = cx + s.x * prevK + (mouseX - cx) * 0.04;
          const prevY = cy + s.y * prevK + (mouseY - cy) * 0.04;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, starSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  renderCyberTerrain(weight) {
    if (weight < 0.02) return;
    const ctx = this.ctx;
    const cols = this.gridCols;
    const rows = this.gridRows;
    const horizonY = this.height * 0.44;
    const bottomY = this.height + 30;
    const t = this.time * 0.022;

    ctx.save();
    ctx.globalAlpha = weight * 0.85;

    const points = [];
    for (let r = 0; r <= rows; r++) {
      points[r] = [];
      const rowNorm = r / rows;
      const screenY = horizonY + Math.pow(rowNorm, 1.8) * (bottomY - horizonY);
      const spanX = this.width * (0.35 + rowNorm * 0.85);
      const startX = (this.width - spanX) / 2;

      for (let c = 0; c <= cols; c++) {
        const colNorm = c / cols;
        const screenX = startX + colNorm * spanX;
        let elev = Math.sin(c * 0.4 + t * 2.0) * 14 + Math.cos(r * 0.35 - t * 1.5) * 10;
        const d = Math.hypot(screenX - mouseX, screenY - mouseY);
        if (d < 220) {
          elev -= (220 - d) * 0.22;
        }
        points[r][c] = { x: screenX, y: screenY + elev };
      }
    }

    for (let r = 0; r <= rows; r++) {
      const alpha = Math.min(1, (r / rows) * 0.65 + 0.1);
      ctx.strokeStyle = r % 3 === 0 ? `hsla(187, 100%, 50%, ${alpha})` : `hsla(42, 90%, 58%, ${alpha * 0.75})`;
      ctx.lineWidth = r % 4 === 0 ? 1.2 : 0.8;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const pt = points[r][c];
        if (c === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    for (let c = 0; c <= cols; c += 2) {
      ctx.strokeStyle = `hsla(42, 90%, 58%, 0.22)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let r = 0; r <= rows; r++) {
        const pt = points[r][c];
        if (r === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  renderNeuralPlexus(weight) {
    if (weight < 0.02) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = weight * 0.88;

    for (let i = 0; i < this.neuralNodes.length; i++) {
      const n = this.neuralNodes[i];
      const dx = mouseX - n.x;
      const dy = mouseY - n.y;
      const d = Math.hypot(dx, dy);
      if (d < 200 && d > 20) {
        n.vx += (dx / d) * 0.03;
        n.vy += (dy / d) * 0.03;
      }

      n.x += n.vx;
      n.y += n.vy;
      n.vx *= 0.98;
      n.vy *= 0.98;

      if (n.x < 0) n.x = this.width;
      if (n.x > this.width) n.x = 0;
      if (n.y < 0) n.y = this.height;
      if (n.y > this.height) n.y = 0;

      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < this.neuralNodes.length; j++) {
        const n2 = this.neuralNodes[j];
        const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.38;
          ctx.strokeStyle = `hsla(42, 90%, 58%, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    for (let k = 0; k < this.synapticPulses.length; k++) {
      const pulse = this.synapticPulses[k];
      pulse.progress += pulse.speed;
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        pulse.idxA = Math.floor(Math.random() * this.neuralNodes.length);
        pulse.idxB = Math.floor(Math.random() * this.neuralNodes.length);
      }

      const nodeA = this.neuralNodes[pulse.idxA];
      const nodeB = this.neuralNodes[pulse.idxB];
      if (nodeA && nodeB && Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y) < 160) {
        const px = nodeA.x + (nodeB.x - nodeA.x) * pulse.progress;
        const py = nodeA.y + (nodeB.y - nodeA.y) * pulse.progress;
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  renderQuantumVortex(weight) {
    if (weight < 0.02) return;
    const ctx = this.ctx;
    const cx = this.width / 2 + (mouseX - this.width / 2) * 0.05;
    const cy = this.height / 2 + (mouseY - this.height / 2) * 0.05;
    const rotSpeed = 1 + currentWarpFactor * 1.2;

    ctx.save();
    ctx.globalAlpha = weight * 0.9;

    const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 200);
    coreGrad.addColorStop(0, 'hsla(42, 90%, 58%, 0.18)');
    coreGrad.addColorStop(0.4, 'hsla(187, 100%, 50%, 0.08)');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 200, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < this.vortexParticles.length; i++) {
      const p = this.vortexParticles[i];
      p.angle += p.speed * rotSpeed;
      p.dist -= 0.14 * rotSpeed;

      if (p.dist < 20) {
        p.dist = Math.min(this.width, this.height) * 0.42 + Math.random() * 35;
      }

      const px = cx + Math.cos(p.angle) * p.dist * 1.35;
      const py = cy + Math.sin(p.angle) * p.dist * 0.65;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderAuroraMatrix(weight) {
    if (weight < 0.02) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = weight * 0.85;

    for (let i = 0; i < this.auroraCurtains.length; i++) {
      const c = this.auroraCurtains[i];
      const baseY = this.height * (0.38 + i * 0.18);
      const t = this.time * c.speed;

      ctx.beginPath();
      ctx.moveTo(0, this.height);

      for (let x = 0; x <= this.width; x += 22) {
        const y = baseY + Math.sin(x * c.freq + t) * c.amp + Math.cos(x * 0.002 - t * 0.6) * 30;
        if (x === 0) ctx.lineTo(0, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(this.width, this.height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, baseY - 40, 0, this.height);
      grad.addColorStop(0, c.colorA);
      grad.addColorStop(1, c.colorB);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.font = '11px "JetBrains Mono", monospace';
    for (let j = 0; j < this.matrixColumns.length; j++) {
      const col = this.matrixColumns[j];
      col.y += col.speed;
      if (col.y > this.height) col.y = -20;

      col.changeTime++;
      if (col.changeTime > 18) {
        col.glyph = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
        col.changeTime = 0;
      }

      ctx.fillStyle = 'hsla(42, 90%, 58%, 0.4)';
      ctx.fillText(col.glyph, col.x, col.y);

      ctx.fillStyle = '#00e5ff';
      ctx.fillText(col.glyph, col.x, col.y + 12);
    }

    ctx.restore();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (document.hidden) return;
    this.time++;

    this.ctx.fillStyle = 'rgba(6, 6, 8, 0.28)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Only render dimensions with active presence (> 0.02 weight)
    if (this.sectionWeights[0] > 0.02) this.renderCosmicWarp(this.sectionWeights[0]);
    if (this.sectionWeights[1] > 0.02) this.renderCyberTerrain(this.sectionWeights[1]);
    if (this.sectionWeights[2] > 0.02) this.renderNeuralPlexus(this.sectionWeights[2]);
    if (this.sectionWeights[3] > 0.02) this.renderQuantumVortex(this.sectionWeights[3]);
    if (this.sectionWeights[4] > 0.02) this.renderAuroraMatrix(this.sectionWeights[4]);
  }
}

const bg5D = new FiveDMultiStageBackground();


// ─── 5D SENSORY SPARKS & EMBERS OVERLAY CANVAS ───
const sparksCanvas = document.getElementById('sparksCanvas');
let sparksCtx = null;
let sparks = [];
let ambientMotes = [];
let sonicRipples = [];

if (sparksCanvas) {
  sparksCtx = sparksCanvas.getContext('2d');
  function resizeSparks() {
    sparksCanvas.width  = window.innerWidth;
    sparksCanvas.height = window.innerHeight;
  }
  resizeSparks();
  window.addEventListener('resize', resizeSparks);

  // Initialize 24 ambient luminous spacetime motes (optimized count for 60+ FPS)
  for (let i = 0; i < 24; i++) {
    ambientMotes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2.0 + 0.8,
      baseColor: Math.random() > 0.4 ? '#f5b942' : '#00e5ff',
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  class Spark {
    constructor(x, y, vx, vy, color, size, decay) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.size = size;
      this.alpha = 1;
      this.decay = decay || 0.024;
      this.gravity = 0.12;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.96;
      this.alpha -= this.decay;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class SonicRing {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 4;
      this.maxRadius = 140;
      this.alpha = 0.9;
    }
    update() {
      this.radius += 5.5;
      this.alpha -= 0.035;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.strokeStyle = '#f5b942';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Outer chromatic ring
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 1.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Cursor micro-spark trail on fast movement
  let lastSparkTime = 0;
  let prevCursorX = mouseX, prevCursorY = mouseY;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    const speed = Math.hypot(e.clientX - prevCursorX, e.clientY - prevCursorY);
    prevCursorX = e.clientX;
    prevCursorY = e.clientY;

    if (now - lastSparkTime > 30 && speed > 5) {
      lastSparkTime = now;
      sparks.push(new Spark(
        e.clientX + (Math.random() - 0.5) * 8,
        e.clientY + (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.8 - 0.4,
        Math.random() > 0.35 ? '#f5b942' : '#00e5ff',
        Math.random() * 2.2 + 1,
        0.038
      ));
    }
  });

  // Burst explosion on click + Sonic Hologram Ring
  window.addEventListener('pointerdown', (e) => {
    audio5D.playClick();

    // Spawn expanding sonic ring
    sonicRipples.push(new SonicRing(e.clientX, e.clientY));

    // Spawn 26 glowing sparks
    for (let i = 0; i < 26; i++) {
      const angle = (Math.PI * 2 / 26) * i + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 6.0 + 2.5;
      const color = i % 2 === 0 ? '#f5b942' : (i % 3 === 0 ? '#00e5ff' : '#ffffff');
      sparks.push(new Spark(
        e.clientX,
        e.clientY,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        Math.random() * 2.8 + 1.2,
        Math.random() * 0.022 + 0.016
      ));
    }
  });

  // 5D Canvas Render Loop: Gravitational Attractor & Warp Streaks
  (function animateSparksCanvas() {
    sparksCtx.clearRect(0, 0, sparksCanvas.width, sparksCanvas.height);

    const centerX = sparksCanvas.width / 2;
    const centerY = sparksCanvas.height / 2;
    const isWarping = currentWarpFactor > 1.25;

    // 1. Render Ambient Motes with Gravitational Attraction
    for (let i = 0; i < ambientMotes.length; i++) {
      const m = ambientMotes[i];

      // Gravitational force toward cursor
      const dx = mouseX - m.x;
      const dy = mouseY - m.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 320 && dist > 20) {
        const force = (320 - dist) * 0.00015;
        m.vx += (dx / dist) * force;
        m.vy += (dy / dist) * force;
      }

      m.x += m.vx;
      m.y += m.vy;
      m.vx *= 0.985;
      m.vy *= 0.985;

      // Screen boundary wrap
      if (m.x < 0) m.x = sparksCanvas.width;
      if (m.x > sparksCanvas.width) m.x = 0;
      if (m.y < 0) m.y = sparksCanvas.height;
      if (m.y > sparksCanvas.height) m.y = 0;

      // Draw mote or warp streak (no expensive shadowBlur)
      sparksCtx.save();
      sparksCtx.globalAlpha = m.alpha;
      sparksCtx.fillStyle = m.baseColor;

      if (isWarping) {
        // Draw Warp Speed Vector Line radiating from screen center
        const radX = m.x - centerX;
        const radY = m.y - centerY;
        const length = currentWarpFactor * 16;
        sparksCtx.strokeStyle = m.baseColor;
        sparksCtx.lineWidth = m.size * 0.8;
        sparksCtx.beginPath();
        sparksCtx.moveTo(m.x, m.y);
        sparksCtx.lineTo(m.x + (radX * 0.03) * length, m.y + (radY * 0.03) * length);
        sparksCtx.stroke();
      } else {
        sparksCtx.beginPath();
        sparksCtx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        sparksCtx.fill();
      }
      sparksCtx.restore();
    }

    // 2. Render Sonic Rings
    for (let i = sonicRipples.length - 1; i >= 0; i--) {
      const ring = sonicRipples[i];
      ring.update();
      ring.draw(sparksCtx);
      if (ring.alpha <= 0) sonicRipples.splice(i, 1);
    }

    // 3. Render Sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.update();
      s.draw(sparksCtx);
      if (s.alpha <= 0) sparks.splice(i, 1);
    }

    requestAnimationFrame(animateSparksCanvas);
  })();
}


// ─── 5D SENSORY SHOCKWAVE RIPPLE ───
document.addEventListener('pointerdown', (e) => {
  if (e.target.closest('input, textarea')) return;

  const ripple = document.createElement('div');
  ripple.className = 'shockwave-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top  = e.clientY + 'px';
  document.body.appendChild(ripple);

  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
});


// ─── MAGNETIC BUTTON PHYSICS WITH 5D HOVER AUDIO ───
const magneticBtns = document.querySelectorAll('.magnetic-btn, .btn-primary, .btn-secondary, .filter-btn, .hud-btn');
magneticBtns.forEach((btn, idx) => {
  btn.addEventListener('mouseenter', () => {
    audio5D.playHover(idx);
  });

  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    const distFactor = 0.28;
    const moveX = (e.clientX - btnX) * distFactor;
    const moveY = (e.clientY - btnY) * distFactor;
    btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.04)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


// ─── 3D WEBGL HOLOGRAPHIC CORE & WARP STARFIELD (THREE.JS) ───
function initThreeJSHoloCore() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const heroSection = document.getElementById('hero');
  const width  = heroSection ? heroSection.clientWidth : window.innerWidth;
  const height = heroSection ? heroSection.clientHeight : window.innerHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 5.2;

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Dynamic Multi-Spectrum 5D Lighting
  const ambientLight = new THREE.AmbientLight(0x282012, 1.8);
  scene.add(ambientLight);

  const goldKeyLight = new THREE.PointLight(0xffc247, 3.4, 50);
  goldKeyLight.position.set(4, 5, 4);
  scene.add(goldKeyLight);

  const cyanFillLight = new THREE.PointLight(0x00f0ff, 2.0, 50);
  cyanFillLight.position.set(-5, -3, -2);
  scene.add(cyanFillLight);

  const amberRimLight = new THREE.PointLight(0xff7700, 2.5, 50);
  amberRimLight.position.set(0, -4, 3);
  scene.add(amberRimLight);

  // Group container for complete core
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Responsive full-background positioning:
  // On desktop, the core knot centers at x = 1.45 (right side) while its massive rings & starfield span the full 100vw!
  function updateCorePosition() {
    const w = window.innerWidth;
    if (w > 1100) {
      coreGroup.position.set(1.45, 0.05, 0);
      camera.position.z = 5.2;
    } else if (w > 768) {
      coreGroup.position.set(0.9, 0.1, 0);
      camera.position.z = 5.6;
    } else {
      coreGroup.position.set(0, 0.45, 0);
      camera.position.z = 6.2;
    }
  }
  updateCorePosition();

  // 1. Outer Shiny Golden Cyber Geometries
  const geometries = {
    torus: new THREE.TorusKnotGeometry(1.3, 0.38, 128, 32, 2, 3),
    icosa: new THREE.IcosahedronGeometry(1.7, 2),
    quantum: new THREE.DodecahedronGeometry(1.5, 1)
  };

  const wireMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5b942,
    wireframe: true,
    roughness: 0.15,
    metalness: 0.95,
    emissive: 0xa86e00,
    emissiveIntensity: 0.4
  });

  let mainMesh = new THREE.Mesh(geometries.torus, wireMaterial);
  coreGroup.add(mainMesh);

  // 2. Inner Glowing Core Points (Energy Sphere)
  const innerGeo = new THREE.IcosahedronGeometry(0.75, 3);
  const innerPointsMat = new THREE.PointsMaterial({
    color: 0xffd966,
    size: 0.045,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const innerPoints = new THREE.Points(innerGeo, innerPointsMat);
  coreGroup.add(innerPoints);

  // 3. Orbiting Energy Gyro Rings
  const ringGeo1 = new THREE.TorusGeometry(2.1, 0.018, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0xf5b942,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const gyroRing1 = new THREE.Mesh(ringGeo1, ringMat1);
  gyroRing1.rotation.x = Math.PI / 3;
  coreGroup.add(gyroRing1);

  const ringGeo2 = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const gyroRing2 = new THREE.Mesh(ringGeo2, ringMat2);
  gyroRing2.rotation.y = Math.PI / 4;
  coreGroup.add(gyroRing2);

  // 4. Floating 5D Starfield Particle Dust (1,400 Particles filling full viewport width)
  const particleCount = 1400;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 2.4 + Math.random() * 6.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    particlePos[i]     = radius * Math.sin(phi) * Math.cos(theta);
    particlePos[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePos[i + 2] = radius * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xf5b942,
    size: 0.038,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // ─── INTERACTION & WARP PHYSICS STATE ───
  let isDragging = false;
  let prevPointerX = 0, prevPointerY = 0;
  let targetRotX = 0, targetRotY = 0;
  let velocityX = 0.004, velocityY = 0.007;

  // 3 Orbiting Quantum Energy Satellites
  const satGroup = new THREE.Group();
  coreGroup.add(satGroup);
  const satGeo = new THREE.SphereGeometry(0.075, 16, 16);
  const satMat1 = new THREE.MeshBasicMaterial({ color: 0xffd966 });
  const satMat2 = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const satMat3 = new THREE.MeshBasicMaterial({ color: 0xffa040 });
  const sat1 = new THREE.Mesh(satGeo, satMat1);
  const sat2 = new THREE.Mesh(satGeo, satMat2);
  const sat3 = new THREE.Mesh(satGeo, satMat3);
  satGroup.add(sat1, sat2, sat3);

  // Track scroll speed for Warp Drive effect
  let lastScrollY = window.scrollY;
  let scrollSpeed = 0;
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    scrollSpeed = Math.min(2.0, Math.abs(currentY - lastScrollY) * 0.04);
    lastScrollY = currentY;
  }, { passive: true });

  // Mouse move parallax & dynamic 3D light tracking across the hero
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top)  / rect.height - 0.5;

      // Real-time 3D Light Tracking
      goldKeyLight.position.x = 4 + normX * 9;
      goldKeyLight.position.y = 5 - normY * 9;
      cyanFillLight.position.x = -5 - normX * 8;
      cyanFillLight.position.y = -3 + normY * 8;

      if (!isDragging) {
        targetRotY = normX * 1.6;
        targetRotX = normY * 1.3;

        // Hologram Badges counter parallax
        document.querySelectorAll('.hologram-badge').forEach(badge => {
          const depth = parseFloat(badge.dataset.depth || 20);
          badge.style.transform = `translate(${normX * depth}px, ${normY * depth}px)`;
        });
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
      goldKeyLight.position.set(4, 5, 4);
      cyanFillLight.position.set(-5, -3, -2);
      document.querySelectorAll('.hologram-badge').forEach(badge => {
        badge.style.transform = '';
      });
    });
  }

  // Pointer drag controls (full 360 degree 3D rotation)
  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });

  window.addEventListener('pointermove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      coreGroup.rotation.y += deltaX * 0.008;
      coreGroup.rotation.x += deltaY * 0.008;

      velocityX = deltaY * 0.0015;
      velocityY = deltaX * 0.0015;
    }
  });

  window.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
    }
  });

  // Canvas click impulse: Energy Blast & Hyperspace Resonance
  canvas.addEventListener('click', () => {
    audio5D.playWarp();
    let burstScale = 1.32;
    mainMesh.scale.set(burstScale, burstScale, burstScale);
    innerPoints.scale.set(1.5, 1.5, 1.5);
    setTimeout(() => {
      mainMesh.scale.set(1, 1, 1);
    }, 220);
  });

  // HUD 3D Geometry Mode Switcher with 5D Warp Sound FX
  const hudButtons = document.querySelectorAll('.hud-btn');
  hudButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      hudButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      audio5D.playWarp(); // Play 5D Warp Sound

      const geomType = btn.dataset.geometry;
      if (geometries[geomType]) {
        let morphScale = 1;
        const shrinkInterval = setInterval(() => {
          morphScale -= 0.16;
          if (morphScale <= 0.1) {
            clearInterval(shrinkInterval);
            mainMesh.geometry.dispose();
            mainMesh.geometry = geometries[geomType];

            const expandInterval = setInterval(() => {
              morphScale += 0.16;
              mainMesh.scale.set(morphScale, morphScale, morphScale);
              if (morphScale >= 1) {
                clearInterval(expandInterval);
                mainMesh.scale.set(1, 1, 1);
              }
            }, 16);
          } else {
            mainMesh.scale.set(morphScale, morphScale, morphScale);
          }
        }, 16);
      }
    });
  });

  // Responsive Fullscreen Resize
  function onWindowResize() {
    const w = heroSection ? heroSection.clientWidth : window.innerWidth;
    const h = heroSection ? heroSection.clientHeight : window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    updateCorePosition();
  }
  window.addEventListener('resize', onWindowResize);

  // ─── 3D/5D RENDER LOOP ───
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    // ZERO-LAG OPTIMIZATION: Skip rendering when hero is scrolled off screen or tab is hidden
    if (document.hidden || window.scrollY > window.innerHeight * 1.25) {
      return;
    }

    const delta = clock.getDelta();
    const time  = clock.getElapsedTime();

    // Decay scroll speed & update Warp Factor
    scrollSpeed *= 0.94;
    currentWarpFactor = 1.0 + scrollSpeed * 2.8;

    // Update Telemetry Dock Warp readout
    const hudWarpEl = document.getElementById('hudWarp');
    if (hudWarpEl) {
      if (currentWarpFactor > 2.2) {
        hudWarpEl.textContent = `${currentWarpFactor.toFixed(2)}x [WARP SPEED]`;
        hudWarpEl.style.color = '#00e5ff';
      } else if (currentWarpFactor > 1.25) {
        hudWarpEl.textContent = `${currentWarpFactor.toFixed(2)}x [ACCEL]`;
        hudWarpEl.style.color = '#f5b942';
      } else {
        hudWarpEl.textContent = '1.00x [CRUISE]';
        hudWarpEl.style.color = 'var(--gold)';
      }
    }

    if (!isDragging) {
      coreGroup.rotation.y += velocityY + 0.006 + scrollSpeed * 0.04;
      coreGroup.rotation.x += velocityX + 0.003;

      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.04;
      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.04;

      velocityX *= 0.95;
      velocityY *= 0.95;
    }

    // Independent counter-rotation for visual depth
    gyroRing1.rotation.z += 0.012 + scrollSpeed * 0.03;
    gyroRing2.rotation.z -= 0.016 + scrollSpeed * 0.03;
    innerPoints.rotation.y -= 0.008;

    // Orbiting Satellite Nodes
    sat1.position.set(Math.cos(time * 2.4) * 2.2, Math.sin(time * 2.4) * 1.1, Math.sin(time * 2.4) * 2.2);
    sat2.position.set(Math.cos(time * -1.7) * 2.5, Math.cos(time * 1.7) * 1.4, Math.sin(time * -1.7) * 2.5);
    sat3.position.set(Math.sin(time * 2.1) * 1.8, Math.cos(time * 2.1) * 2.3, Math.cos(time * 2.1) * 1.8);

    // Organic 5D breathing pulse with audio reactivity
    const pulseFactor = 1 + Math.sin(time * 2.2) * 0.045 + scrollSpeed * 0.12;
    innerPoints.scale.set(pulseFactor, pulseFactor, pulseFactor);

    // Warp Starfield Speed
    particleSystem.rotation.y = time * 0.035;
    particleSystem.rotation.x = Math.sin(time * 0.02) * 0.15;
    particleSystem.scale.z = 1 + scrollSpeed * 3.8; // Stretch particles along Z-axis on scroll!

    renderer.render(scene, camera);
  }
  animate();
}

// Initialize Three.js when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThreeJSHoloCore);
} else {
  initThreeJSHoloCore();
}


// ─── 3D HOLOGRAPHIC CARD TILT, SPECULAR GLARE & BORDER BEAMS ───
function init3DCardTilt() {
  const tiltableCards = document.querySelectorAll('.project-card, .skill-category');

  tiltableCards.forEach((card, idx) => {
    // Inject specular glare element
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    // Inject animated laser border beam
    let beam = card.querySelector('.card-border-beam');
    if (!beam) {
      beam = document.createElement('div');
      beam.className = 'card-border-beam';
      card.appendChild(beam);
    }

    card.addEventListener('mouseenter', () => {
      audio5D.playHover(idx);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 3D Tilt Angles
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.028, 1.028, 1.028)`;

      // Dynamic Specular Glare following cursor
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(245, 185, 66, 0.28) 0%, rgba(0, 229, 255, 0.08) 45%, transparent 70%)`;

      // Update Border Beam Angle
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
      card.style.setProperty('--beam-angle', `${angle}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      glare.style.background = 'transparent';
    });
  });

  // Avatar 3D Interactive Tilt & Hologram Scan
  const avatarWrapper = document.getElementById('avatarWrapper');
  if (avatarWrapper) {
    avatarWrapper.addEventListener('mouseenter', () => {
      audio5D.playHover(4);
    });

    avatarWrapper.addEventListener('mousemove', (e) => {
      const rect = avatarWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 16;
      const rotY = (x / (rect.width / 2)) * 16;
      avatarWrapper.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06)`;
    });

    avatarWrapper.addEventListener('mouseleave', () => {
      avatarWrapper.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });

    avatarWrapper.addEventListener('click', () => {
      audio5D.playWarp();
      avatarWrapper.style.filter = 'drop-shadow(0 0 35px #00e5ff) hue-rotate(45deg)';
      setTimeout(() => {
        avatarWrapper.style.filter = '';
      }, 500);
    });
  }
}
setTimeout(init3DCardTilt, 400);


// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  updateActiveNav();
  animateOnScroll();
});


// ─── ACTIVE NAV LINK ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) link.classList.add('active');
  });
}


// ─── MOBILE NAV TOGGLE ───
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
const btnHire = document.getElementById('btnHire');

if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    btnHire && btnHire.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
      btnHire && btnHire.classList.remove('open');
    });
  });
}


// ─── TYPEWRITER EFFECT ───
const typed = document.getElementById('typedText');
const phrases = [
  'Enterprise Web Platforms',
  'Native Android Apps',
  'Laravel & PHP Architectures',
  'Jetpack Compose UIs',
  'Financial Billing & Case Systems',
];
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
const TYPING_SPEED = 85;
const DELETE_SPEED = 40;
const PAUSE = 1900;

function type() {
  if (!typed) return;
  const current = phrases[phraseIdx];
  if (!deleting) {
    typed.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, PAUSE);
      return;
    }
    setTimeout(type, TYPING_SPEED);
  } else {
    typed.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(type, DELETE_SPEED);
  }
}
setTimeout(type, 600);


// ─── COUNTER ANIMATION ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const hero = document.getElementById('hero');
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    countersStarted = true;
    counters.forEach(c => animateCounter(c));
  }
}
startCounters();
window.addEventListener('scroll', startCounters, { passive: true });


// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.skill-category, .project-card, .reveal');

function animateOnScroll() {
  revealEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : (i % 3) * 100;
      setTimeout(() => {
        el.classList.add('visible');
        el.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }, delay);
    }
  });
}
animateOnScroll();


// ─── PROJECT FILTERING ───
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    audio5D.playClick();

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  });
});


// ─── PROJECT DATA REPOSITORY (AUTHENTIC DATA) ───
const projectsData = {
  law_billing: {
    title: 'Perez Law Office — Billing & Expense Tracker System',
    category: 'Enterprise Web Application',
    image: 'assets/img/project_law_billing.jpg',
    desc: 'An automated financial management platform built for Perez Law Office. Automates client retainer billing, installment payment schedules, 4-tier cost categorizations, and official accounting documentation.',
    features: [
      'Client & Case Management: Handles Regular and Retainer clients with multi-line fee tracking per legal matter.',
      'Installment Billing (Amortization): Configures flexible monthly payment terms with automated 5-day and 3-day email reminders.',
      'Multi-Channel Receipts: Records Cash, GCash, Bank Transfer, and Check payments with automated PDF official receipt generation.',
      'Statement of Account (SOA): Generates client-ready PDF statements with detailed payment logs and remaining balances.',
      '4-Tier Expense Tracking: Categorizes Operating, Employee, Case-linked Client, and Reimbursable expenses.',
      'Cash Fund & Audit Trail: Real-time balance calculations with automated user, IP, and timestamp audit logging.'
    ],
    tech: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Tailwind CSS', 'DomPDF', 'Pest PHP', 'Vite', 'JavaScript'],
    github: 'https://github.com/arnldry/billing_and_expense_tracker_system'
  },
  regcomp: {
    title: 'RegComp — Legal Hearings & Compliance Portal',
    category: 'Legal Practice Management',
    image: 'assets/img/project_regcomp.jpg',
    desc: 'A corporate legal practice and regulatory compliance platform. Provides law firms and corporate retainers with an interactive visual calendar for court hearings, litigation timelines, and secure client document storage.',
    features: [
      'Visual Hearing Scheduler: Custom-built calendar view supporting time-slot allocation and multi-day hearing timelines.',
      'Secure Document Client Vault: Role-scoped file repository allowing clients and legal staff to upload, preview, and download pleadings.',
      'Regulatory Compliance Tracker: Centralized oversight of statutory regulations, filings, and compliance milestones.',
      'Retainer Reports & Notes: Enables attorneys to document real-time notes and dispatch client status reports.',
      'Role-Based Access Control: Granular security gates separating Managing Partners, Senior Associates, and Retainer Clients.'
    ],
    tech: ['Laravel 11', 'PHP', 'MySQL', 'Blade', 'Tailwind CSS', 'Vite', 'JavaScript'],
    github: 'https://github.com/arnldry/Regcomp-program'
  },
  student_profiling: {
    title: 'OCNHS Guidance Counseling Profiling System',
    category: 'EdTech & Psychological Assessment (Capstone)',
    image: 'assets/img/project_student_profiling.jpg',
    desc: 'A high school guidance counseling system created as a Capstone project for Olongapo City National High School (OCNHS). Digitizes student records, career aptitude evaluations, and psychological inventories.',
    features: [
      'Holland RIASEC Assessment Engine: Automates career interest scoring across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional traits.',
      'Life Values Evaluation: Evaluates personal and psychological values to guide personalized counseling sessions.',
      'Automated Dossier Generation: Exports comprehensive student behavioral and academic summary reports to PDF via DomPDF.',
      'Student & Counselor Portals: Streamlined self-service testing for students with administrative dashboards for counselors.',
      'Archived Record Preservation: Secure archival and retrieval mechanism for student longitudinal counseling history.'
    ],
    tech: ['Laravel 11', 'PHP', 'MySQL', 'Tailwind CSS', 'DomPDF', 'Vite', 'JavaScript'],
    github: 'https://github.com/arnldry/Student_profiling_system_105-main'
  },
  alps_hotels: {
    title: 'The Alps Hotels — Alpine Discovery App',
    category: 'Native Android Mobile App',
    image: 'assets/img/project_alps_hotels.jpg',
    desc: 'A native Android mobile application designed for discovering ski resorts and alpine hotels. Built entirely in Kotlin utilizing modern Jetpack Compose declarative UI and edge-to-edge layout styling.',
    features: [
      'Dynamic Search Filtering: Real-time search by hotel name, location, and amenities with zero UI stutter.',
      'Proximity Indicators: Computes and displays distance metrics to nearby ski lifts and slope facilities.',
      'Interactive Star Ratings: Dynamic visual star rating indicators paired with review scores.',
      'Async Image Pipeline: High-performance remote image decoding, disk caching, and crossfading powered by Coil.',
      'Material Design 3 Theming: Implements dynamic typography, custom elevation cards, and edge-to-edge scaffolding.'
    ],
    tech: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Material 3', 'Coil', 'Gson'],
    github: 'https://github.com/arnldry/Lapuz_TheAlpsHotels'
  },
  notecraft: {
    title: 'NoteCraft — Tag-Based Notes & SQLite Room DB',
    category: 'Native Android Mobile App',
    image: 'assets/img/project_notecraft.jpg',
    desc: 'An offline-first Android note organization application architected according to Google Android Architecture Guidelines. Utilizes Room Database with SQLite, Kotlin Coroutines, and Jetpack Compose.',
    features: [
      'Many-to-Many Relational Schema: Models cross-referencing between Notes and Tags using Room @Relation and CrossRef mapping.',
      'MVVM Architecture: Clean separation of concerns through ViewModels, Repository pattern, and StateFlow observables.',
      'Instant Keyword Search: Query notes and tags instantaneously with SQLite indexed search operations.',
      'Material 3 Card System: Dynamic card list presentation with tag chips, timestamps, and quick action controls.'
    ],
    tech: ['Kotlin', 'Jetpack Compose', 'Room DB', 'SQLite', 'MVVM', 'Coroutines', 'StateFlow'],
    github: 'https://github.com/arnldry/NoteTakingApp_Lapuz'
  },
  dtr_salary: {
    title: 'Workforce Hub — DTR & Salary Payroll System',
    category: 'Enterprise HR & Payroll Management',
    image: 'assets/img/project_dtr_salary.jpg',
    desc: 'An automated Daily Time Record (DTR) and payroll computation platform that streamlines employee attendance tracking, shift logging, leave requests, and payroll disbursements.',
    features: [
      'Automated Attendance Punch Clock: Tracks employee check-in and check-out times with auto tardiness and overtime calculation.',
      'Statutory Deductions Engine: Automatically calculates SSS, PhilHealth, Pag-IBIG, and withholding taxes.',
      'Automated Payslip PDF Export: Renders official pay stubs with itemized allowances, deductions, and net salary.',
      'Leave & Holiday Management: Streamlines employee vacation/sick leave approvals and official holiday adjustments.'
    ],
    tech: ['Laravel', 'PHP', 'MySQL', 'Blade', 'Vite', 'DomPDF'],
    github: 'https://github.com/ryanerichdelacruz17-blip/Dtr_salary_system'
  },
  jokes_api: {
    title: 'Jokes REST API Client — Retrofit & Coroutines',
    category: 'Native Android Mobile App',
    image: 'assets/img/project_notecraft.jpg',
    desc: 'A native Android demonstration application showcasing asynchronous REST API consumption, robust network error handling, and reactive Jetpack Compose state architecture.',
    features: [
      'Retrofit 2 & OkHttp Integration: Asynchronous HTTP requests with JSON serialization via Gson.',
      'Kotlin Coroutines: Background dispatching for non-blocking I/O operations.',
      'StateFlow ViewModels: UI updates reactively to network success, error, and loading states.'
    ],
    tech: ['Kotlin', 'Android SDK', 'Retrofit 2', 'OkHttp', 'Coroutines', 'Jetpack Compose'],
    github: 'https://github.com/arnldry/JokesAPIClient'
  },
  museum_app: {
    title: 'Museum Explorer & Interactive Ticketing App',
    category: 'Native Android Mobile App',
    image: 'assets/img/project_alps_hotels.jpg',
    desc: 'An interactive Android application combining a virtual cultural gallery exhibition guide with an integrated ticketing and seat reservation workflow.',
    features: [
      'Multi-Activity Navigation: Smooth transitions between Explorer, Ticket Booking, and Details activities.',
      'Virtual Exhibition Showcase: Rich image and description layouts for historic and artistic artifacts.',
      'Interactive Ticketing System: Visitor ticket selection, tier pricing, and confirmation flow.'
    ],
    tech: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Android Navigation', 'Material 3'],
    github: 'https://github.com/arnldry/Lapuz_Museum'
  }
};


// ─── PROJECT MODAL CONTROLLER ───
const modalBackdrop  = document.getElementById('projectModalBackdrop');
const modalCloseBtn  = document.getElementById('modalCloseBtn');
const modalDismiss   = document.getElementById('modalDismissBtn');
const modalImage     = document.getElementById('modalImage');
const modalCategory  = document.getElementById('modalCategory');
const modalTitle     = document.getElementById('modalTitle');
const modalDesc      = document.getElementById('modalDesc');
const modalFeatures  = document.getElementById('modalFeatures');
const modalTechStack = document.getElementById('modalTechStack');
const modalGithubBtn = document.getElementById('modalGithubBtn');

function openProjectModal(projectId) {
  const p = projectsData[projectId];
  if (!p) return;

  audio5D.playModalOpen(); // Play 5D Modal Opening Chord

  modalImage.src = p.image;
  modalImage.alt = p.title;
  modalCategory.textContent = p.category;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;
  modalGithubBtn.href = p.github;

  // Populate Features
  modalFeatures.innerHTML = '';
  p.features.forEach(feat => {
    const li = document.createElement('li');
    li.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${feat}</span>
    `;
    modalFeatures.appendChild(li);
  });

  // Populate Tech Stack
  modalTechStack.innerHTML = '';
  p.tech.forEach(t => {
    const span = document.createElement('span');
    span.className = 'project-tag';
    span.textContent = t;
    modalTechStack.appendChild(span);
  });

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (modalBackdrop) {
    audio5D.playModalClose();
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Attach event listeners for open modal buttons
document.querySelectorAll('.btn-open-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const pid = btn.dataset.project;
    openProjectModal(pid);
  });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
if (modalDismiss)  modalDismiss.addEventListener('click', closeProjectModal);

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeProjectModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
    closeProjectModal();
  }
});


// ─── CONTACT FORM ───
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmailInput').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      shakeForm();
      return;
    }

    audio5D.playClick();
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Send Message';
      contactForm.reset();
      formSuccess.classList.add('show');
      audio5D.playModalOpen(); // Chime on success
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }, 1200);
  });
}

function shakeForm() {
  if (!contactForm) return;
  contactForm.style.animation = 'shake 0.4s ease';
  contactForm.addEventListener('animationend', () => {
    contactForm.style.animation = '';
  }, { once: true });
}

// Inject shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}`;
document.head.appendChild(shakeStyle);


// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      audio5D.playClick();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ─── HIDE SCROLL INDICATOR AFTER SCROLL ───
const scrollIndicator = document.getElementById('scrollIndicator');
window.addEventListener('scroll', () => {
  if (scrollIndicator) {
    if (window.scrollY > 200) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.transition = 'opacity 0.5s';
    } else {
      scrollIndicator.style.opacity = '0.6';
    }
  }
}, { passive: true });


// ─── TECH PILLS HOVER TILT ───
document.querySelectorAll('.tech-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    audio5D.playHover();
  });

  pill.addEventListener('mousemove', (e) => {
    const rect = pill.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    pill.style.transform = `translateY(-2px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = '';
  });
});
