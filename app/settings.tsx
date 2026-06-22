import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Settings } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function SettingsScreen() {
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
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name={ChevronLeft} color={textColor} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Icon name={Settings} color={textColor} size={64} style={styles.icon} />
        <Text variant="heading" style={[styles.title, { color: textColor }]}>
          Settings
        </Text>
        <Text style={[styles.description, { color: mutedTextColor }]}>
          Configure your preferences, account settings, and application controls here.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button variant="default" size="lg" onPress={handleBack} style={styles.ctaButton}>
          <Text style={styles.ctaText}>Go Back</Text>
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
    alignItems: 'center',
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
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#71717a',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    maxWidth: 350,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
