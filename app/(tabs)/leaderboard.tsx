import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: Math.max(insets.top, 24),
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      <Text variant="heading" style={styles.title}>
        🏆 Leaderboard
      </Text>
      <Text style={styles.description}>
        Rankings and league details will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#71717a',
    textAlign: 'center',
  },
});
