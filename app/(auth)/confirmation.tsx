import React, { useState } from 'react';
import { StyleSheet, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { CheckCircle2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { auth } from '@/services/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { GameButton } from '@/components/ui/game-button'; // 👈 added

export default function ConfirmationScreen() {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  const mutedTextColor = useColor('textMuted');
  const greenColor = useColor('green');

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerifiedCheck = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('No active session', 'Please sign in or create an account.');
      router.replace('/welcome' as any);
      return;
    }

    setVerifying(true);
    try {
      await user.reload();
      if (auth.currentUser?.emailVerified) {
        router.replace('/onboarding' as any);
      } else {
        Alert.alert('Not Verified', "Your email hasn't been verified yet.");
      }
    } catch (err: any) {
      console.warn('Verification check error:', err);
      Alert.alert('Verification Check Failed', err.message || 'Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No active session found. Please register again.');
      return;
    }

    setResending(true);
    try {
      await sendEmailVerification(user);
      Alert.alert('Email Sent', 'A verification link has been resent to your email.');
    } catch (err: any) {
      console.warn('Resend verification error:', err);
      Alert.alert('Resend Failed', err.message || 'Please wait a moment before trying again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={[styles.iconContainer, { backgroundColor: greenColor + '15' }]}>
          <Icon name={CheckCircle2} color={greenColor} size={64} />
        </View>

        <Text variant="heading" style={[styles.title, { color: textColor }]}>
          Verify Your Email
        </Text>
        <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
          We've sent a verification link to your email. Please verify your email before continuing.
        </Text>
      </View>

      {/* Action Footer */}
      <View style={styles.footer}>

        {/*  I've Verified My Email */}
        <GameButton
          onPress={handleVerifiedCheck}
          loading={verifying}
          label="I've Verified My Email"
          color="#00d5ff"
          borderRadius={30}
        />

        {/* Resend Email */}
        <GameButton
          onPress={handleResendEmail}
          loading={resending}
          label="Resend Email"
          color="#70e000"
          borderRadius={30}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },

});