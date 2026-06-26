import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/services/firebase';
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

  const [userName, setUserName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Asante Twi');

  useEffect(() => {
    // Initialize displayName on mount if user is logged in
    if (auth.currentUser && auth.currentUser.displayName) {
      setUserName(auth.currentUser.displayName);
    } else {
      AsyncStorage.getItem('user_name').then((stored) => {
        if (stored) setUserName(stored);
      }).catch(() => {});
    }

    // Listen to Firebase Auth state change to grab displayName
    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      if (user && user.displayName) {
        setUserName(user.displayName);
      } else {
        try {
          const storedName = await AsyncStorage.getItem('user_name');
          if (storedName) {
            setUserName(storedName);
          }
        } catch (e) {
          console.warn('Error loading user_name from AsyncStorage:', e);
        }
      }
    });

    const loadSettings = async () => {
      try {
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
        console.warn('Error loading language setting on Home Screen:', error);
      }
    };

    loadSettings();

    return unsubscribe;
  }, []);

  const handleLessonClick = (lessonId: string) => {
    router.push(`/lesson?category=${lessonId}&language=${selectedLanguage}` as any);
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
          <Text style={[styles.greetingLabel, { color: mutedTextColor }]}>GOOD MORNING</Text>
          <Text style={[styles.userName, { color: textColor }]}>
            {userName} 👋🏾
          </Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
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

      {/* Quick Stats Cards */}
      <View style={styles.progressRow}>
        <Card style={styles.progressCard}>
          <Icon name={Flame} color="#FF9500" size={24} />
          <Text style={[styles.progressNumber, { color: textColor }]}>3</Text>
          <Text style={[styles.progressLabel, { color: mutedTextColor }]}>STREAK</Text>
        </Card>
        <Card style={styles.progressCard}>
          <Icon name={Star} color="#FFCC00" size={24} />
          <Text style={[styles.progressNumber, { color: textColor }]}>120</Text>
          <Text style={[styles.progressLabel, { color: mutedTextColor }]}>XP</Text>
        </Card>
        <Card style={styles.progressCard}>
          <Text style={styles.emojiIcon}>📚</Text>
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
                  <Text style={[styles.lessonProgress, { color: mutedTextColor }]}>0 / 10 Words</Text>
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
    marginBottom: 24,
  },
  greetingLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.5,
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
  wordOfTheDayCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  wordText: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  wordDescription: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
    justifyContent: 'space-between',
  },
  progressCard: {
    flex: 1,
    aspectRatio: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  emojiIcon: {
    fontSize: 22,
    lineHeight: 26,
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
