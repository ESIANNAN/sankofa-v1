import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { Mail, Lock, ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function LoginScreen() {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  const mutedTextColor = useColor('textMuted');
  const tintColor = useColor('primary');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate API call and navigate to home tabs
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/(home)');
    }, 1200);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Top Header Row with Back Button */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name={ChevronLeft} color={textColor} size={24} />
          </TouchableOpacity>
        </View>

        {/* Form Content Section */}
        <View style={styles.content}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Welcome Back
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Log in to continue your language learning journey.
          </Text>

          {/* Input Fields */}
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              icon={Mail}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              variant="outline"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              icon={Lock}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              variant="outline"
            />
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            variant="default"
            size="lg"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          >
            Log In
          </Button>

          <TouchableOpacity onPress={handleBack}>
            <Text variant="caption" style={styles.cancelLink}>
              Cancel
            </Text>
          </TouchableOpacity>
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
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  loginButton: {
    width: '100%',
    height: 56, // Extended height to match welcome button
  },
  cancelLink: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.7,
    paddingVertical: 8,
  },
});
