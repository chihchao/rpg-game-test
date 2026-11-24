/**
 * 《智械學園：AI 覺醒調查錄》- 核心音訊管理器 (Audio Manager)
 * 具備「實體音訊加載」與「Web Audio API 程序化合成備援」雙軌機制
 * 授權相容性：CC0 1.0 Universal / Creative Commons
 */

class SoundSynthesizer {
  constructor(ctx) {
    this.ctx = ctx;
    this.noiseBuffer = null;
    this.initNoiseBuffer();
  }

  // 初始化白噪聲緩衝區（供 Glitch 等音效使用）
  initNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 1.0;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }

  // 1. UI 點擊音 (Click)
  playClick(volume = 0.5) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    gain.gain.setValueAtTime(volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // 2. UI 懸停音 (Hover)
  playHover(volume = 0.5) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.03);

    gain.gain.setValueAtTime(volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  // 3. 對話打字機嗶嗶聲 (Typewriter Blip) - 可傳入基礎音高與隨機偏移
  playTypewriter(pitch = 560, volume = 0.5) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // 微幅隨機頻率，增添口語活潑感
    const variation = (Math.random() - 0.5) * 50;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch + variation, now);

    gain.gain.setValueAtTime(volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  // 4. 正確/推理成功提示音 (Correct Chime - Major Arpeggio)
  playCorrect(volume = 0.5) {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(volume * 0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.25);
    });
  }

  // 5. 錯誤/阿哲吐槽音 (Wrong Buzzer / Cartoon Slide)
  playWrong(volume = 0.5) {
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    // 雙音失諧下滑，營造詼諧失望感
    osc1.frequency.setValueAtTime(185, now);
    osc1.frequency.exponentialRampToValueAtTime(110, now + 0.35);

    osc2.frequency.setValueAtTime(175, now);
    osc2.frequency.exponentialRampToValueAtTime(105, now + 0.35);

    gain.gain.setValueAtTime(volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.38);
  }

  // 6. 獲得證物/圖鑑解鎖 Jingle (Evidence Unlock)
  playEvidenceGet(volume = 0.5) {
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(volume * 0.4, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }

  // 7. 系統故障紅光火花聲 (Glitch Spark)
  playGlitch(volume = 0.5) {
    if (!this.noiseBuffer) this.initNoiseBuffer();
    const now = this.ctx.currentTime;

    // 白噪音切片
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.18);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    // 疊加一個快速方波音頻干擾
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    oscGain.gain.setValueAtTime(volume * 0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.2);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 8. 校園廣播警示鐘聲 (School Alert Chime: Ding-Dong)
  playAlert(volume = 0.5) {
    const startTime = this.ctx.currentTime;
    const chimeNotes = [
      { freq: 392.00, delay: 0.0, dur: 0.7 }, // G4 (叮)
      { freq: 261.63, delay: 0.4, dur: 1.0 }  // C4 (咚)
    ];

    chimeNotes.forEach(note => {
      const t = startTime + note.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, t);

      gain.gain.setValueAtTime(volume * 0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + note.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.dur);
    });
  }

  // 9. 認證徽章凱旋號角 (Victory Fanfare)
  playBadge(volume = 0.5) {
    const startTime = this.ctx.currentTime;
    const fanfare = [
      { freq: 523.25, time: 0.00, dur: 0.12 }, // C5
      { freq: 523.25, time: 0.12, dur: 0.12 }, // C5
      { freq: 523.25, time: 0.24, dur: 0.12 }, // C5
      { freq: 659.25, time: 0.36, dur: 0.25 }, // E5
      { freq: 783.99, time: 0.61, dur: 0.18 }, // G5
      { freq: 1046.50, time: 0.80, dur: 0.70 } // C6
    ];

    fanfare.forEach(item => {
      const t = startTime + item.time;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.freq, t);

      gain.gain.setValueAtTime(volume * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + item.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + item.dur);
    });
  }
}

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.synthesizer = null;
    this.isMuted = false;
    this.masterVolume = 1.0;
    this.bgmVolume = 0.5;
    this.sfxVolume = 0.7;

    // 音訊資源路徑
    this.baseAudioPath = 'assets/audio/';
    this.bgmAudioElement = null;
    this.currentBgmKey = null;

    // 快取的 AudioBuffer 或 HTMLAudioElement
    this.sfxCache = new Map();
    this.audioUnlocked = false;

    // 對話打字機節流閥 (防止連續字母觸發頻率過快爆音)
    this.lastTypewriterTime = 0;
    this.typewriterThrottleMs = 38;

    // 角色特徵音高設定 (可依照講話角色微調)
    this.characterPitches = {
      default: 560,
      emma: 680,     // 艾瑪：高敏銳、知性稍高頻
      azhe: 420,     // 阿哲：憨厚微胖、中低音
      zhibot: 740,   // 小智：清脆合成電子音
      teacher: 480   // 林老師：成熟沉穩
    };

    this.bindUserInteractionUnlock();
  }

  // 確保 AudioContext 已初始化並解除瀏覽器限制
  ensureContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.synthesizer = new SoundSynthesizer(this.audioContext);
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  // 監聽使用者首次手勢解鎖音訊上下文
  bindUserInteractionUnlock() {
    const unlockHandler = () => {
      this.ensureContext();
      this.audioUnlocked = true;
      ['click', 'keydown', 'touchstart'].forEach(evt => {
        document.removeEventListener(evt, unlockHandler);
      });
    };
    ['click', 'keydown', 'touchstart'].forEach(evt => {
      document.addEventListener(evt, unlockHandler, { once: true });
    });
  }

  // 播放 SFX 音效（實體檔優先，失敗自動降級為合成音效）
  playSFX(sfxKey, options = {}) {
    if (this.isMuted) return;
    this.ensureContext();

    // 專屬對話打字機節流保護
    if (sfxKey === 'sfx_typewriter') {
      const now = performance.now();
      if (now - this.lastTypewriterTime < this.typewriterThrottleMs) {
        return;
      }
      this.lastTypewriterTime = now;
    }

    const volume = (options.volume ?? 1.0) * this.sfxVolume * this.masterVolume;
    const filePath = `${this.baseAudioPath}sfx/${sfxKey}.mp3`;

    // 嘗試建立 HTMLAudioElement 播放實體檔
    const audio = new Audio(filePath);
    audio.volume = Math.max(0, Math.min(1, volume));

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // 實體檔不存在或載入失敗，無縫降級為 Web Audio API 程序化合成音效
        this.fallbackSyntheticSFX(sfxKey, volume, options);
      });
    }
  }

  // 根據金鑰回退至合成器
  fallbackSyntheticSFX(sfxKey, volume, options = {}) {
    if (!this.synthesizer) return;

    switch (sfxKey) {
      case 'sfx_click':
        this.synthesizer.playClick(volume);
        break;
      case 'sfx_hover':
        this.synthesizer.playHover(volume);
        break;
      case 'sfx_typewriter': {
        const charType = options.character || 'default';
        const pitch = options.pitch || this.characterPitches[charType] || 560;
        this.synthesizer.playTypewriter(pitch, volume);
        break;
      }
      case 'sfx_correct':
        this.synthesizer.playCorrect(volume);
        break;
      case 'sfx_wrong':
        this.synthesizer.playWrong(volume);
        break;
      case 'sfx_evidence_get':
        this.synthesizer.playEvidenceGet(volume);
        break;
      case 'sfx_glitch':
        this.synthesizer.playGlitch(volume);
        break;
      case 'sfx_alert':
        this.synthesizer.playAlert(volume);
        break;
      case 'sfx_badge':
        this.synthesizer.playBadge(volume);
        break;
      default:
        this.synthesizer.playClick(volume);
        break;
    }
  }

  // 播放背景音樂（支援淡入與循環播放）
  playBGM(bgmKey, fadeDuration = 1.0) {
    if (this.currentBgmKey === bgmKey && this.bgmAudioElement && !this.bgmAudioElement.paused) {
      return; // 相同曲目正在播放中
    }

    this.ensureContext();
    const targetVolume = this.isMuted ? 0 : this.bgmVolume * this.masterVolume;
    const filePath = `${this.baseAudioPath}bgm/${bgmKey}.mp3`;

    // 若有現存 BGM，先優雅淡出
    if (this.bgmAudioElement) {
      const oldBgm = this.bgmAudioElement;
      this.fadeOutAudio(oldBgm, fadeDuration);
    }

    const newBgm = new Audio(filePath);
    newBgm.loop = true;
    newBgm.volume = 0; // 從靜音開始淡入

    const playPromise = newBgm.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.bgmAudioElement = newBgm;
        this.currentBgmKey = bgmKey;
        this.fadeInAudio(newBgm, targetVolume, fadeDuration);
      }).catch(err => {
        console.warn(`[AudioManager] BGM '${bgmKey}' 載入未就緒 (${err.message})。`);
        this.currentBgmKey = bgmKey;
      });
    }
  }

  // 停止當前 BGM
  stopBGM(fadeDuration = 0.5) {
    if (this.bgmAudioElement) {
      this.fadeOutAudio(this.bgmAudioElement, fadeDuration, () => {
        this.bgmAudioElement = null;
        this.currentBgmKey = null;
      });
    }
  }

  // 平滑淡入
  fadeInAudio(audio, targetVolume, duration) {
    const steps = 20;
    const stepTime = (duration * 1000) / steps;
    const volIncrement = targetVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(targetVolume, currentStep * volIncrement);
      if (currentStep >= steps || audio.paused) {
        clearInterval(interval);
        audio.volume = targetVolume;
      }
    }, stepTime);
  }

  // 平滑淡出
  fadeOutAudio(audio, duration, callback) {
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = (duration * 1000) / steps;
    const volDecrement = startVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(0, startVolume - (currentStep * volDecrement));
      if (currentStep >= steps || audio.volume <= 0.01) {
        clearInterval(interval);
        audio.pause();
        if (callback) callback();
      }
    }, stepTime);
  }

  // 全域靜音切換
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudioElement) {
      this.bgmAudioElement.volume = this.isMuted ? 0 : this.bgmVolume * this.masterVolume;
    }
    return this.isMuted;
  }

  // 設定 BGM 音量 (0.0 ~ 1.0)
  setBGMVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudioElement && !this.isMuted) {
      this.bgmAudioElement.volume = this.bgmVolume * this.masterVolume;
    }
  }

  // 設定 SFX 音量 (0.0 ~ 1.0)
  setSFXVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }
}

// 實例化單例並掛載至全域
const audioManager = new AudioManager();
if (typeof window !== 'undefined') {
  window.audioManager = audioManager;
  window.AudioManager = AudioManager;
}

export { audioManager, AudioManager, SoundSynthesizer };
