import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF';
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const handleBack = () => {
    router.back();
  };

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
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name={ChevronLeft} color={textColor} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lesson Detail</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.emoji}>📖</Text>
        <Text variant="heading" style={[styles.title, { color: textColor }]}>
          Lesson Detail Placeholder
        </Text>
        <Text style={[styles.subtitle, { color: mutedTextColor }]}>
          This lesson screen content will be implemented in a future update.
        </Text>
      </View>

      {/* Action Footer */}
      <View style={styles.footer}>
        <Button
          variant="default"
          size="lg"
          onPress={handleBack}
          style={styles.ctaButton}
        >
          Go Back
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    position: 'relative',
    marginBottom: 20,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
