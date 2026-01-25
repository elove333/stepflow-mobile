/**
 * Step Detector Module
 * Detects steps from accelerometer data
 */

import { Accelerometer, AccelerometerData } from './Accelerometer';
import { calculateMagnitude, lowPassFilter } from '../utils/movementHelpers';

export interface StepEvent {
  timestamp: number;
  magnitude: number;
  confidence: number;
}

type StepCallback = (step: StepEvent) => void;

export interface StepDetectorConfig {
  threshold?: number;
  minInterval?: number;
  filterAlpha?: number;
}

class StepDetectorClass {
  private listeners: StepCallback[] = [];
  private isRunning = false;
  private config: Required<StepDetectorConfig>;
  private lastStepTime = 0;
  private lastAccel = { x: 0, y: 0, z: 0 };
  private unsubscribeAccel?: () => void;

  constructor() {
    this.config = {
      threshold: 1.5,
      minInterval: 300,
      filterAlpha: 0.8,
    };
  }

  /**
   * Start step detection
   */
  start(config?: StepDetectorConfig): void {
    if (this.isRunning) {
      console.warn('StepDetector already running');
      return;
    }

    this.config = { ...this.config, ...config };
    this.isRunning = true;
    this.lastStepTime = Date.now();

    // Subscribe to accelerometer
    if (Accelerometer.isAvailable()) {
      if (!Accelerometer.isActive()) {
        Accelerometer.start(50); // 20Hz update rate
      }
      this.unsubscribeAccel = Accelerometer.subscribe((data) => this.processAccelData(data));
    } else {
      console.warn('Accelerometer not available, step detection may not work');
    }

    console.log('StepDetector started');
  }

  /**
   * Stop step detection
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.unsubscribeAccel) {
      this.unsubscribeAccel();
      this.unsubscribeAccel = undefined;
    }

    this.isRunning = false;
    console.log('StepDetector stopped');
  }

  /**
   * Process accelerometer data to detect steps
   */
  private processAccelData(data: AccelerometerData): void {
    // Apply low-pass filter
    const filtered = lowPassFilter(
      { x: data.x, y: data.y, z: data.z },
      this.lastAccel,
      this.config.filterAlpha,
    );
    this.lastAccel = filtered;

    // Calculate magnitude
    const magnitude = calculateMagnitude(filtered);

    // Check for step
    const now = data.timestamp;
    const timeSinceLastStep = now - this.lastStepTime;

    if (magnitude > this.config.threshold && timeSinceLastStep >= this.config.minInterval) {
      this.lastStepTime = now;

      // Calculate confidence based on how much threshold was exceeded
      const confidence = Math.min((magnitude - this.config.threshold) / this.config.threshold, 1.0);

      this.emitStep({
        timestamp: now,
        magnitude,
        confidence,
      });
    }
  }

  /**
   * Subscribe to step events
   */
  subscribe(callback: StepCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Emit step event to all listeners
   */
  private emitStep(step: StepEvent): void {
    this.listeners.forEach((callback) => callback(step));
  }

  /**
   * Check if step detection is supported
   */
  static isSupported(): boolean {
    return Accelerometer.isAvailable();
  }

  /**
   * Get current state
   */
  isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Update configuration
   */
  updateConfig(config: StepDetectorConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stop();
    this.listeners = [];
  }
}

export const StepDetector = new StepDetectorClass();
