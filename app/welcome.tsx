import React from 'react';
import { StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { ArrowRight, BookOpen, Volume2, Globe } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function WelcomeScreen() {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  const mutedTextColor = useColor('textMuted');
  const tintColor = useColor('primary');

  const handleGetStarted = () => {
    // Navigate to the main application tabs
    router.replace('/(tabs)/(home)');
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/Sankofa-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Sankofa
          </Text>
          <Text variant="caption" style={[styles.tagline, { color: mutedTextColor }]}>
            Learn African languages. Reconnect with culture.
          </Text>
        </View>

        {/* Features Content */}
        <View style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.featureRow}>
              <View style={[styles.iconWrapper, { backgroundColor: useColor('muted') }]}>
                <Icon name={Globe} color={tintColor} size={22} />
              </View>
              <View style={styles.featureText}>
                <Text variant="subtitle" style={styles.featureTitle}>
                  Heritage Languages
                </Text>
                <Text variant="caption" style={styles.featureDesc}>
                  Dive into native instruction for Twi, Yoruba, Ga, and more.
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={[styles.iconWrapper, { backgroundColor: useColor('muted') }]}>
                <Icon name={Volume2} color={tintColor} size={22} />
              </View>
              <View style={styles.featureText}>
                <Text variant="subtitle" style={styles.featureTitle}>
                  Native Pronunciations
                </Text>
                <Text variant="caption" style={styles.featureDesc}>
                  Hear authentic audio recorded by native speakers.
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={[styles.iconWrapper, { backgroundColor: useColor('muted') }]}>
                <Icon name={BookOpen} color={tintColor} size={22} />
              </View>
              <View style={styles.featureText}>
                <Text variant="subtitle" style={styles.featureTitle}>
                  Cultural Insights
                </Text>
                <Text variant="caption" style={styles.featureDesc}>
                  Explore idiomatic expressions, history, and traditions.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Action Button Section */}
        <View style={styles.footer}>
          <Button
            variant="default"
            size="lg"
            icon={ArrowRight}
            onPress={handleGetStarted}
            style={styles.ctaButton}
          >
            Get Started
          </Button>
          
          <Text variant="caption" style={styles.footerNote}>
            By continuing, you agree to connect, discover, and learn.
          </Text>
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
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  content: {
    width: '100%',
    marginVertical: 32,
  },
  card: {
    gap: 20,
    paddingVertical: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 18,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  ctaButton: {
    width: '100%',
  },
  footerNote: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.5,
  },
});
