/**
 * Beat Sync Module
 * Synchronizes user movements with music beats
 */

import { bpmToMs, isOnBeat, calculateTimingAccuracy } from '../utils/timingHelpers';

export interface BeatEvent {
  timestamp: number;
  beatNumber: number;
  bpm: number;
}

export interface SyncEvent {
  timestamp: number;
  beatTimestamp: number;
  accuracy: number;
  onBeat: boolean;
}

type BeatCallback = (beat: BeatEvent) => void;
type SyncCallback = (sync: SyncEvent) => void;

export interface BeatSyncConfig {
  bpm: number;
  tolerance?: number;
}

class BeatSyncClass {
  private beatListeners: BeatCallback[] = [];
  private syncListeners: SyncCallback[] = [];
  private isRunning = false;
  private bpm = 120;
  private tolerance = 100; // ms
  private startTime = 0;
  private beatNumber = 0;
  private intervalId?: NodeJS.Timeout;

  /**
   * Start beat synchronization
   */
  start(config: BeatSyncConfig): void {
    if (this.isRunning) {
      console.warn('BeatSync already running');
      return;
    }

    this.bpm = config.bpm;
    this.tolerance = config.tolerance || 100;
    this.startTime = Date.now();
    this.beatNumber = 0;
    this.isRunning = true;

    // Start beat loop
    this.scheduleBeat();

    console.log(`BeatSync started at ${this.bpm} BPM`);
  }

  /**
   * Stop beat synchronization
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = undefined;
    }

    this.isRunning = false;
    console.log('BeatSync stopped');
  }

  /**
   * Schedule next beat
   */
  private scheduleBeat(): void {
    const beatInterval = bpmToMs(this.bpm);
    const nextBeatTime = this.startTime + this.beatNumber * beatInterval;
    const now = Date.now();
    const delay = Math.max(0, nextBeatTime - now);

    this.intervalId = setTimeout(() => {
      this.emitBeat({
        timestamp: Date.now(),
        beatNumber: this.beatNumber,
        bpm: this.bpm,
      });

      this.beatNumber++;

      if (this.isRunning) {
        this.scheduleBeat();
      }
    }, delay);
  }

  /**
   * Check if timestamp is on beat
   */
  checkSync(timestamp: number): SyncEvent {
    const beatInterval = bpmToMs(this.bpm);
    const elapsedTime = timestamp - this.startTime;
    const nearestBeatNumber = Math.round(elapsedTime / beatInterval);
    const beatTimestamp = this.startTime + nearestBeatNumber * beatInterval;

    const onBeat = isOnBeat(timestamp, beatTimestamp, this.tolerance);
    const accuracy = calculateTimingAccuracy(timestamp, beatTimestamp, this.tolerance * 2);

    const syncEvent: SyncEvent = {
      timestamp,
      beatTimestamp,
      accuracy,
      onBeat,
    };

    this.emitSync(syncEvent);

    return syncEvent;
  }

  /**
   * Subscribe to beat events
   */
  subscribeBeat(callback: BeatCallback): () => void {
    this.beatListeners.push(callback);
    return () => {
      this.beatListeners = this.beatListeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Subscribe to sync check events
   */
  subscribeSync(callback: SyncCallback): () => void {
    this.syncListeners.push(callback);
    return () => {
      this.syncListeners = this.syncListeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Emit beat event to all listeners
   */
  private emitBeat(beat: BeatEvent): void {
    this.beatListeners.forEach((callback) => callback(beat));
  }

  /**
   * Emit sync event to all listeners
   */
  private emitSync(sync: SyncEvent): void {
    this.syncListeners.forEach((callback) => callback(sync));
  }

  /**
   * Update BPM
   */
  updateBpm(bpm: number): void {
    if (this.isRunning) {
      // Restart with new BPM
      this.stop();
      this.start({ bpm, tolerance: this.tolerance });
    } else {
      this.bpm = bpm;
    }
  }

  /**
   * Get current BPM
   */
  getBpm(): number {
    return this.bpm;
  }

  /**
   * Get current beat number
   */
  getCurrentBeat(): number {
    return this.beatNumber;
  }

  /**
   * Get current state
   */
  isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stop();
    this.beatListeners = [];
    this.syncListeners = [];
  }
}

export const BeatSync = new BeatSyncClass();
