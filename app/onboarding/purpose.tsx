
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

import { OnboardingLayout } from '@/components/ui/onboarding-layout';
import { OnboardingHeader } from '@/components/ui/onboarding-header';
import { OnboardingTitle } from '@/components/ui/onboarding-title';
import { OnboardingFooter } from '@/components/ui/onboarding-footer';

interface PurposeOption {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
}

const ONBOARDING_PURPOSES: PurposeOption[] = [
  {
    id: 'travel',
    title: 'Travel',
    description: 'Communicate confidently while travelling',
    iconEmoji: '✈️',
  },
  {
    id: 'work',
    title: 'Work',
    description: 'Use language professionally',
    iconEmoji: '💼',
  },
  {
    id: 'school',
    title: 'School',
    description: 'Support academic learning',
    iconEmoji: '🎓',
  },
  {
    id: 'friends_family',
    title: 'Friends & Family',
    description: 'Connect with loved ones',
    iconEmoji: '❤️',
  },
];

export default function PurposeSelectionScreen() {
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedPurpose) {
      alert('Please select a learning goal to continue.');
      return;
    }

    setLoading(true);

    try {
      await AsyncStorage.setItem(
        'user_learning_purpose',
        selectedPurpose
      );

      router.push('/onboarding/daily-goal' as any);
    } catch (error) {
      console.warn(
        'Error saving learning purpose selection:',
        error
      );

      router.push('/onboarding/daily-goal' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout>

      {/* Header + Progress */}
      <OnboardingHeader
        title="Purpose"
        step={2}
        total={5}
      />

      {/* Question */}
      <OnboardingTitle
        heading={"What's your learning goal?"}
        subtitle="Choose the reason that best matches your motivation."
      />

      {/* Purpose Options */}
      <View style={styles.optionsContainer}>
        {ONBOARDING_PURPOSES.map((option) => {
          const isSelected = selectedPurpose === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedPurpose(option.id)}
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                isSelected
                  ? styles.selectedCard
                  : styles.unselectedCard,
              ]}
            >
              <Text style={styles.cardIcon}>
                {option.iconEmoji}
              </Text>

              <View style={styles.cardText}>
                <Text
                  style={[
                    styles.optionTitle,
                    {
                      color: isSelected ? '#16A34A' : '#000000',
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {option.title}
                </Text>

                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>

              {isSelected && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <OnboardingFooter
        onPress={handleContinue}
        loading={loading}
        disabled={!selectedPurpose || loading}
      />

    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    width: '100%',
    gap: 10,
  },

  optionCard: {
    width: '100%',
    minHeight: 76,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  unselectedCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E4E7',
  },

  selectedCard: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
    borderWidth: 2,
  },

  cardIcon: {
    fontSize: 27,
    width: 45,
    textAlign: 'center',
  },

  cardText: {
    flex: 1,
    marginLeft: 10,
  },

  optionTitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 2,
  },

  optionDescription: {
    fontSize: 12,
    color: '#71717a',
    lineHeight: 16,
  },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  checkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

