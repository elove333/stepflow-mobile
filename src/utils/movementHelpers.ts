/**
 * Movement and motion calculation helpers
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Pose {
  keypoints: Array<{
    x: number;
    y: number;
    score: number;
    name: string;
  }>;
  score: number;
}

/**
 * Calculates magnitude of a 3D vector
 */
export const calculateMagnitude = (vector: Vector3D): number => {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
};

/**
 * Normalizes a 3D vector
 */
export const normalizeVector = (vector: Vector3D): Vector3D => {
  const magnitude = calculateMagnitude(vector);
  if (magnitude === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
    z: vector.z / magnitude,
  };
};

/**
 * Calculates distance between two 3D points
 */
export const calculateDistance = (p1: Vector3D, p2: Vector3D): number => {
  return Math.sqrt(
    (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2 + (p2.z - p1.z) ** 2
  );
};

/**
 * Detects if a step occurred based on acceleration threshold
 * @param magnitude - Current acceleration magnitude
 * @param threshold - Step detection threshold (default 1.5)
 * @param lastStepTime - Timestamp of last detected step
 * @param minStepInterval - Minimum time between steps in ms (default 300ms)
 * @returns true if step detected
 */
export const detectStep = (
  magnitude: number,
  threshold: number = 1.5,
  lastStepTime: number = 0,
  minStepInterval: number = 300
): boolean => {
  const now = Date.now();
  const timeSinceLastStep = now - lastStepTime;
  return magnitude > threshold && timeSinceLastStep >= minStepInterval;
};

/**
 * Applies exponential moving average filter to sensor data
 * @param current - Current value
 * @param previous - Previous filtered value
 * @param alpha - Smoothing factor (0-1, default 0.8)
 * @returns Filtered value
 */
export const applyEMA = (
  current: number,
  previous: number,
  alpha: number = 0.8
): number => {
  return alpha * current + (1 - alpha) * previous;
};

/**
 * Applies low-pass filter to vector
 */
export const lowPassFilter = (
  current: Vector3D,
  previous: Vector3D,
  alpha: number = 0.8
): Vector3D => {
  return {
    x: applyEMA(current.x, previous.x, alpha),
    y: applyEMA(current.y, previous.y, alpha),
    z: applyEMA(current.z, previous.z, alpha),
  };
};

/**
 * Calculates angle between two 2D points in degrees
 */
export const calculateAngle = (
  p1: { x: number; y: number },
  center: { x: number; y: number },
  p2: { x: number; y: number }
): number => {
  const angle1 = Math.atan2(p1.y - center.y, p1.x - center.x);
  const angle2 = Math.atan2(p2.y - center.y, p2.x - center.x);
  let angle = ((angle2 - angle1) * 180) / Math.PI;
  if (angle < 0) angle += 360;
  return angle;
};

/**
 * Checks if pose keypoint confidence is above threshold
 */
export const isKeypointValid = (
  keypoint: { score: number },
  threshold: number = 0.5
): boolean => {
  return keypoint.score >= threshold;
};

/**
 * Smooths pose data over time using moving average
 */
export const smoothPose = (
  poses: Pose[],
  windowSize: number = 5
): Pose | null => {
  if (poses.length === 0) return null;
  if (poses.length < windowSize) return poses[poses.length - 1];

  const recentPoses = poses.slice(-windowSize);
  const avgPose: Pose = {
    keypoints: [],
    score: 0,
  };

  // Average each keypoint
  const keypointCount = recentPoses[0].keypoints.length;
  for (let i = 0; i < keypointCount; i++) {
    let sumX = 0,
      sumY = 0,
      sumScore = 0;
    recentPoses.forEach((pose) => {
      sumX += pose.keypoints[i].x;
      sumY += pose.keypoints[i].y;
      sumScore += pose.keypoints[i].score;
    });
    avgPose.keypoints.push({
      x: sumX / windowSize,
      y: sumY / windowSize,
      score: sumScore / windowSize,
      name: recentPoses[0].keypoints[i].name,
    });
  }

  // Average overall pose score
  avgPose.score =
    recentPoses.reduce((sum, pose) => sum + pose.score, 0) / windowSize;

  return avgPose;
};
