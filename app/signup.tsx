import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { Mail, Lock, User, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

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

  // Field error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSignup = async () => {
    // Reset errors
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
    // Simulate signup API call and navigate to Confirmation Screen
    setTimeout(() => {
      setLoading(false);
      router.replace('/confirmation' as any);
    }, 1200);
  };

  const handleBack = () => {
    router.back();
  };

  const handleLoginRedirect = () => {
    router.push('/login' as any);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Top Navigation Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name={ChevronLeft} color={textColor} size={24} />
          </TouchableOpacity>
        </View>

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
              rightComponent={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
                  <Icon name={showPassword ? EyeOff : Eye} color={mutedTextColor} size={20} />
                </TouchableOpacity>
              }
            />
          </View>
        </View>

        {/* Actions Footer */}
        <View style={styles.footer}>
          <Button
            variant="default"
            size="lg"
            onPress={handleSignup}
            loading={loading}
            style={styles.ctaButton}
          >
            <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>
              Continue
            </Text>
          </Button>

          <View style={styles.loginPrompt}>
            <Text variant="caption" style={{ color: mutedTextColor }}>
              Already have an account?{' '}
            </Text>
            <Text
              variant="link"
              style={[styles.loginLink, { color: tintColor }]}
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
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'left',
    maxWidth: 280,
    lineHeight: 22,
    marginBottom: 32,
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
  ctaButton: {
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
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
