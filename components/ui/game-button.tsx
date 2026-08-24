import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';

interface GameButtonProps {
    onPress: () => void;
    label?: string;
    loading?: boolean;
    color?: string;
    borderColor?: string;
    bottomBorderColor?: string;
    disabled?: boolean;
    width?: number | string;
    height?: number;
    borderRadius?: number;
}

export function GameButton({
    onPress,
    label = 'Continue',
    loading = false,
    color = '#00d5ff',
    borderColor,
    bottomBorderColor,
    disabled = false,
    width = '100%',
    height = 55,
    borderRadius = 30,
}: GameButtonProps) {
    // Auto-derive darker shades from the main color if not provided
    const resolvedBorderColor = borderColor ?? darken(color, 0.15);
    const resolvedBottomBorderColor = bottomBorderColor ?? darken(color, 0.25);

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.82}
            style={[
                styles.button,
                {
                    backgroundColor: color,
                    borderColor: resolvedBorderColor,
                    borderBottomColor: resolvedBottomBorderColor,
                    borderRadius,
                    width: width as any,
                    height,
                    opacity: disabled || loading ? 0.7 : 1,
                    shadowColor: color,
                },
            ]}
        >
            {/* Shine strip */}
            <View style={[styles.shine, { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]} />

            {/* Label / spinner */}
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.label}>{label}</Text>
            )}
        </TouchableOpacity>
    );
}

// Simple hex darkening helper
function darken(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        borderBottomWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
        elevation: 8,
    },
    shine: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    label: {
        fontSize: 16,
        fontWeight: '800',
        color: 'white',
        letterSpacing: 0.2,
    },

});