import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';

interface LanguageOption {
  id: string;
  name: string;
  dialect?: string;
  region: string;
  flagEmoji: string;
}

const ONBOARDING_LANGUAGES: LanguageOption[] = [
  { id: 'asante_twi', name: 'Asante Twi', dialect: 'Akan', region: 'Ashanti & Central Regions', flagEmoji: '🇬🇭' },
  { id: 'fante', name: 'Fante', dialect: 'Akan', region: 'Central & Western Regions', flagEmoji: '🇬🇭' },
  { id: 'ga', name: 'Ga', region: 'Greater Accra Region', flagEmoji: '🇬🇭' },
  { id: 'ewe', name: 'Ewe', region: 'Volta Region', flagEmoji: '🇬🇭' },
];

export default function LanguageSelectionScreen() {
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
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Top Header Section */}
        <View style={styles.header}>
          <Text style={styles.logoLabel}>Language Selection</Text>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/learning-hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Question & Subtitle Section */}
        <View style={styles.questionSection}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Which language will you learn?
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Start with one language. You can always add more later.
          </Text>
        </View>

        {/* Language Options Grid */}
        <View style={styles.languagesContainer}>
          {ONBOARDING_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => setSelectedLanguage(lang.id)}
                activeOpacity={0.8}
                style={[
                  styles.languageCard,
                  isSelected ? styles.selectedCard : styles.unselectedCard,
                ]}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.flagIcon}>{lang.flagEmoji}</Text>
                  <View>
                    <Text
                      style={[
                        styles.languageName,
                        { color: textColor, fontWeight: isSelected ? '700' : '600' },
                      ]}
                    >
                      {lang.name}
                    </Text>
                    <Text style={styles.languageRegion}>{lang.region}</Text>
                  </View>
                </View>
                {lang.dialect && (
                  <View style={styles.dialectBadge}>
                    <Text style={styles.dialectText}>{lang.dialect}</Text>
                  </View>
                )}
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
            style={[
              styles.ctaButton,
              !selectedLanguage && { opacity: 0.5 },
            ]}
            textStyle={styles.ctaButtonText}
            disabled={!selectedLanguage || loading}
          >
            Continue
          </Button>
        </View>

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
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#71717a',
    textTransform: 'uppercase',
  },
  heroContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  heroImage: {
    width: 320,
    height: 180,
  },
  questionSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  languagesContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  languageCard: {
    width: 350,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  unselectedCard: {
    borderColor: '#E4E4E7',
  },
  selectedCard: {
    borderColor: '#000000',
    backgroundColor: '#FAF9F6',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagIcon: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
  },
  languageRegion: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  dialectBadge: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dialectText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3a3a3c',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  ctaButton: {
    width: 350,
    height: 55,
    borderRadius: 30,
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
});
