import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle2, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';

interface SummaryItem {
  label: string;
  value: string;
  iconEmoji: string;
}

export default function OnboardingSummaryScreen() {
  const backgroundColor = '#FFFFFF';
  const textColor = '#000000';
  const mutedTextColor = '#71717a';
  const accentColor = '#34C759'; // Success green

  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<SummaryItem[]>([]);

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
          travel: 'Travel (Communicate confidently)',
          work: 'Work (Use language professionally)',
          school: 'School (Support academic learning)',
          friends_family: 'Friends & Family (Connect with loved ones)',
        };

        const goalMap: Record<string, string> = {
          relaxed: '5 mins/day (Relaxed pace)',
          steady: '10 mins/day (Steady progress)',
          committed: '15 mins/day (Committed learner)',
          dedicated: '20 mins/day (Dedicated learner)',
        };

        const levelMap: Record<string, string> = {
          beginner: 'Beginner (Basic greetings)',
          explorer: 'Explorer (Everyday situations)',
          communicator: 'Communicator (Confident conversation)',
          full_fluency: 'Full Fluency (Cultural expression)',
        };

        setSelections([
          { label: 'Language', value: langMap[lang || ''] || 'Asante Twi', iconEmoji: '🇬🇭' },
          { label: 'Goal Motivation', value: purposeMap[purpose || ''] || 'Travel', iconEmoji: '✈️' },
          { label: 'Daily Goal', value: goalMap[goal || ''] || '10 minutes/day', iconEmoji: '🔥' },
          { label: 'Current Level', value: levelMap[level || ''] || 'Beginner', iconEmoji: '🌱' },
        ]);
      } catch (error) {
        console.warn('Error loading summary choices:', error);
      }
    };

    fetchSelections();
  }, []);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/(home)');
    }, 1200);
  };

  const handleEditStep = (stepIndex: number) => {
    if (stepIndex === 0) router.push('/onboarding' as any);
    if (stepIndex === 1) router.push('/onboarding/purpose' as any);
    if (stepIndex === 2) router.push('/onboarding/daily-goal' as any);
    if (stepIndex === 3) router.push('/onboarding/level-selection' as any);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.header}>
          <Text style={styles.logoLabel}>Ready to start</Text>
        </View>

        {/* Center Success Icon Banner */}
        <View style={styles.successBanner}>
          <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
            <Icon name={CheckCircle2} color={accentColor} size={50} />
          </View>
          <Text variant="heading" style={[styles.title, { color: textColor }]}>
            All set!
          </Text>
          <Text variant="body" style={[styles.subtitle, { color: mutedTextColor }]}>
            Your learning path is custom-tailored to your choices.
          </Text>
        </View>

        {/* Selected Options Summary List */}
        <View style={styles.summaryContainer}>
          {selections.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleEditStep(index)}
              style={styles.summaryCard}
              activeOpacity={0.7}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardIcon}>{item.iconEmoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardLabel, { color: mutedTextColor }]}>{item.label}</Text>
                  <Text style={[styles.cardValue, { color: textColor }]}>{item.value}</Text>
                </View>
              </View>
              <Icon name={ChevronRight} color="#C7C7CC" size={20} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            variant="default"
            size="lg"
            onPress={handleStart}
            loading={loading}
            style={styles.ctaButton}
            textStyle={styles.ctaButtonText}
          >
            Begin Learning
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
    marginBottom: 16,
  },
  logoLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#71717a',
    textTransform: 'uppercase',
  },
  successBanner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
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
  summaryContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
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
    justifyContent: 'space-between',
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
});
