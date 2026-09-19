// Procedural Web Audio Engine for Solas Haven

class SoundEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isMuted: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Meditative ambient drone (Warm 432Hz harmonic bed with soft low-pass filter)
  public startAmbient() {
    this.initContext();
    if (!this.ctx) return;

    if (this.oscillators.length > 0) {
      this.stopAmbient();
    }

    // Warm Low-Pass Filter to remove any harsh digital highs
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(540, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.0, this.ctx.currentTime);
    filter.connect(this.ctx.destination);
    this.filterNode = filter;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 3.5);
    masterGain.connect(filter);
    this.droneGain = masterGain;

    // Harmonically tuned frequencies: 108Hz (Earth root), 216Hz, 324Hz, 432Hz (Healing)
    const freqs = [108, 216, 324, 432];
    this.oscillators = freqs.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Organic subtle breathing wave LFO
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.04, this.ctx!.currentTime);
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.setValueAtTime(1.2, this.ctx!.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.28 / (idx + 1), this.ctx!.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      return osc;
    });

    this.isMuted = false;
  }

  public stopAmbient() {
    if (!this.ctx || !this.droneGain) return;
    try {
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch {}
        });
        this.oscillators = [];
        this.isMuted = true;
      }, 1200);
    } catch {
      this.isMuted = true;
    }
  }

  public toggleAmbient(): boolean {
    if (this.isMuted) {
      this.startAmbient();
      return true;
    } else {
      this.stopAmbient();
      return false;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Celestial ascension chime when releasing letter into stars
  public playCelestialAscension() {
    this.initContext();
    if (!this.ctx) return;

    const notes = [185.0, 233.08, 277.18, 369.99, 415.3, 554.37];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 2.6);
    });
  }

  // Delicate Solfeggio 528Hz shimmer note when clicking "Send Light" or "Wander"
  public playLightShimmer() {
    this.initContext();
    if (!this.ctx) return;

    const notes = [528, 660, 792];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.06, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.5);
    });
  }
  // Sacred Prayer Ascension Chime (528Hz Solfeggio Healing Resonance with golden bell harmonics)
  public playPrayerAscensionChime() {
    this.initContext();
    if (!this.ctx) return;

    // 528Hz (Transformation & Miracles) + sacred harmonic intervals (396Hz, 528Hz, 639Hz, 852Hz)
    const freqs = [396, 528, 639, 852, 1056];
    const now = this.ctx.currentTime;

    // Soft master envelope for a cathedral/temple singing bowl effect
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      // Gentle bloom and long ethereal decay
      gain.gain.setValueAtTime(0.0001, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.09 / (idx + 1), now + idx * 0.1 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.00005, now + idx * 0.1 + 3.8);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 3.9);
    });
  }

  // Global Silent Vigil Harmonic: Deep Tibetan singing bowl & crystal swell
  public playVigilHarmonic(intensity: number = 1.0) {
    this.initContext();
    if (!this.ctx) return;

    const baseFreq = 216; // 432Hz sub-octave
    const harmonics = [baseFreq, baseFreq * 1.5, baseFreq * 2, 528];
    const now = this.ctx.currentTime;

    harmonics.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = idx === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now);

      const targetGain = (0.05 / (idx + 1)) * Math.min(intensity, 1.5);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(targetGain, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.00005, now + 3.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 3.3);
    });
  }

  // Sacred Breath 4-7-8 Somatic Tone
  public playBreathTone(phase: "inhale" | "hold" | "exhale") {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";

    if (phase === "inhale") {
      // 4-second gentle ascension (216Hz -> 324Hz)
      osc.frequency.setValueAtTime(216, now);
      osc.frequency.exponentialRampToValueAtTime(324, now + 3.9);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 3.9);
      osc.start(now);
      osc.stop(now + 4.0);
    } else if (phase === "hold") {
      // 7-second suspended tranquility (324Hz with gentle pulse)
      osc.frequency.setValueAtTime(324, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 3.5);
      gain.gain.exponentialRampToValueAtTime(0.02, now + 6.9);
      osc.start(now);
      osc.stop(now + 7.0);
    } else {
      // 8-second long, deep release (324Hz -> 162Hz)
      osc.frequency.setValueAtTime(324, now);
      osc.frequency.exponentialRampToValueAtTime(162, now + 7.9);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.9);
      osc.start(now);
      osc.stop(now + 8.0);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
  }
}

export const soundEngine = new SoundEngine();