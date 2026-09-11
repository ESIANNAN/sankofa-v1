import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { OnboardingProgress } from './onboarding-progress';

interface OnboardingHeaderProps {
    title: string;
    step: number;
    total: number;
    onBack?: () => void;
    progressColor?: string;
}

export function OnboardingHeader({
    title,
    step,
    total,
    onBack,
    progressColor = '#00d5ff',
}: OnboardingHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Icon name={ChevronLeft} color="#000000" size={24} />
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>{title}</Text>
            </View>
            <OnboardingProgress
                step={step}
                total={total}
                color={progressColor}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: '#71717a',
        textTransform: 'uppercase',
    },
});