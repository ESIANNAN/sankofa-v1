import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Mail, ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';

export default function ForgotPasswordScreen() {
  const backgroundColor = '#FFFFFF'; // Clean white background as requested
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSendCode = () => {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Simulate code generation and sending
    setTimeout(() => {
      setLoading(false);
      // Navigate to Verification Code screen with email parameter
      router.push({
        pathname: '/verify-code',
        params: { email: email.trim() },
      });
    }, 1200);
  };

  const handleBack = () => {
    router.replace('/login' as any);
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

        {/* Content Section */}
        <View style={styles.content}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Forgot Password
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Enter your email address and {"we'll"} send you a 6-digit code to reset your password.
          </Text>

          {/* Form Section */}
          <View style={styles.form}>
            <Input
              placeholder="Email"
              icon={Mail}
              value={email}
              onChangeText={setEmail}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              variant="outline"
              style={styles.inputField}
            />

            <Button
              variant="default"
              size="lg"
              onPress={handleSendCode}
              loading={loading}
              style={styles.resetButton}
              textStyle={styles.resetButtonText}
            >
              Send Code
            </Button>
          </View>
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
    marginBottom: 40,
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
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
    marginBottom: 32,
  },
  form: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  inputField: {
    width: 350,
    height: 60,
    borderRadius: 15,
    borderColor: '#E4E4E7',
    borderWidth: 1,
  },
  resetButton: {
    width: 350,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
