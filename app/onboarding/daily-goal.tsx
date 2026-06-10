import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';

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
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Top Header Section */}
        <View style={styles.header}>
          <Text style={styles.logoLabel}>Daily Goal</Text>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={[styles.backText, { color: mutedTextColor }]}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
          <Text style={[styles.progressText, { color: mutedTextColor }]}>Step 3 of 5</Text>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/goal-hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Question & Subtitle Section */}
        <View style={styles.questionSection}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Set your daily goal
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Consistency beats intensity.
          </Text>
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
            style={[
              styles.ctaButton,
              !selectedGoal ? { opacity: 0.5 } : undefined,
            ]}
            textStyle={styles.ctaButtonText}
            disabled={!selectedGoal || loading}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
  optionsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  optionCard: {
    width: 350,
    paddingVertical: 16,
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
  progressContainer: {
    width: 350,
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
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
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
