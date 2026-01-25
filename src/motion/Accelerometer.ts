/**
 * Accelerometer Module
 * Handles device accelerometer sensor data
 */

import { Vector3D } from '../utils/movementHelpers';

export interface AccelerometerData extends Vector3D {
  timestamp: number;
}

type AccelerometerCallback = (data: AccelerometerData) => void;

class AccelerometerClass {
  private listeners: AccelerometerCallback[] = [];
  private isRunning = false;
  private updateInterval = 100; // ms
  private intervalId?: ReturnType<typeof setInterval>;

  /**
   * Start listening to accelerometer
   */
  start(updateInterval: number = 100): void {
    if (this.isRunning) {
      console.warn('Accelerometer already running');
      return;
    }

    this.updateInterval = updateInterval;
    this.isRunning = true;

    // In a real implementation, use react-native-sensors
    // For now, simulate sensor data
    this.intervalId = setInterval(() => {
      this.emitData(this.getMockData());
    }, this.updateInterval);

    console.log('Accelerometer started');
  }

  /**
   * Stop listening to accelerometer
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.isRunning = false;
    console.log('Accelerometer stopped');
  }

  /**
   * Subscribe to accelerometer updates
   */
  subscribe(callback: AccelerometerCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Emit accelerometer data to all listeners
   */
  private emitData(data: AccelerometerData): void {
    this.listeners.forEach((callback) => callback(data));
  }

  /**
   * Get mock sensor data for testing
   */
  private getMockData(): AccelerometerData {
    return {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: 9.8 + (Math.random() - 0.5),
      timestamp: Date.now(),
    };
  }

  /**
   * Check if accelerometer is available
   */
  static isAvailable(): boolean {
    // In a real implementation, check device capabilities
    return true;
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
    this.listeners = [];
  }
}

export const Accelerometer = new AccelerometerClass();
