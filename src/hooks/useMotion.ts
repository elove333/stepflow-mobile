/**
 * Motion Detection Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PoseDetector,
  Accelerometer,
  Gyroscope,
  StepDetector,
  BeatSync,
} from '../motion';
import type { Pose } from '../motion/PoseDetector';
import type { AccelerometerData } from '../motion/Accelerometer';
import type { GyroscopeData } from '../motion/Gyroscope';
import type { StepEvent } from '../motion/StepDetector';
import type { BeatEvent, SyncEvent } from '../motion/BeatSync';

export interface UseMotionConfig {
  enablePose?: boolean;
  enableAccelerometer?: boolean;
  enableGyroscope?: boolean;
  enableStepDetection?: boolean;
  enableBeatSync?: boolean;
  bpm?: number;
  stepThreshold?: number;
}

export const useMotion = (config: UseMotionConfig = {}) => {
  const {
    enablePose = false,
    enableAccelerometer = false,
    enableGyroscope = false,
    enableStepDetection = false,
    enableBeatSync = false,
    bpm = 120,
    stepThreshold = 1.5,
  } = config;

  // State
  const [pose, setPose] = useState<Pose | null>(null);
  const [accelData, setAccelData] = useState<AccelerometerData | null>(null);
  const [gyroData, setGyroData] = useState<GyroscopeData | null>(null);
  const [lastStep, setLastStep] = useState<StepEvent | null>(null);
  const [lastBeat, setLastBeat] = useState<BeatEvent | null>(null);
  const [lastSync, setLastSync] = useState<SyncEvent | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs to store unsubscribe functions
  const unsubscribeRefs = useRef<Array<() => void>>([]);

  /**
   * Initialize motion modules
   */
  const initialize = useCallback(async () => {
    try {
      // Initialize pose detector
      if (enablePose) {
        await PoseDetector.init();
        const unsubPose = PoseDetector.subscribe((pose) => setPose(pose));
        unsubscribeRefs.current.push(unsubPose);
        PoseDetector.start();
      }

      // Start accelerometer
      if (enableAccelerometer) {
        Accelerometer.start(50); // 20Hz
        const unsubAccel = Accelerometer.subscribe((data) =>
          setAccelData(data)
        );
        unsubscribeRefs.current.push(unsubAccel);
      }

      // Start gyroscope
      if (enableGyroscope) {
        Gyroscope.start(50); // 20Hz
        const unsubGyro = Gyroscope.subscribe((data) => setGyroData(data));
        unsubscribeRefs.current.push(unsubGyro);
      }

      // Start step detection
      if (enableStepDetection) {
        StepDetector.start({ threshold: stepThreshold });
        const unsubStep = StepDetector.subscribe((step) => setLastStep(step));
        unsubscribeRefs.current.push(unsubStep);
      }

      // Start beat sync
      if (enableBeatSync) {
        BeatSync.start({ bpm });
        const unsubBeat = BeatSync.subscribeBeat((beat) => setLastBeat(beat));
        const unsubSync = BeatSync.subscribeSync((sync) => setLastSync(sync));
        unsubscribeRefs.current.push(unsubBeat, unsubSync);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize motion:', error);
      throw error;
    }
  }, [
    enablePose,
    enableAccelerometer,
    enableGyroscope,
    enableStepDetection,
    enableBeatSync,
    bpm,
    stepThreshold,
  ]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Unsubscribe from all listeners
      unsubscribeRefs.current.forEach((unsub) => unsub());
      unsubscribeRefs.current = [];

      // Stop all motion modules
      if (enablePose) PoseDetector.stop();
      if (enableAccelerometer) Accelerometer.stop();
      if (enableGyroscope) Gyroscope.stop();
      if (enableStepDetection) StepDetector.stop();
      if (enableBeatSync) BeatSync.stop();
    };
  }, [
    enablePose,
    enableAccelerometer,
    enableGyroscope,
    enableStepDetection,
    enableBeatSync,
  ]);

  /**
   * Check sync for a timestamp
   */
  const checkSync = useCallback(
    (timestamp: number): SyncEvent | null => {
      if (enableBeatSync && BeatSync.isActive()) {
        return BeatSync.checkSync(timestamp);
      }
      return null;
    },
    [enableBeatSync]
  );

  /**
   * Update BPM
   */
  const updateBpm = useCallback(
    (newBpm: number) => {
      if (enableBeatSync) {
        BeatSync.updateBpm(newBpm);
      }
    },
    [enableBeatSync]
  );

  /**
   * Get current beat number
   */
  const getCurrentBeat = useCallback((): number => {
    if (enableBeatSync && BeatSync.isActive()) {
      return BeatSync.getCurrentBeat();
    }
    return 0;
  }, [enableBeatSync]);

  return {
    // State
    pose,
    accelData,
    gyroData,
    lastStep,
    lastBeat,
    lastSync,
    isInitialized,

    // Methods
    initialize,
    checkSync,
    updateBpm,
    getCurrentBeat,

    // Status
    isPoseSupported: true,
    isAccelAvailable: true,
    isGyroAvailable: true,
    isStepSupported: true,
  };
};
