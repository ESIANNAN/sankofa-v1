import { GameButton } from '@/components/ui/game-button';
import { View } from '@/components/ui/view';
import { StyleSheet } from 'react-native';

interface OnboardingFooterProps {
    label?: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    color?: string;
}

export function OnboardingFooter({
    label = 'Continue',
    onPress,
    loading = false,
    disabled = false,
    color = '#00d5ff',
}: OnboardingFooterProps) {
    return (
        <View style={styles.footer}>
            <GameButton
                onPress={onPress}
                loading={loading}
                label={label}
                color={color}
                width="100%"
                height={55}
                borderRadius={28}
                disabled={disabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 8,
    },
});