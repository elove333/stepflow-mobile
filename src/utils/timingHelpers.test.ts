/**
 * Tests for timing helpers
 */

import { bpmToMs, msToBpm, formatTime, isOnBeat, calculateTimingAccuracy } from './timingHelpers';

describe('timingHelpers', () => {
  describe('bpmToMs', () => {
    it('should convert 60 BPM to 1000ms', () => {
      expect(bpmToMs(60)).toBe(1000);
    });

    it('should convert 120 BPM to 500ms', () => {
      expect(bpmToMs(120)).toBe(500);
    });

    it('should convert 90 BPM to approximately 666.67ms', () => {
      expect(bpmToMs(90)).toBeCloseTo(666.67, 1);
    });
  });

  describe('msToBpm', () => {
    it('should convert 1000ms to 60 BPM', () => {
      expect(msToBpm(1000)).toBe(60);
    });

    it('should convert 500ms to 120 BPM', () => {
      expect(msToBpm(500)).toBe(120);
    });
  });

  describe('formatTime', () => {
    it('should format 0ms as 00:00', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('should format 60000ms as 01:00', () => {
      expect(formatTime(60000)).toBe('01:00');
    });

    it('should format 125000ms as 02:05', () => {
      expect(formatTime(125000)).toBe('02:05');
    });
  });

  describe('isOnBeat', () => {
    it('should return true when timestamp is exactly on beat', () => {
      expect(isOnBeat(1000, 1000, 100)).toBe(true);
    });

    it('should return true when timestamp is within tolerance', () => {
      expect(isOnBeat(1050, 1000, 100)).toBe(true);
      expect(isOnBeat(950, 1000, 100)).toBe(true);
    });

    it('should return false when timestamp is outside tolerance', () => {
      expect(isOnBeat(1150, 1000, 100)).toBe(false);
      expect(isOnBeat(850, 1000, 100)).toBe(false);
    });
  });

  describe('calculateTimingAccuracy', () => {
    it('should return 100 for perfect timing', () => {
      expect(calculateTimingAccuracy(1000, 1000, 200)).toBe(100);
    });

    it('should return 0 for timing outside tolerance', () => {
      expect(calculateTimingAccuracy(1300, 1000, 200)).toBe(0);
    });

    it('should return 50 for timing halfway to tolerance', () => {
      expect(calculateTimingAccuracy(1100, 1000, 200)).toBe(50);
    });
  });
});
