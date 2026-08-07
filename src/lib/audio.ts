// Web Audio API Synthesizer for Birthday Music & Sound FX
class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private isPlayingMusic: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isPlayingMusic) {
      this.stopMusic();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Play a single synthesized tone with envelope
  private playTone(freq: number, type: OscillatorType, duration: number, delay: number = 0, gainVal: number = 0.15) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  // Sound FX: Confetti Pop
  public playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Sound FX: Candle Blowout
  public playBlowout() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // White noise for blowing wind sound
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.5);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Sound FX: Fanfare / Celebration Chime
  public playFanfare() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.4, idx * 0.1, 0.2);
    });
  }

  // Sound FX: Unlock Success
  public playUnlock() {
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.3, idx * 0.08, 0.2);
    });
  }

  // Music Box: Happy Birthday Tune
  public startMusic() {
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.initCtx();

    // Notes frequencies (Happy Birthday melody in C Major)
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
    const melody: [number, number][] = [
      [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [349.23, 0.6], [329.63, 1.0],
      [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [392.00, 0.6], [349.23, 1.0],
      [261.63, 0.3], [261.63, 0.3], [523.25, 0.6], [440.00, 0.6], [349.23, 0.6], [329.63, 0.6], [293.66, 1.0],
      [466.16, 0.3], [466.16, 0.3], [440.00, 0.6], [349.23, 0.6], [392.00, 0.6], [349.23, 1.2]
    ];

    let currentNote = 0;

    const playNextNote = () => {
      if (!this.isPlayingMusic || this.isMuted) return;
      const [freq, duration] = melody[currentNote];
      // Music box chime timbre: sine + harmonic triangle
      this.playTone(freq, 'sine', duration * 0.9, 0, 0.12);
      this.playTone(freq * 2, 'triangle', duration * 0.5, 0, 0.03);

      currentNote = (currentNote + 1) % melody.length;
      const nextDelay = duration * 600;
      this.musicInterval = window.setTimeout(playNextNote, nextDelay);
    };

    playNextNote();
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic() {
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public getIsPlayingMusic() {
    return this.isPlayingMusic;
  }
}

export const soundFx = new SoundController();
