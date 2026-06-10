import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Platform, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';

interface SummaryOption {
  label: string;
  value: string;
  iconEmoji: string;
  route: string;
}

export default function OnboardingSummaryScreen() {
  const backgroundColor = '#FFFFFF'; // Clean white background as requested
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<SummaryOption[]>([]);

  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const lang = await AsyncStorage.getItem('user_selected_language');
        const purpose = await AsyncStorage.getItem('user_learning_purpose');
        const goal = await AsyncStorage.getItem('user_daily_goal');
        const level = await AsyncStorage.getItem('user_experience_level');

        // Resolve display values
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
            value: langMap[lang || ''] || 'Asante Twi',
            iconEmoji: '🇬🇭',
            route: '/onboarding',
          },
          {
            label: 'Goal',
            value: purposeMap[purpose || ''] || 'Travel',
            iconEmoji: '🎯',
            route: '/onboarding/purpose',
          },
          {
            label: 'Level',
            value: levelMap[level || ''] || 'Beginner',
            iconEmoji: '🌱',
            route: '/onboarding/level-selection',
          },
          {
            label: 'Daily Goal',
            value: goalMap[goal || ''] || '10 minutes/day',
            iconEmoji: '⏱️',
            route: '/onboarding/daily-goal',
          },
        ]);
      } catch (error) {
        console.warn('Error loading preferences summary:', error);
      }
    };

    fetchSelections();
  }, []);

  const handleStartLearning = async () => {
    setLoading(true);
    try {
      // Store user preferences completion state
      await AsyncStorage.setItem('onboarding_completed', 'true');
      
      // Navigate to the main application Home screen
      router.replace('/(tabs)/(home)');
    } catch (error) {
      console.warn('Error saving preferences completion:', error);
      router.replace('/(tabs)/(home)');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPreference = (routePath: string) => {
    router.push(routePath as any);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Top Header Section */}
        <View style={styles.header}>
          <Text style={styles.logoLabel}>{"You're All Set!"}</Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          </View>
          <Text style={[styles.progressText, { color: mutedTextColor }]}>Step 5 of 5</Text>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/success-hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Main Message & Subtitle */}
        <View style={styles.messageSection}>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            Your personalized learning journey is ready.
          </Text>
        </View>

        {/* Selected Preferences Summary Cards */}
        <View style={styles.summaryContainer}>
          {selections.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleEditPreference(item.route)}
              style={styles.summaryCard}
              activeOpacity={0.7}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardIcon}>{item.iconEmoji}</Text>
                <View>
                  <Text style={[styles.cardLabel, { color: mutedTextColor }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.cardValue, { color: textColor }]}>
                    {item.value}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Action Button */}
        <View style={styles.footer}>
          <Button
            variant="default"
            size="lg"
            onPress={handleStartLearning}
            loading={loading}
            style={styles.ctaButton}
            textStyle={styles.ctaButtonText}
          >
            Start Learning
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
  messageSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 30,
  },
  summaryContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  summaryCard: {
    width: 350,
    paddingVertical: 14,
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
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '600',
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
