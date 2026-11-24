/**
 * 《智械學園：AI 覺醒調查錄》遊戲音效與音樂引擎
 * 支援外部音訊檔案播放，並內建 Web Audio API 程序化合成備援（無音訊檔亦能發聲）
 */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmVolume = 0.5;
    this.sfxVolume = 0.7;
    this.currentBgm = null;
    this.bgmAudioElement = null;
    this.isAudioInitialized = false;

    // 音訊檔案路徑對應
    this.audioPaths = {
      // BGM
      bgm_campus_daily: "assets/audio/bgm/bgm_campus_daily.mp3",
      bgm_investigation: "assets/audio/bgm/bgm_investigation.mp3",
      bgm_system_glitch: "assets/audio/bgm/bgm_system_glitch.mp3",
      bgm_rooftop_sunset: "assets/audio/bgm/bgm_rooftop_sunset.mp3",

      // SFX
      sfx_click: "assets/audio/sfx/sfx_click.mp3",
      sfx_hover: "assets/audio/sfx/sfx_hover.mp3",
      sfx_typewriter: "assets/audio/sfx/sfx_typewriter.mp3",
      sfx_correct: "assets/audio/sfx/sfx_correct.mp3",
      sfx_wrong: "assets/audio/sfx/sfx_wrong.mp3",
      sfx_evidence_get: "assets/audio/sfx/sfx_evidence_get.mp3",
      sfx_glitch: "assets/audio/sfx/sfx_glitch.mp3",
      sfx_alert: "assets/audio/sfx/sfx_alert.mp3",
      sfx_badge: "assets/audio/sfx/sfx_badge.mp3"
    };

    // 快取 Audio 物件
    this.audioCache = {};
  }

  // 瀏覽器需在使用者點擊後才能初始化 AudioContext
  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.isAudioInitialized = true;
      }
    } else if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // 切換靜音
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudioElement) {
      this.bgmAudioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }

  // 播放背景音樂
  playBGM(bgmKey) {
    if (!bgmKey || this.currentBgm === bgmKey) return;
    this.currentBgm = bgmKey;
    const path = this.audioPaths[bgmKey];

    if (!path) return;

    if (this.bgmAudioElement) {
      this.bgmAudioElement.pause();
      this.bgmAudioElement = null;
    }

    const audio = new Audio(path);
    audio.loop = true;
    audio.volume = this.bgmVolume;
    audio.muted = this.isMuted;

    // 嘗試播放，若檔案不存在或被阻止則轉為靜態處理
    audio.play().catch(() => {
      // 檔案不存在或未載入，安靜失敗，不中斷遊戲
      console.log(`[Audio] BGM 檔案 ${path} 尚未就緒，進入靜音狀態`);
    });

    this.bgmAudioElement = audio;
  }

  // 播放音效（優先讀取檔案，失敗則啟動 Web Audio API 程序化合成）
  playSFX(sfxKey) {
    if (this.isMuted) return;
    this.initAudioContext();

    const path = this.audioPaths[sfxKey];
    if (path) {
      if (!this.audioCache[sfxKey]) {
        this.audioCache[sfxKey] = new Audio(path);
      }
      const audio = this.audioCache[sfxKey];
      audio.volume = this.sfxVolume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // 檔案不存在或載入失敗，調用 Web Audio API 合成音效
        this.synthesizeSFX(sfxKey);
      });
    } else {
      this.synthesizeSFX(sfxKey);
    }
  }

  // Web Audio API 程序化音效合成器（保證開箱即有聲）
  synthesizeSFX(key) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    try {
      switch (key) {
        case "sfx_click": {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
          gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case "sfx_hover": {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.03);
          gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.035);
          break;
        }

        case "sfx_typewriter": {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          // 輕微隨機化音高，營造更生動的打字機聲
          const freq = 600 + Math.random() * 80;
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(this.sfxVolume * 0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
        }

        case "sfx_correct": {
          // 清脆和弦 (C5 -> E5 -> G5)
          const notes = [523.25, 659.25, 783.99];
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(this.sfxVolume * 0.35, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.32);
          });
          break;
        }

        case "sfx_wrong": {
          // 吐槽低沉音 (Eb3 -> C3)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(155.56, now);
          osc.frequency.linearRampToValueAtTime(130.81, now + 0.25);
          gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.32);
          break;
        }

        case "sfx_evidence_get": {
          // 閃亮獲取音效 (A4 -> C#5 -> E5 -> A5)
          const chord = [440, 554.37, 659.25, 880];
          chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);
            gain.gain.setValueAtTime(this.sfxVolume * 0.3, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.42);
          });
          break;
        }

        case "sfx_glitch": {
          // 電流火花故障聲
          const bufferSize = this.ctx.sampleRate * 0.15;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          noise.connect(gain);
          gain.connect(this.ctx.destination);
          noise.start(now);
          break;
        }

        case "sfx_alert": {
          // 雙音調警報 (880Hz / 660Hz)
          [0, 0.15].forEach((offset, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(idx === 0 ? 880 : 660, now + offset);
            gain.gain.setValueAtTime(this.sfxVolume * 0.15, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.13);
          });
          break;
        }

        case "sfx_badge": {
          // 勝利 Fanfare 和弦
          const notes = [
            { f: 523.25, t: 0, d: 0.15 },    // C5
            { f: 659.25, t: 0.15, d: 0.15 }, // E5
            { f: 783.99, t: 0.3, d: 0.15 },  // G5
            { f: 1046.50, t: 0.45, d: 0.6 }  // C6 (長音)
          ];
          notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(n.f, now + n.t);
            gain.gain.setValueAtTime(this.sfxVolume * 0.4, now + n.t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + n.t);
            osc.stop(now + n.t + n.d + 0.05);
          });
          break;
        }
      }
    } catch (e) {
      console.warn("[Audio] Web Audio 合成失敗：", e);
    }
  }
}

const gameAudio = new AudioManager();
