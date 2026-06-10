import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { InputOTP, InputOTPRef } from '@/components/ui/input-otp';

export default function VerifyCodeScreen() {
  const params = useLocalSearchParams();
  const email = (params.email as string) || 'your email';

  const backgroundColor = '#FFFFFF'; // Clean white background as requested
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const otpRef = useRef<InputOTPRef>(null);

  // Focus on OTP input on screen load
  useEffect(() => {
    setTimeout(() => {
      otpRef.current?.focus();
    }, 100);
  }, []);

  // Timer countdown implementation for resend code cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleVerify = (codeValue = code) => {
    setError('');

    if (codeValue.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Validate code (simulated code is '123456')
      if (codeValue === '123456') {
        router.push({
          pathname: '/reset-password',
          params: { email },
        });
      } else {
        setError('Invalid verification code.');
        otpRef.current?.clear();
      }
    }, 1200);
  };

  const handleResendCode = () => {
    if (timer > 0) return;

    setTimer(30);
    setError('');
    otpRef.current?.clear();
    alert('Verification code has been resent to ' + email + '.');
  };

  const handleBack = () => {
    router.replace('/forgot-password' as any);
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
          <Text style={styles.topLabel}>FORGOT PASSWORD</Text>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name={ChevronLeft} color={textColor} size={24} />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Check your email
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Enter the 6-digit verification code sent to {email}.
          </Text>

          {/* Form Section */}
          <View style={styles.form}>
            <InputOTP
              ref={otpRef}
              length={6}
              value={code}
              onChangeText={setCode}
              error={error}
              slotStyle={styles.otpSlot}
              containerStyle={styles.otpContainer}
              onComplete={(val) => handleVerify(val)}
            />

            <Button
              variant="default"
              size="lg"
              onPress={() => handleVerify()}
              loading={loading}
              style={styles.continueButton}
              textStyle={styles.continueButtonText}
            >
              Continue
            </Button>

            {/* Resend Link Section */}
            <View style={styles.resendSection}>
              <Text style={{ color: mutedTextColor, fontSize: 15 }}>
                {"Didn't"} receive a code?{' '}
              </Text>
              {timer > 0 ? (
                <Text style={styles.resendLinkDisabled}>
                  Resend Code ({timer}s)
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
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
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#71717a',
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
    gap: 24,
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  otpSlot: {
    width: 48,
    height: 54,
    borderRadius: 15, // Rounded code boxes (radius 15) as requested
    borderWidth: 1,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    width: 350,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  resendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  resendLink: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    color: '#a1a1aa',
    fontWeight: '600',
    fontSize: 15,
  },
});
