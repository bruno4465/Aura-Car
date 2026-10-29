// ===================================================
// AURA CAR - WEB AUDIO API SYNTHESIZER
// ===================================================

var audioCtx = null;
var soundEnabled = true;
var engineOsc = null;
var engineGain = null;
var engineFilter = null;

function initAudio() {
  if (audioCtx) return;
  try {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    engineOsc = audioCtx.createOscillator();
    engineOsc.type = 'sawtooth';
    engineOsc.frequency.setValueAtTime(45, audioCtx.currentTime);

    engineFilter = audioCtx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.setValueAtTime(350, audioCtx.currentTime);

    engineGain = audioCtx.createGain();
    engineGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    engineOsc.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(audioCtx.destination);
    engineOsc.start();
  } catch(e) {
    console.warn("Áudio não suportado:", e);
  }
}

function updateEngineSound(rpmRatio, isAccelerating) {
  if (!audioCtx || !engineOsc || !soundEnabled) return;
  var targetFreq = 48 + rpmRatio * 185;
  var targetFilter = 380 + rpmRatio * 1650;
  var targetVol = isAccelerating ? 0.18 : (0.05 + rpmRatio * 0.04);
  engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.05);
  engineFilter.frequency.setTargetAtTime(targetFilter, audioCtx.currentTime, 0.05);
  engineGain.gain.setTargetAtTime(targetVol, audioCtx.currentTime, 0.05);
}

function playCrashSound() {
  if (!audioCtx || !soundEnabled) return;
  try {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch(e){}
}

function playBeep(freq, duration) {
  if (!audioCtx || !soundEnabled) return;
  try {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e){}
}
