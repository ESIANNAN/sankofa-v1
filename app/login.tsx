import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import Svg, { Path } from 'react-native-svg';
import { auth } from '@/services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom SVG Google Icon for premium brand representation
const GoogleIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

// Custom SVG Apple Icon
const AppleIcon = ({ color = '#000000' }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z" />
  </Svg>
);

export default function LoginScreen() {
  const backgroundColor = '#FFFFFF'; // Clean white background as requested
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  // Field error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (user.emailVerified) {
        // Fetch onboarding completed status
        const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
        if (onboardingCompleted === 'true') {
          router.replace('/home' as any);
        } else {
          router.replace('/onboarding' as any);
        }
      } else {
        // Redirect back to the Verification Screen
        router.replace('/confirmation' as any);
        Alert.alert(
          'Email Verification Required',
          'Please verify your email address before accessing the application.'
        );
      }
    } catch (error: any) {
      console.warn('Firebase Login Error:', error);
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        setEmailError('Invalid email or password');
        setPasswordError('Invalid email or password');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address');
      } else {
        Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.replace('/welcome' as any); // Navigate back to Welcome screen as per spec
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password' as any); // Navigate to Forgot Password Screen as per spec
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Feature Unavailable', 'Google Sign-In is not configured yet.');
  };

  const handleAppleSignIn = () => {
    Alert.alert('Feature Unavailable', 'Apple Sign-In is not configured yet.');
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.topLabel}>Sankofa</Text>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name={ChevronLeft} color={textColor} size={24} />
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Input
              placeholder="Email"
              icon={Mail}
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              variant="outline"
              style={styles.inputField}
            />

            <Input
              placeholder="Password"
              icon={Lock}
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              variant="outline"
              style={styles.inputField}
              rightComponent={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.toggleButton}
                >
                  <Icon
                    name={showPassword ? EyeOff : Eye}
                    color={mutedTextColor}
                    size={20}
                  />
                </TouchableOpacity>
              }
            />
          </View>

          <Button
            variant="default"
            size="lg"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          >
            Log In
          </Button>

          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Social Login Section */}
        <View style={styles.socialSection}>
          <Button
            variant="outline"
            onPress={handleGoogleSignIn}
            loading={googleLoading}
            style={styles.googleButton}
          >
            <View style={styles.socialButtonContent}>
              <GoogleIcon />
              <Text style={styles.socialButtonText}>Sign In with Google</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            onPress={handleAppleSignIn}
            loading={appleLoading}
            style={styles.appleButton}
          >
            <View style={styles.socialButtonContent}>
              <AppleIcon color="#000000" />
              <Text style={styles.socialButtonText}>Sign In with Apple</Text>
            </View>
          </Button>
        </View>

        {/* Bottom spacer for keyboard avoidance */}
        <AvoidKeyboard offset={20} />
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100%',
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  topLabel: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#000000',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  formSection: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  inputGroup: {
    gap: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  inputField: {
    width: 350,
    height: 60,
    borderRadius: 15,
    borderColor: '#E4E4E7',
    borderWidth: 1,
  },
  toggleButton: {
    padding: 8,
  },
  loginButton: {
    width: 350,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '600', // Semi-bold
    fontSize: 16,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    marginTop: 16,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: '#000000',
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: '500',
    textAlign: 'center',
  },
  socialSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 30,
    paddingBottom: 10,
  },
  googleButton: {
    width: 350,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButton: {
    width: 350,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  socialButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
});
