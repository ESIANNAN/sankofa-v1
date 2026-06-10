import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Flame,
  Star,
  Volume2,
  Users,
  Binary,
  PawPrint,
  Utensils,
  ChevronRight,
} from 'lucide-react-native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF';
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [userName, setUserName] = useState('Kwame');
  const [selectedLanguage, setSelectedLanguage] = useState('Asante Twi');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('user_name');
        if (storedName) {
          setUserName(storedName);
        }

        const lang = await AsyncStorage.getItem('user_selected_language');
        const langMap: Record<string, string> = {
          asante_twi: 'Asante Twi',
          fante: 'Fante',
          ga: 'Ga',
          ewe: 'Ewe',
        };
        if (lang && langMap[lang]) {
          setSelectedLanguage(langMap[lang]);
        }
      } catch (error) {
        console.warn('Error loading user data on Home Screen:', error);
      }
    };
    loadUserData();
  }, []);

  const handleLessonClick = (lessonId: string) => {
    router.push('/lesson' as any);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 24),
        paddingBottom: Math.max(insets.bottom, 24) + 80, // Space for bottom tab bar
        paddingHorizontal: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greetingLabel, { color: mutedTextColor }]}>Good Morning</Text>
          <Text style={[styles.userName, { color: textColor }]}>{userName}</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
      </View>

      {/* Quick Stats Section */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Icon name={Flame} color="#FF9500" size={24} />
            <View>
              <Text style={styles.statLabel}>Daily Streak</Text>
              <Text style={styles.statValue}>3 Days</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Icon name={Star} color="#FFCC00" size={24} />
            <View>
              <Text style={styles.statLabel}>XP Points</Text>
              <Text style={styles.statValue}>120 XP</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Word of the Day Card */}
      <Card style={styles.wordOfTheDayCard}>
        <View style={styles.wordHeader}>
          <Text style={[styles.wordCardTitle, { color: mutedTextColor }]}>WORD OF THE DAY</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.audioButton}>
            <Icon name={Volume2} color="#000000" size={20} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.wordText, { color: textColor }]}>Sankofa</Text>
        <Text style={[styles.wordDescription, { color: mutedTextColor }]}>{"\"Go back and get it\""}</Text>
      </Card>

      {/* Progress Summary Cards */}
      <View style={styles.progressRow}>
        <Card style={styles.progressCard}>
          <Text style={[styles.progressNumber, { color: textColor }]}>3</Text>
          <Text style={[styles.progressLabel, { color: mutedTextColor }]}>STREAK</Text>
        </Card>
        <Card style={styles.progressCard}>
          <Text style={[styles.progressNumber, { color: textColor }]}>120</Text>
          <Text style={[styles.progressLabel, { color: mutedTextColor }]}>XP</Text>
        </Card>
        <Card style={styles.progressCard}>
          <Text style={[styles.progressNumber, { color: textColor }]}>2</Text>
          <Text style={[styles.progressLabel, { color: mutedTextColor }]}>LESSONS</Text>
        </Card>
      </View>

      {/* Learning Roadmap Section */}
      <View style={styles.roadmapSection}>
        <Text style={[styles.roadmapTitle, { color: textColor }]}>
          Your Roadmap - {selectedLanguage}
        </Text>

        <View style={styles.lessonList}>
          {/* Card 1: Family */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleLessonClick('family')}
            style={styles.lessonItem}
          >
            <Card style={styles.lessonCard}>
              <View style={styles.lessonCardContent}>
                <View style={styles.lessonIconContainer}>
                  <Icon name={Users} color="#18181b" size={24} />
                </View>
                <View style={styles.lessonTextContainer}>
                  <Text style={styles.lessonTitle}>Family</Text>
                  <Text style={[styles.lessonProgress, { color: mutedTextColor }]}>4 / 10 Words</Text>
                </View>
                <Icon name={ChevronRight} color={mutedTextColor} size={20} />
              </View>
            </Card>
          </TouchableOpacity>

          {/* Card 2: Numbers */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleLessonClick('numbers')}
            style={styles.lessonItem}
          >
            <Card style={styles.lessonCard}>
              <View style={styles.lessonCardContent}>
                <View style={styles.lessonIconContainer}>
                  <Icon name={Binary} color="#18181b" size={24} />
                </View>
                <View style={styles.lessonTextContainer}>
                  <Text style={styles.lessonTitle}>Numbers</Text>
                  <Text style={[styles.lessonProgress, { color: mutedTextColor }]}>0 / 10 Words</Text>
                </View>
                <Icon name={ChevronRight} color={mutedTextColor} size={20} />
              </View>
            </Card>
          </TouchableOpacity>

          {/* Card 3: Animals */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleLessonClick('animals')}
            style={styles.lessonItem}
          >
            <Card style={styles.lessonCard}>
              <View style={styles.lessonCardContent}>
                <View style={styles.lessonIconContainer}>
                  <Icon name={PawPrint} color="#18181b" size={24} />
                </View>
                <View style={styles.lessonTextContainer}>
                  <Text style={styles.lessonTitle}>Animals</Text>
                  <Text style={[styles.lessonProgress, { color: mutedTextColor }]}>0 / 10 Words</Text>
                </View>
                <Icon name={ChevronRight} color={mutedTextColor} size={20} />
              </View>
            </Card>
          </TouchableOpacity>

          {/* Card 4: Food */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleLessonClick('food')}
            style={styles.lessonItem}
          >
            <Card style={styles.lessonCard}>
              <View style={styles.lessonCardContent}>
                <View style={styles.lessonIconContainer}>
                  <Icon name={Utensils} color="#18181b" size={24} />
                </View>
                <View style={styles.lessonTextContainer}>
                  <Text style={styles.lessonTitle}>Food</Text>
                  <Text style={[styles.lessonProgress, { color: mutedTextColor }]}>0 / 10 Words</Text>
                </View>
                <Icon name={ChevronRight} color={mutedTextColor} size={20} />
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 15,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
  },
  wordOfTheDayCard: {
    padding: 20,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 16,
    marginBottom: 16,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  audioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  wordText: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  wordDescription: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  progressCard: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
  },
  progressNumber: {
    fontSize: 22,
    fontWeight: '800',
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  roadmapSection: {
    width: '100%',
  },
  roadmapTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  lessonList: {
    gap: 12,
  },
  lessonItem: {
    width: '100%',
  },
  lessonCard: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 16,
  },
  lessonCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  lessonIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  lessonProgress: {
    fontSize: 12,
    marginTop: 2,
  },
});
