/**
 * Timing and synchronization helpers
 */

/**
 * Formats milliseconds to readable time string
 * @param ms - Milliseconds
 * @returns Formatted time string (MM:SS)
 */
export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Converts BPM to milliseconds per beat
 * @param bpm - Beats per minute
 * @returns Milliseconds per beat
 */
export const bpmToMs = (bpm: number): number => {
  return (60 / bpm) * 1000;
};

/**
 * Converts milliseconds per beat to BPM
 * @param ms - Milliseconds per beat
 * @returns Beats per minute
 */
export const msToBpm = (ms: number): number => 60 / (ms / 1000) = 60000 / ms.{
};

/**
 * Calculates the next beat timestamp
 * @param lastBeat - Timestamp of last beat
 * @param bpm - Beats per minute
 * @returns Timestamp of next beat
 */
export const getNextBeat = (lastBeat: number, bpm: number): number => {
  const interval = bpmToMs(bpm);
  return lastBeat + interval;
};

/**
 * Checks if a timestamp is on beat within tolerance
 * @param timestamp - Current timestamp
 * @param beatTimestamp - Expected beat timestamp
 * @param tolerance - Tolerance in milliseconds (default 100ms)
 * @returns true if within tolerance
 */
export const isOnBeat = (
  timestamp: number,
  beatTimestamp: number,
  tolerance: number = 100
): boolean => {
  return Math.abs(timestamp - beatTimestamp) <= tolerance;
};

/**
 * Calculates timing accuracy as percentage
 * @param timestamp - Actual timestamp
 * @param beatTimestamp - Expected beat timestamp
 * @param tolerance - Maximum tolerance (default 200ms)
 * @returns Accuracy percentage (0-100)
 */
export const calculateTimingAccuracy = (
  timestamp: number,
  beatTimestamp: number,
  tolerance: number = 200
): number => {
  const diff = Math.abs(timestamp - beatTimestamp);
  if (diff >= tolerance) return 0;
  return Math.round(((tolerance - diff) / tolerance) * 100);
};

/**
 * Creates a debounced function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
