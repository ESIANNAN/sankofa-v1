import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { CheckCircle2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function ConfirmationScreen() {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  const mutedTextColor = useColor('textMuted');
  const greenColor = useColor('green');

  const handleContinue = () => {
    // Redirect to the Onboarding screen
    router.replace('/onboarding' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Centered Content Section */}
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={[styles.iconContainer, { backgroundColor: greenColor + '15' }]}>
          <Icon name={CheckCircle2} color={greenColor} size={64} />
        </View>

        <Text variant="heading" style={[styles.title, { color: textColor }]}>
          Verify Your Email
        </Text>
        <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
          {"We've"} sent a verification link to your email address. Please click the link in your email to verify and activate your account.
        </Text>
      </View>

      {/* Action Footer */}
      <View style={styles.footer}>
        <Button
          variant="default"
          size="lg"
          onPress={handleContinue}
          style={styles.continueButton}
        >
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Continue
          </Text>
        </Button>
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
  },
  continueButton: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
