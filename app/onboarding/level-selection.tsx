
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

interface LevelOption {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
}

const ONBOARDING_LEVELS: LevelOption[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Basic greetings and vocabulary',
    iconEmoji: '🌱',
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Everyday situations and short conversations',
    iconEmoji: '🧭',
  },
  {
    id: 'communicator',
    title: 'Communicator',
    description: 'Confident communication and sentence building',
    iconEmoji: '💬',
  },
  {
    id: 'full_fluency',
    title: 'Full Fluency',
    description: 'Conversations and cultural expression',
    iconEmoji: '🎓',
  },
];

export default function LevelSelectionScreen() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedLevel) {
      alert('Please select your experience level to continue.');
      return;
    }

    setLoading(true);

    try {
      await AsyncStorage.setItem(
        'user_experience_level',
        selectedLevel
      );

      router.push('/onboarding/summary' as any);
    } catch (error) {
      console.warn(
        'Error saving experience level selection:',
        error
      );

      router.push('/onboarding/summary' as any);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <OnboardingLayout>

      {/* Header + Progress */}
      <OnboardingHeader
        title="Level Selection"
        step={4}
        total={5}
        onBack={handleBack}
      />

      {/* Question */}
      <OnboardingTitle
        heading={"What's your current level?"}
        subtitle="This helps us personalize your learning journey."
      />

      {/* Level Options */}
      <View style={styles.gridContainer}>
        {ONBOARDING_LEVELS.map((option) => {
          const isSelected = selectedLevel === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedLevel(option.id)}
              activeOpacity={0.8}
              style={[
                styles.gridCard,
                isSelected
                  ? styles.selectedCard
                  : styles.unselectedCard,
              ]}
            >
              <Text style={styles.cardIcon}>
                {option.iconEmoji}
              </Text>

              <Text
                style={[
                  styles.optionTitle,
                  {
                    color: isSelected
                      ? '#16A34A'
                      : '#000000',
                    fontWeight: isSelected
                      ? '700'
                      : '600',
                  },
                ]}
              >
                {option.title}
              </Text>

              <Text style={styles.optionDescription}>
                {option.description}
              </Text>

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
        disabled={!selectedLevel || loading}
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
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    fontSize: 28,
    marginBottom: 6,
  },

  optionTitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },

  optionDescription: {
    fontSize: 11,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 14,
  },

  checkCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

