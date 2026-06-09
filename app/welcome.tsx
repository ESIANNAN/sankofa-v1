import React from 'react';
import { StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';

export default function WelcomeScreen() {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  const mutedTextColor = useColor('textMuted');
  const tintColor = useColor('primary');

  const handleGetStarted = () => {
    // Navigate to the main application tabs
    router.replace('/(tabs)/(home)');
  };

  const handleLogin = () => {
    // Navigate to the login screen
    router.push('/login' as any);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Centered Left-Aligned Content Section */}
        <View style={styles.middleSection}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Akwaaba
          </Text>
          <Text variant="subtitle" style={[styles.welcomeText, { color: textColor }]}>
            Welcome to Sankofa
          </Text>
          <Text variant="body" style={[styles.description, { color: mutedTextColor }]}>
            Rediscover Ghanaian languages and culture through learning.
          </Text>
        </View>

        {/* Action Button Section */}
        <View style={styles.footer}>
          <Button
            variant="default"
            size="lg"
            onPress={handleGetStarted}
            style={styles.ctaButton}
          >
            Begin your Journey
          </Button>

          <Text
            variant="link"
            style={[styles.loginLink, { color: tintColor }]}
            onPress={handleLogin}
          >
            Log In
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24, // Extended horizontally by reducing side padding
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100%',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'left',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 16,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    maxWidth: 300,
    lineHeight: 24,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  ctaButton: {
    width: '140%',
    height: 67,

  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    paddingVertical: 8,
  },
});
