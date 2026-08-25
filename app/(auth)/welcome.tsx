import React, { useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Platform, Animated, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

export default function WelcomeScreen() {
  const backgroundColor = '#FFF7EB';
  const textColor = '#402a21';
  const mutedTextColor = '#5c544dff';
  const tintColor = '#70e000';

  //  Button animations 
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(pressAnim, { toValue: 0.96, useNativeDriver: true, speed: 20 }).start();
  const handlePressOut = () =>
    Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

  const handleGetStarted = () => router.replace('/intro-onboarding');
  const handleLogin = () => router.replace('/login');

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>

        <View style={styles.middleSection}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Akwaaba,
          </Text>
          <Text variant="subtitle" style={[styles.welcomeText, { color: textColor }]}>
            Sankofa
          </Text>
          <Text variant="body" style={[styles.description, { color: mutedTextColor }]}>
            Rediscover Ghanaian languages and culture through learning.
          </Text>
        </View>

        <View style={styles.footer}>

          {/* ── GAMIFIED BUTTON ── */}
          <Animated.View
            style={[styles.buttonOuter, { transform: [{ scale: pulseAnim }] }]}
          >
            {/* Glow ring */}
            <Animated.View style={[styles.glowRing, { opacity: glowAnim }]} />

            <Pressable onPress={handleGetStarted} onPressIn={handlePressIn} onPressOut={handlePressOut}>
              <Animated.View style={[styles.ctaButton, { transform: [{ scale: pressAnim }] }]}>
                <View style={styles.buttonShine} />
                <Text style={styles.ctaText}>Begin your Journey</Text>
              </Animated.View>
            </Pressable>
          </Animated.View>

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
  scrollContainer: { flexGrow: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 24,
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
    marginBottom: 4,
    textAlign: 'left',
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 4,
    lineHeight: 28,
  },

  description: {
    fontSize: 16,
    textAlign: 'left',
    maxWidth: 350,
    lineHeight: 24,
  },

  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },

  buttonOuter: {
    width: '100%',
    position: 'relative',
  },

  glowRing: {
    position: 'absolute',
    top: -4, left: -4, right: -4, bottom: -4,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#70e000',
    shadowColor: '#70e000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 10,
  },

  
  ctaButton: {
    width: '100%',
    height: 67,
    backgroundColor: '#8AFF8A',
    borderRadius: 30,

    // border weight
    borderWidth: 3,
    borderColor: '#4aaa00',
    borderBottomWidth: 5,
    borderBottomColor: '#00D100',

    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',

    shadowColor: '#70e000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },

  //  Shine strip 
  buttonShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 26,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  // Label
  ctaText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a3d00',
    letterSpacing: 0.2,
  },

  loginLink: {
    fontSize: 18,
    fontWeight: '700',
    textDecorationLine: 'none',
    paddingVertical: 15,
  },
});