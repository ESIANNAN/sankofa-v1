import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { auth } from '@/services/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { GameButton } from '@/components/ui/game-button';

export default function SignupScreen() {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  const mutedTextColor = useColor('textMuted');
  const tintColor = useColor('primary');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSignup = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!fullName.trim()) {
      setNameError('Full Name is required');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email Address is required');
      isValid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName.trim(),
        });
      }

      await sendEmailVerification(userCredential.user);

      try {
        await AsyncStorage.setItem('user_name', fullName.trim());
        await AsyncStorage.setItem('user_email', email.trim());
      } catch (e) {
        console.warn('Error saving user name:', e);
      }

      router.replace('/confirmation' as any);
    } catch (error: any) {
      console.warn('Firebase Registration Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('This email is already in use');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Password is too weak');
      } else {
        Alert.alert('Registration Failed', error.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.replace('/login' as any);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>

        {/* Content Area */}
        <View style={styles.content}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Create Account
          </Text>

          {/* Form Fields */}
          <View style={styles.form}>
            <Input
              placeholder="Full Name"
              icon={User}
              value={fullName}
              onChangeText={setFullName}
              error={nameError}
              autoCapitalize="words"
              autoCorrect={false}
              variant="outline"
              style={{ borderRadius: 30 }}
            />

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
              style={{ borderRadius: 30 }}
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
              style={{ borderRadius: 30 }}
              rightComponent={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.toggleButton}
                >
                  <Icon name={showPassword ? EyeOff : Eye} color={mutedTextColor} size={20} />
                </TouchableOpacity>
              }
            />
          </View>
        </View>

        {/* Actions Footer */}
        <View style={styles.footer}>
          <GameButton
            onPress={handleSignup}
            loading={loading}
            label="Continue"
            color="#00d5ff"
            borderRadius={30}
          />

          <View style={styles.loginPrompt}>
            <Text variant="caption" style={{ color: '#666666' }}>
              Already have an account?{' '}
            </Text>
            <Text
              variant="link"
              style={[styles.loginLink, { color: '#00d5ff' }]}
              onPress={handleLoginRedirect}
            >
              Login
            </Text>
          </View>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'left',
  },
  form: {
    width: '100%',
    gap: 16,
  },
  toggleButton: {
    padding: 8,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});