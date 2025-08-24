// Audio utility functions for timer sounds
export class AudioManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize AudioContext on first user interaction
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }

  async playBellSound() {
    await this.ensureAudioContext();
    
    if (!this.audioContext) {
      console.warn('AudioContext not available');
      return;
    }

    try {
      // Create a pleasant bell sound using multiple sine waves
      const duration = 1.5; // seconds
      const currentTime = this.audioContext.currentTime;

      // Main bell tone (fundamental frequency)
      const oscillator1 = this.audioContext.createOscillator();
      const gainNode1 = this.audioContext.createGain();
      
      oscillator1.connect(gainNode1);
      gainNode1.connect(this.audioContext.destination);
      
      oscillator1.frequency.setValueAtTime(800, currentTime);
      oscillator1.type = 'sine';
      
      // Envelope for natural bell decay
      gainNode1.gain.setValueAtTime(0, currentTime);
      gainNode1.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);
      gainNode1.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      // Harmonic overtone for richer sound
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode2 = this.audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(this.audioContext.destination);
      
      oscillator2.frequency.setValueAtTime(1200, currentTime);
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0, currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.15, currentTime + 0.01);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, currentTime + duration * 0.8);

      // Higher harmonic for bell-like timbre
      const oscillator3 = this.audioContext.createOscillator();
      const gainNode3 = this.audioContext.createGain();
      
      oscillator3.connect(gainNode3);
      gainNode3.connect(this.audioContext.destination);
      
      oscillator3.frequency.setValueAtTime(1600, currentTime);
      oscillator3.type = 'sine';
      
      gainNode3.gain.setValueAtTime(0, currentTime);
      gainNode3.gain.linearRampToValueAtTime(0.08, currentTime + 0.01);
      gainNode3.gain.exponentialRampToValueAtTime(0.001, currentTime + duration * 0.6);

      // Start and stop all oscillators
      [oscillator1, oscillator2, oscillator3].forEach(osc => {
        osc.start(currentTime);
        osc.stop(currentTime + duration);
      });

    } catch (error) {
      console.warn('Failed to play bell sound:', error);
    }
  }
}

// Create a singleton instance
export const audioManager = new AudioManager();