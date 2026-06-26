import React, { useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { auth } from '@/services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  const mutedTextColor = useColor('textMuted');
  // Reanimated shared values for fade-in and slight scale animation
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const textOpacity = useSharedValue(0);
  useEffect(() => {
    // Logo fade-in and scale animation
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withTiming(1, { duration: 1200 });
    // Text elements fade-in slightly after the logo
    textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // Listen for Firebase authentication state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // Unsubscribe immediately so this only runs on initial load
      unsubscribe();

      try {
        if (!user) {
          router.replace('/welcome' as any);
        } else {
          // Reload the user to get the latest emailVerified status
          try {
            await user.reload();
          } catch (reloadErr) {
            console.warn('Failed to reload user on startup:', reloadErr);
          }

          const currentUser = auth.currentUser;
          if (currentUser && currentUser.emailVerified) {
            const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
            if (onboardingCompleted === 'true') {
              router.replace('/home' as any);
            } else {
              router.replace('/onboarding' as any);
            }
          } else {
            router.replace('/confirmation' as any);
          }
        }
      } catch (err) {
        console.error('Error during startup routing:', err);
        router.replace('/welcome' as any);
      }
    });

    return () => unsubscribe();
  }, []);
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image
          source={require('@/assets/images/Sankofa-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 140,
    height: 140,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
});