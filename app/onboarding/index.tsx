import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LanguageOption {
  id: string;
  name: string;
  description: string;
  flagEmoji: string;
}

const ONBOARDING_LANGUAGES: LanguageOption[] = [
  { id: 'asante_twi', name: 'Asante Twi', description: 'Most widely spoken Ghanaian language', flagEmoji: '🇬🇭' },
  { id: 'fante', name: 'Fante', description: 'Popular in the Central Region', flagEmoji: '🇬🇭' },
  { id: 'ga', name: 'Ga', description: 'Language of Greater Accra', flagEmoji: '🇬🇭' },
  { id: 'ewe', name: 'Ewe', description: 'Widely spoken in the Volta Region', flagEmoji: '🇬🇭' },
];

export default function LanguageSelectionScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF'; // Clean white background
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedLanguage) {
      alert('Please select a language to continue.');
      return;
    }

    setLoading(true);
    try {
      // Save selected language locally in AsyncStorage
      await AsyncStorage.setItem('user_selected_language', selectedLanguage);
      
      // Navigate to the Purpose Selection Screen
      router.push('/onboarding/purpose' as any);
    } catch (error) {
      console.warn('Error saving language selection:', error);
      // Fallback transition
      router.push('/onboarding/purpose' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      {/* Top Section: Header & Progress */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.logoLabel}>Language Selection</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '20%' }]} />
          </View>
          <Text style={[styles.progressText, { color: mutedTextColor }]}>Step 1 of 5</Text>
        </View>
      </View>

      {/* Middle Section: Hero & Question */}
      <View style={styles.middleSection}>
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/learning-hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.questionSection}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Which language will you learn?
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Start with one language. You can always add more later.
          </Text>
        </View>
      </View>

      {/* Language Options Grid */}
      <View style={styles.gridContainer}>
        {ONBOARDING_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <TouchableOpacity
              key={lang.id}
              onPress={() => setSelectedLanguage(lang.id)}
              activeOpacity={0.8}
              style={[
                styles.gridCard,
                isSelected ? styles.selectedCard : styles.unselectedCard,
              ]}
            >
              <Text style={styles.cardIcon}>{lang.flagEmoji}</Text>
              <Text
                style={[
                  styles.languageName,
                  { color: textColor, fontWeight: isSelected ? '700' : '600' },
                ]}
              >
                {lang.name}
              </Text>
              <Text style={styles.languageDescription}>{lang.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button
          variant="default"
          size="lg"
          onPress={handleContinue}
          loading={loading}
          style={
            !selectedLanguage
              ? [styles.ctaButton, { opacity: 0.5 }]
              : [styles.ctaButton]
          }
          textStyle={styles.ctaButtonText}
          disabled={!selectedLanguage || loading}
        >
          Continue
        </Button>
      </View>

      <AvoidKeyboard offset={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  logoLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#71717a',
    textTransform: 'uppercase',
  },
  middleSection: {
    width: '100%',
    alignItems: 'center',
    flexShrink: 1,
  },
  heroContainer: {
    width: '100%',
    height: 120,
    maxHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    flexShrink: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    maxWidth: 280,
  },
  questionSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
  gridContainer: {
    width: '100%',
    maxWidth: 350,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginVertical: 8,
  },
  gridCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  unselectedCard: {
    borderColor: '#E4E4E7',
  },
  selectedCard: {
    borderColor: '#000000',
    backgroundColor: '#FAF9F6',
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  languageName: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 11,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 14,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  ctaButton: {
    width: '100%',
    maxWidth: 350,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    gap: 6,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E4E4E7',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
