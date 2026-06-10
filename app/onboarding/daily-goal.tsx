import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GoalOption {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
}

const ONBOARDING_GOALS: GoalOption[] = [
  { id: 'relaxed', title: '5 minutes/day', description: 'Relaxed pace', iconEmoji: '🌱' },
  { id: 'steady', title: '10 minutes/day', description: 'Steady progress', iconEmoji: '⚡' },
  { id: 'committed', title: '15 minutes/day', description: 'Committed learner', iconEmoji: '🔥' },
  { id: 'dedicated', title: '20 minutes/day', description: 'Dedicated learner', iconEmoji: '🏆' },
];

export default function DailyGoalSelectionScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF'; // Clean white background as requested
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedGoal) {
      alert('Please select a daily time commitment to continue.');
      return;
    }

    setLoading(true);
    try {
      // Save selected daily goal in AsyncStorage
      await AsyncStorage.setItem('user_daily_goal', selectedGoal);
      
      // Navigate to the Level Selection Screen
      router.push('/onboarding/level-selection' as any);
    } catch (error) {
      console.warn('Error saving daily goal selection:', error);
      // Fallback transition
      router.push('/onboarding/level-selection' as any);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.replace('/onboarding/purpose' as any);
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
          <Text style={styles.logoLabel}>Daily Goal</Text>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={[styles.backText, { color: mutedTextColor }]}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
          <Text style={[styles.progressText, { color: mutedTextColor }]}>Step 3 of 5</Text>
        </View>
      </View>

      {/* Middle Section: Hero & Question */}
      <View style={styles.middleSection}>
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/goal-hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.questionSection}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Set your daily goal
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Consistency beats intensity.
          </Text>
        </View>
      </View>

      {/* Goal Options Grid */}
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
                isSelected ? styles.selectedCard : styles.unselectedCard,
              ]}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardIcon}>{option.iconEmoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.optionTitle,
                      { color: textColor, fontWeight: isSelected ? '700' : '600' },
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
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
            !selectedGoal
              ? [styles.ctaButton, { opacity: 0.5 }]
              : [styles.ctaButton]
          }
          textStyle={styles.ctaButtonText}
          disabled={!selectedGoal || loading}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    position: 'relative',
  },
  logoLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#71717a',
    textTransform: 'uppercase',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
  optionsContainer: {
    width: '100%',
    gap: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  optionCard: {
    width: '100%',
    maxWidth: 350,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1.5,
    flexDirection: 'row',
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
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  cardIcon: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 16,
  },
  optionDescription: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
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
