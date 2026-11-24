/**
 * 《智械學園：AI 覺醒調查錄》- 離線程序化音效生成器 (純 Node.js 原生無依賴)
 * 生成標準 44.1kHz 16-bit Mono WAV 音效檔案，作為零外部依賴的實體備援素材
 */

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const OUTPUT_DIR = path.resolve(__dirname, '../assets/audio/sfx');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 建立標準 44.1kHz, 16-bit, Mono WAV 檔案二進位 Buffer
function encodeWAV(samples) {
  const byteRate = SAMPLE_RATE * 2; // 16-bit = 2 bytes
  const blockAlign = 2;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 = Mono)
  buffer.writeUInt32LE(SAMPLE_RATE, 24); // SampleRate
  buffer.writeUInt32LE(byteRate, 28);    // ByteRate
  buffer.writeUInt16LE(blockAlign, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34);          // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write PCM samples
  for (let i = 0; i < samples.length; i++) {
    // 限制在 -1.0 到 1.0 之間
    const s = Math.max(-1, Math.min(1, samples[i]));
    const val = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.round(val), 44 + i * 2);
  }

  return buffer;
}

// 輔助波形產生器
function sine(phase) {
  return Math.sin(phase * 2 * Math.PI);
}

function triangle(phase) {
  const p = phase % 1.0;
  return 4 * Math.abs(p - 0.5) - 1;
}

function sawtooth(phase) {
  const p = phase % 1.0;
  return 2 * p - 1;
}

function square(phase) {
  return (phase % 1.0) < 0.5 ? 1 : -1;
}

// 1. sfx_click (800Hz -> 180Hz)
function genClick() {
  const duration = 0.045;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  let phase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / totalSamples;
    const freq = 800 * Math.pow(180 / 800, t);
    phase += freq / SAMPLE_RATE;
    const env = Math.exp(-t * 12); // 指數快速衰減
    samples[i] = sine(phase) * env * 0.6;
  }
  return samples;
}

// 2. sfx_hover (440Hz -> 660Hz)
function genHover() {
  const duration = 0.035;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  let phase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / totalSamples;
    const freq = 440 + (660 - 440) * t;
    phase += freq / SAMPLE_RATE;
    const env = Math.sin(t * Math.PI); // 平滑升降
    samples[i] = sine(phase) * env * 0.25;
  }
  return samples;
}

// 3. sfx_typewriter (560Hz Dialogue Blip)
function genTypewriter() {
  const duration = 0.03;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  let phase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / totalSamples;
    phase += 580 / SAMPLE_RATE;
    const env = Math.exp(-t * 14);
    samples[i] = triangle(phase) * env * 0.35;
  }
  return samples;
}

// 4. sfx_correct (C5-E5-G5-C6)
function genCorrect() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const stepDuration = 0.065;
  const noteTotal = Math.floor(SAMPLE_RATE * 0.25);
  const totalSamples = Math.floor(SAMPLE_RATE * (stepDuration * 3 + 0.35));
  const samples = new Float32Array(totalSamples);

  notes.forEach((freq, idx) => {
    const startIdx = Math.floor(idx * stepDuration * SAMPLE_RATE);
    let phase = 0;
    for (let i = 0; i < noteTotal && startIdx + i < totalSamples; i++) {
      const t = i / noteTotal;
      phase += freq / SAMPLE_RATE;
      const env = Math.exp(-t * 9);
      samples[startIdx + i] += sine(phase) * env * 0.35;
    }
  });
  return samples;
}

// 5. sfx_wrong (185Hz & 175Hz downslide cartoon buzzer)
function genWrong() {
  const duration = 0.4;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  let phase1 = 0;
  let phase2 = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / totalSamples;
    const freq1 = 185 * Math.pow(110 / 185, t);
    const freq2 = 175 * Math.pow(105 / 175, t);
    phase1 += freq1 / SAMPLE_RATE;
    phase2 += freq2 / SAMPLE_RATE;

    const env = Math.exp(-t * 4);
    const wave = (sawtooth(phase1) + sawtooth(phase2)) * 0.5;
    samples[i] = wave * env * 0.45;
  }
  return samples;
}

// 6. sfx_evidence_get (E5-G#5-B5-E6 crystal chime)
function genEvidenceGet() {
  const notes = [659.25, 830.61, 987.77, 1318.51];
  const stepDuration = 0.085;
  const noteTotal = Math.floor(SAMPLE_RATE * 0.4);
  const totalSamples = Math.floor(SAMPLE_RATE * (stepDuration * 3 + 0.5));
  const samples = new Float32Array(totalSamples);

  notes.forEach((freq, idx) => {
    const startIdx = Math.floor(idx * stepDuration * SAMPLE_RATE);
    let phase = 0;
    for (let i = 0; i < noteTotal && startIdx + i < totalSamples; i++) {
      const t = i / noteTotal;
      phase += freq / SAMPLE_RATE;
      const env = Math.exp(-t * 7);
      // 主波疊加微量高次泛音營造水晶感
      const wave = triangle(phase) * 0.7 + sine(phase * 2) * 0.3;
      samples[startIdx + i] += wave * env * 0.4;
    }
  });
  return samples;
}

