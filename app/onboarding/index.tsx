import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingLayout } from '@/components/ui/onboarding-layout';
import { OnboardingHeader } from '@/components/ui/onboarding-header';
import { OnboardingTitle } from '@/components/ui/onboarding-title';
import { OnboardingFooter } from '@/components/ui/onboarding-footer';

interface LanguageOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  lightColor: string;
  borderColor: string;
}

const ONBOARDING_LANGUAGES: LanguageOption[] = [
  {
    id: 'asante_twi',
    name: 'Asante Twi',
    description: 'Most widely spoken',
    emoji: '🪘',
    color: '#16a34a',
    lightColor: '#dcfce7',
    borderColor: '#86efac',
  },
  {
    id: 'fante',
    name: 'Fante',
    description: 'Central Region',
    emoji: '⚓',
    color: '#0077b6',
    lightColor: '#e0f2fe',
    borderColor: '#7dd3fc',
  },
  {
    id: 'ga',
    name: 'Ga',
    description: 'Greater Accra',
    emoji: '🏙️',
    color: '#6d28d9',
    lightColor: '#ede9fe',
    borderColor: '#c4b5fd',
  },
  {
    id: 'ewe',
    name: 'Ewe',
    description: 'Volta Region',
    emoji: '🎋',
    color: '#b45309',
    lightColor: '#fef3c7',
    borderColor: '#fcd34d',
  },
];

export default function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Card scale animations ──────────────────
  const scaleAnims = useRef(
    ONBOARDING_LANGUAGES.reduce((acc, lang) => {
      acc[lang.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  // ── Entrance animations ────────────────────
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const cardsSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardsAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(cardsSlide, { toValue: 0, speed: 12, bounciness: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedLanguage(id);
    Animated.sequence([
      Animated.spring(scaleAnims[id], { toValue: 1.06, useNativeDriver: true, speed: 20 }),
      Animated.spring(scaleAnims[id], { toValue: 1, useNativeDriver: true, speed: 14 }),
    ]).start();
  };

  const handleContinue = async () => {
    if (!selectedLanguage) {
      alert('Please select a language to continue.');
      return;
    }
    setLoading(true);
    try {
      await AsyncStorage.setItem('user_selected_language', selectedLanguage);
      router.push('/onboarding/purpose' as any);
    } catch (error) {
      console.warn('Error saving language selection:', error);
      router.push('/onboarding/purpose' as any);
    } finally {
      setLoading(false);
    }
  };

  const selectedLang = ONBOARDING_LANGUAGES.find(l => l.id === selectedLanguage);

  return (
    <OnboardingLayout>

      {/* ── Header + progress bar ── */}
      <Animated.View style={{ width: '100%', opacity: headerAnim }}>
        <OnboardingHeader
          title="Language Selection"
          step={1}
          total={5}
        />
      </Animated.View>

      {/* ── Title ── */}
      <Animated.View style={{ width: '100%', opacity: headerAnim }}>
        <OnboardingTitle
          heading={"Which language\nwill you learn?"}
          subtitle="Start with one — you can always add more later."
        />
      </Animated.View>

      {/* ── Language Cards ── */}
      <Animated.View
        style={[
          styles.gridContainer,
          {
            opacity: cardsAnim,
            transform: [{ translateY: cardsSlide }],
          },
        ]}
      >
        {ONBOARDING_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <Animated.View
              key={lang.id}
              style={{ transform: [{ scale: scaleAnims[lang.id] }], width: '48%' }}
            >
              <TouchableOpacity
                onPress={() => handleSelect(lang.id)}
                activeOpacity={0.85}
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: isSelected ? lang.lightColor : '#FFFFFF',
                    borderColor: isSelected ? lang.color : '#E4E4E7',
                    borderWidth: isSelected ? 2.5 : 1.5,
                    shadowColor: isSelected ? lang.color : '#000',
                    shadowOpacity: isSelected ? 0.2 : 0.05,
                    shadowRadius: isSelected ? 12 : 4,
                    elevation: isSelected ? 6 : 2,
                  },
                ]}
              >
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: lang.color }]}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
                <Text style={styles.cardEmoji}>{lang.emoji}</Text>
                <Text style={[
                  styles.languageName,
                  {
                    color: isSelected ? lang.color : '#111',
                    fontWeight: isSelected ? '800' : '600',
                  },
                ]}>
                  {lang.name}
                </Text>
                <Text style={styles.languageDescription}>
                  {lang.description}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.View>

      {/* ── Selected hint ── */}
      {selectedLang && (
        <View style={[
          styles.selectedHint,
          {
            borderColor: selectedLang.borderColor,
            backgroundColor: selectedLang.lightColor,
          },
        ]}>
          <Text style={[styles.selectedHintText, { color: selectedLang.color }]}>
            {selectedLang.emoji} Great choice! You're learning {selectedLang.name}
          </Text>
        </View>
      )}

      {/* ── Footer ── */}
      <OnboardingFooter
        onPress={handleContinue}
        loading={loading}
        disabled={!selectedLanguage || loading}
      />

    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
  },
  checkBadge: {
    position: 'absolute',
    top: 10, right: 10,
    width: 22, height: 22,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 12,
    fontWeight: '800',
    color: 'white',
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 8,
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
  selectedHint: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
  },
  selectedHintText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});