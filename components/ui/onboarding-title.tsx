import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';

interface OnboardingTitleProps {
    heading: string;
    subtitle?: string;
    opacity?: Animated.Value;
}

export function OnboardingTitle({
    heading,
    subtitle,
    opacity,
}: OnboardingTitleProps) {
    const content = (
        <View style={styles.container}>
            <Text style={styles.heading}>{heading}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );

    if (opacity) {
        return (
            <Animated.View style={[{ width: '100%' }, { opacity }]}>
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
    },
    heading: {
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
        textAlign: 'center',
        color: '#111',
        marginBottom: 6,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 20,
        color: '#71717a',
    },
});