import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

export interface OnboardingProgressProps {
  step: number;
  total: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function OnboardingProgress({
  step,
  total,
  color = '#00d5ff',
  backgroundColor = '#e4e4e7',
  height = 12,
  style,
}: OnboardingProgressProps) {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  // Calculate percentage (clamped between 0 and 100)
  const percentage = total > 0 ? Math.min(Math.max((step / total) * 100, 0), 100) : 0;

  useEffect(() => {
    Animated.spring(animatedProgress, {
      toValue: percentage,
      useNativeDriver: false,
      bounciness: 4,
      speed: 12,
    }).start();
  }, [percentage, animatedProgress]);

  const widthInterpolation = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const borderRadius = height / 2;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: total,
        now: step,
      }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthInterpolation,
            backgroundColor: color,
            borderRadius,
          },
        ]}
      >
        {/* Subtle shine highlight */}
        <View style={[styles.shine, { borderRadius }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
