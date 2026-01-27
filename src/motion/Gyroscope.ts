/**
 * Gyroscope Module
 * Handles device gyroscope sensor data
 */

import { Vector3D } from '../utils/movementHelpers';

export interface GyroscopeData extends Vector3D {
  timestamp: number;
}

type GyroscopeCallback = (data: GyroscopeData) => void;

class GyroscopeClass {
  private listeners: Set<GyroscopeCallback> = new Set();
  private isRunning = false;
  private updateInterval = 100; // ms
  private intervalId?: NodeJS.Timeout;

  /**
   * Start listening to gyroscope
   */
  start(updateInterval: number = 100): void {
    if (this.isRunning) {
      console.warn('Gyroscope already running');
      return;
    }

    this.updateInterval = updateInterval;
    this.isRunning = true;

    // In a real implementation, use react-native-sensors
    // For now, simulate sensor data
    this.intervalId = setInterval(() => {
      this.emitData(this.getMockData());
    }, this.updateInterval);

    console.log('Gyroscope started');
  }

  /**
   * Stop listening to gyroscope
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
    console.log('Gyroscope stopped');
  }

  /**
   * Subscribe to gyroscope updates
   */
  subscribe(callback: GyroscopeCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Emit gyroscope data to all listeners
   */
  private emitData(data: GyroscopeData): void {
    this.listeners.forEach((callback) => callback(data));
  }

  /**
   * Get mock sensor data for testing
   */
  private getMockData(): GyroscopeData {
    return {
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5,
      timestamp: Date.now(),
    };
  }

  /**
   * Check if gyroscope is available
   */
  isAvailable(): boolean {
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
    this.listeners.clear();
  }
}

export const Gyroscope = new GyroscopeClass();
