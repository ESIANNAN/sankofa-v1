import React from 'react';
import { StyleSheet, Animated, type DimensionValue } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';

interface OnboardingProgressProps {
    step: number;
    total: number;
    color?: string;
    opacity?: Animated.Value;
}

export function OnboardingProgress({
    step,
    total,
    color = '#00d5ff',
    opacity,
}: OnboardingProgressProps) {
    const percent: DimensionValue = `${(step / total) * 100}%`;

    const content = (
        <View style={styles.container}>
            <View style={styles.track}>
                <View style={[styles.fill, { width: percent, backgroundColor: color }]} />
            </View>
            <Text style={styles.label}>{Math.round((step / total) * 100)}% complete</Text>
        </View>
    );

    if (opacity) {
        return (
            <Animated.View style={{ width: '100%', opacity }}>
                {content}
            </Animated.View>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        gap: 4,
    },
    track: {
        width: '100%',
        height: 8,
        borderRadius: 99,
        backgroundColor: '#E4E4E7',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 99,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: '#71717a',
    },
});