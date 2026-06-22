import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface LevelOption {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
}

const ONBOARDING_LEVELS: LevelOption[] = [
  { id: 'beginner', title: 'Beginner', description: 'Basic greetings and vocabulary', iconEmoji: '🌱' },
  { id: 'explorer', title: 'Explorer', description: 'Everyday situations and short conversations', iconEmoji: '🧭' },
  { id: 'communicator', title: 'Communicator', description: 'Confident communication and sentence building', iconEmoji: '💬' },
  { id: 'full_fluency', title: 'Full Fluency', description: 'Conversations and cultural expression', iconEmoji: '🎓' },
];

export default function LevelSelectionScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF'; // Clean white background as requested
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedLevel) {
      alert('Please select your experience level to continue.');
      return;
    }

    setLoading(true);
    try {
      // Save selected experience level in AsyncStorage
      await AsyncStorage.setItem('user_experience_level', selectedLevel);

      // Navigate to the Onboarding Summary Screen
      router.push('/onboarding/summary' as any);
    } catch (error) {
      console.warn('Error saving experience level selection:', error);
      // Fallback transition
      router.push('/onboarding/summary' as any);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.replace('/onboarding/daily-goal' as any);
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name={ChevronLeft} color={textColor} size={24} />
          </TouchableOpacity>
          <Text style={styles.logoLabel}>Level Selection</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '80%' }]} />
          </View>
          <Text style={[styles.progressText, { color: mutedTextColor }]}>Step 4 of 5</Text>
        </View>
      </View>

      {/* Middle Section: Hero & Question */}
      <View style={styles.middleSection}>
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/level-hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.questionSection}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            What{"'"}s your current level?
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            This helps us personalize your learning journey.
          </Text>
        </View>
      </View>

      {/* Level Options Grid */}
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
                isSelected ? styles.selectedCard : styles.unselectedCard,
              ]}
            >
              <Text style={styles.cardIcon}>{option.iconEmoji}</Text>
              <Text
                style={[
                  styles.optionTitle,
                  { color: textColor, fontWeight: isSelected ? '700' : '600' },
                ]}
              >
                {option.title}
              </Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
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
          style={styles.ctaButton}
          disabled={!selectedLevel || loading}
        >
          <Text style={styles.ctaButtonText}>
            Continue
          </Text>
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
    height: 40,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
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
  optionTitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 11,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 14,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 8,
  },

  ctaButton: {
    width: '100%',
    maxWidth: 350,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ctaButtonText: {
    width: '100%',
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