// 7. sfx_glitch (電弧與白雜訊干擾)
function genGlitch() {
  const duration = 0.22;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  let squarePhase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / totalSamples;
    const noise = Math.random() * 2 - 1;
    const squareFreq = 80 + 350 * t;
    squarePhase += squareFreq / SAMPLE_RATE;

    const env = Math.exp(-t * 6);
    const mix = noise * 0.6 + square(squarePhase) * 0.4;
    samples[i] = mix * env * 0.45;
  }
  return samples;
}

// 8. sfx_alert (校園廣播叮-咚 392Hz -> 261.63Hz)
function genAlert() {
  const chimeNotes = [
    { freq: 392.00, start: 0.0, dur: 0.75 },
    { freq: 261.63, start: 0.45, dur: 1.05 }
  ];
  const totalDuration = 1.5;
  const totalSamples = Math.floor(SAMPLE_RATE * totalDuration);
  const samples = new Float32Array(totalSamples);

  chimeNotes.forEach(note => {
    const startIdx = Math.floor(note.start * SAMPLE_RATE);
    const count = Math.floor(note.dur * SAMPLE_RATE);
    let phase = 0;
    for (let i = 0; i < count && startIdx + i < totalSamples; i++) {
      const t = i / count;
      phase += note.freq / SAMPLE_RATE;
      const env = Math.exp(-t * 4);
      // 正弦波 + 柔和倍頻
      const wave = sine(phase) * 0.8 + sine(phase * 2) * 0.2;
      samples[startIdx + i] += wave * env * 0.4;
    }
  });
  return samples;
}

// 9. sfx_badge (大調凱旋 Fanfare)
function genBadge() {
  const fanfare = [
    { freq: 523.25, start: 0.00, dur: 0.14 },
    { freq: 523.25, start: 0.14, dur: 0.14 },
    { freq: 523.25, start: 0.28, dur: 0.14 },
    { freq: 659.25, start: 0.42, dur: 0.26 },
    { freq: 783.99, start: 0.68, dur: 0.20 },
    { freq: 1046.50, start: 0.88, dur: 0.80 }
  ];
  const totalDuration = 1.7;
  const totalSamples = Math.floor(SAMPLE_RATE * totalDuration);
  const samples = new Float32Array(totalSamples);

  fanfare.forEach(item => {
    const startIdx = Math.floor(item.start * SAMPLE_RATE);
    const count = Math.floor(item.dur * SAMPLE_RATE);
    let phase = 0;
    for (let i = 0; i < count && startIdx + i < totalSamples; i++) {
      const t = i / count;
      phase += item.freq / SAMPLE_RATE;
      const env = Math.exp(-t * 5);
      const wave = triangle(phase) * 0.75 + sine(phase) * 0.25;
      samples[startIdx + i] += wave * env * 0.4;
    }
  });
  return samples;
}

const sfxGenerators = {
  sfx_click: genClick,
  sfx_hover: genHover,
  sfx_typewriter: genTypewriter,
  sfx_correct: genCorrect,
  sfx_wrong: genWrong,
  sfx_evidence_get: genEvidenceGet,
  sfx_glitch: genGlitch,
  sfx_alert: genAlert,
  sfx_badge: genBadge
};

console.log('⚡ 正在為《智械學園》生成實體離線音效檔案 (assets/audio/sfx/)...');

for (const [name, generator] of Object.entries(sfxGenerators)) {
  const samples = generator();
  const wavBuffer = encodeWAV(samples);
  
  // 輸出 .wav 與 .mp3 相容性檔案
  const wavPath = path.join(OUTPUT_DIR, `${name}.wav`);
  const mp3Path = path.join(OUTPUT_DIR, `${name}.mp3`);
  
  fs.writeFileSync(wavPath, wavBuffer);
  fs.writeFileSync(mp3Path, wavBuffer); // 瀏覽器 Audio 物件支援 WAV 格式音訊數據
  console.log(`  ✓ 生成音效: ${name}.mp3 / ${name}.wav (${(wavBuffer.length / 1024).toFixed(1)} KB)`);
}

console.log('🎉 9 組實體音效已全數就緒！可隨時於前端或離線環境直接播放。');
