import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

import { OnboardingLayout } from '@/components/ui/onboarding-layout';
import { OnboardingHeader } from '@/components/ui/onboarding-header';
import { OnboardingTitle } from '@/components/ui/onboarding-title';
import { OnboardingFooter } from '@/components/ui/onboarding-footer';

interface SummaryOption {
  label: string;
  value: string;
  iconEmoji: string;
  route: string;
}

export default function OnboardingSummaryScreen() {
  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<SummaryOption[]>([]);

  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const lang = await AsyncStorage.getItem(
          'user_selected_language'
        );

        const purpose = await AsyncStorage.getItem(
          'user_learning_purpose'
        );

        const goal = await AsyncStorage.getItem(
          'user_daily_goal'
        );

        const level = await AsyncStorage.getItem(
          'user_experience_level'
        );

        const langMap: Record<string, string> = {
          asante_twi: 'Asante Twi',
          fante: 'Fante',
          ga: 'Ga',
          ewe: 'Ewe',
        };

        const purposeMap: Record<string, string> = {
          travel: 'Travel',
          work: 'Work',
          school: 'School',
          friends_family: 'Friends & Family',
        };

        const goalMap: Record<string, string> = {
          relaxed: '5 minutes/day',
          steady: '10 minutes/day',
          committed: '15 minutes/day',
          dedicated: '20 minutes/day',
        };

        const levelMap: Record<string, string> = {
          beginner: 'Beginner',
          explorer: 'Explorer',
          communicator: 'Communicator',
          full_fluency: 'Full Fluency',
        };

        setSelections([
          {
            label: 'Language',
            value:
              langMap[lang || ''] || 'Asante Twi',
            iconEmoji: '🇬🇭',
            route: '/onboarding',
          },
          {
            label: 'Goal',
            value:
              purposeMap[purpose || ''] || 'Travel',
            iconEmoji: '🎯',
            route: '/onboarding/purpose',
          },
          {
            label: 'Level',
            value:
              levelMap[level || ''] || 'Beginner',
            iconEmoji: '🌱',
            route: '/onboarding/level-selection',
          },
          {
            label: 'Daily Goal',
            value:
              goalMap[goal || ''] || '10 minutes/day',
            iconEmoji: '⏱️',
            route: '/onboarding/daily-goal',
          },
        ]);
      } catch (error) {
        console.warn(
          'Error loading preferences summary:',
          error
        );
      }
    };

    fetchSelections();
  }, []);

  const handleStartLearning = async () => {
    setLoading(true);

    try {
      await AsyncStorage.setItem(
        'onboarding_completed',
        'true'
      );

      router.replace('/home' as any);
    } catch (error) {
      console.warn(
        'Error saving preferences completion:',
        error
      );

      router.replace('/home' as any);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPreference = (routePath: string) => {
    router.push(routePath as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <OnboardingLayout>

      {/* Header */}
      <OnboardingHeader
        title="You're All Set!"
        step={5}
        total={5}
        onBack={handleBack}
      />

      {/* Title */}
      <OnboardingTitle
        heading="You're all set!"
        subtitle="Review your preferences before you start learning."
      />

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        {selections.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              handleEditPreference(item.route)
            }
            style={styles.summaryCard}
            activeOpacity={0.7}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardIcon}>
                {item.iconEmoji}
              </Text>

              <View>
                <Text style={styles.cardLabel}>
                  {item.label}
                </Text>

                <Text style={styles.cardValue}>
                  {item.value}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <OnboardingFooter
        onPress={handleStartLearning}
        loading={loading}
        label="Start Learning"
        color="#70e000"
      />

    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    width: '100%',
    gap: 8,
    alignItems: 'center',
  },

  summaryCard: {
    width: '100%',
    maxWidth: 350,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },

  cardIcon: {
    fontSize: 24,
  },

  cardLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#71717A',
  },

  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    color: '#000000',
  },
});