import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../theme';

export interface RhythmIndicatorProps {
  bpm: number;
  active?: boolean;
  color?: string;
  size?: number;
}

export const RhythmIndicator: React.FC<RhythmIndicatorProps> = ({
  bpm,
  active = true,
  color = colors.primary,
  size = 60,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
      return;
    }

    const beatDuration = (60 / bpm) * 1000; // ms per beat

    const pulse = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: beatDuration * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: beatDuration * 0.2,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: beatDuration * 0.8,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: beatDuration * 0.8,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (active) pulse();
      });
    };

    pulse();

    return () => {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [bpm, active, scaleAnim, opacityAnim]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
