import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';

export default function ResetPasswordScreen() {
  const backgroundColor = '#FFFFFF'; // Clean white background as requested
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Field error states
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleResetPassword = () => {
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    // Simulate password updates
    setTimeout(() => {
      setLoading(false);
      alert('Your password has been successfully updated!');
      router.replace('/login' as any);
    }, 1500);
  };

  const handleBack = () => {
    router.replace('/verify-code' as any);
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
            New Password
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Please enter your new password.
          </Text>

          {/* Form Section */}
          <View style={styles.form}>
            <Input
              placeholder="New Password"
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

            <Input
              placeholder="Confirm Password"
              icon={Lock}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              variant="outline"
              style={styles.inputField}
              rightComponent={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.toggleButton}
                >
                  <Icon
                    name={showConfirmPassword ? EyeOff : Eye}
                    color={mutedTextColor}
                    size={20}
                  />
                </TouchableOpacity>
              }
            />

            <Button
              variant="default"
              size="lg"
              onPress={handleResetPassword}
              loading={loading}
              style={styles.resetButton}
              textStyle={styles.resetButtonText}
            >
              Update Password
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
    gap: 20,
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
