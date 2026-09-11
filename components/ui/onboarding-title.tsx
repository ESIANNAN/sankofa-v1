import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { StyleSheet } from 'react-native';

interface OnboardingTitleProps {
    heading: string;
    subtitle?: string;
}

export function OnboardingTitle({
    heading,
    subtitle,
}: OnboardingTitleProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{heading}</Text>
            {subtitle && (
                <Text style={styles.subtitle}>{subtitle}</Text>
            )}
        </View>
    );
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