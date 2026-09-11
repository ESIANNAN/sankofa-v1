
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

interface GoalOption {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
}

const ONBOARDING_GOALS: GoalOption[] = [
  {
    id: 'relaxed',
    title: '5 minutes/day',
    description: 'Relaxed pace',
    iconEmoji: '🌱',
  },
  {
    id: 'steady',
    title: '10 minutes/day',
    description: 'Steady progress',
    iconEmoji: '⚡',
  },
  {
    id: 'committed',
    title: '15 minutes/day',
    description: 'Committed learner',
    iconEmoji: '🔥',
  },
  {
    id: 'dedicated',
    title: '20 minutes/day',
    description: 'Dedicated learner',
    iconEmoji: '🏆',
  },
];

export default function DailyGoalSelectionScreen() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedGoal) {
      alert('Please select a daily time commitment to continue.');
      return;
    }

    setLoading(true);

    try {
      await AsyncStorage.setItem(
        'user_daily_goal',
        selectedGoal
      );

      router.push('/onboarding/level-selection' as any);
    } catch (error) {
      console.warn('Error saving daily goal selection:', error);

      router.push('/onboarding/level-selection' as any);
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
        title="Daily Goal"
        step={3}
        total={5}
        onBack={handleBack}
      />

      {/* Question */}
      <OnboardingTitle
        heading="Set your daily goal"
        subtitle="Consistency beats intensity."
      />

      {/* Goal Options */}
      <View style={styles.optionsContainer}>
        {ONBOARDING_GOALS.map((option) => {
          const isSelected = selectedGoal === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedGoal(option.id)}
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
        disabled={!selectedGoal || loading}
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
    marginBottom: 2,
  },

  optionDescription: {
    fontSize: 12,
    color: '#71717A',
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

