import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Share, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/services/firebase';
import {
  Share2,
  Settings,
  Flame,
  BookOpen,
  CheckCircle2,
  Bookmark,
  X,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF';
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Asante Twi');
  const [experienceLevel, setExperienceLevel] = useState('Beginner - Level 1');
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out my language learning progress on Sankofa! I am learning ${selectedLanguage} and I'm at ${experienceLevel}. Join me!`,
      });
      if (result.action === Share.sharedAction) {
        // Shared
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Initial fetch from current user
    if (auth.currentUser) {
      setUserName(auth.currentUser.displayName || '');
      setUserPhoto(auth.currentUser.photoURL || null);
      setUserEmail(auth.currentUser.email || '');
    }

    // Listen to Firebase Auth state change to grab displayName, photoURL and email
    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      if (user) {
        if (user.displayName) setUserName(user.displayName);
        if (user.photoURL) setUserPhoto(user.photoURL);
        if (user.email) setUserEmail(user.email);
      } else {
        try {
          const storedName = await AsyncStorage.getItem('user_name');
          if (storedName) setUserName(storedName);

          const storedPhoto = await AsyncStorage.getItem('user_photo');
          if (storedPhoto) setUserPhoto(storedPhoto);

          const storedEmail = await AsyncStorage.getItem('user_email');
          if (storedEmail) setUserEmail(storedEmail);
        } catch (e) {
          console.warn('Error loading user profile data from AsyncStorage:', e);
        }
      }
    });

    const loadAdditionalData = async () => {
      try {
        // Load Language
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

        // Load Experience Level
        const level = await AsyncStorage.getItem('user_experience_level');
        const levelMap: Record<string, string> = {
          beginner: 'Beginner - Level 1',
          explorer: 'Explorer - Level 2',
          communicator: 'Communicator - Level 3',
          full_fluency: 'Full Fluency - Level 4',
        };
        if (level && levelMap[level]) {
          setExperienceLevel(levelMap[level]);
        }
      } catch (error) {
        console.warn('Error loading additional data on Profile Screen:', error);
      }
    };

    loadAdditionalData();

    return unsubscribe;
  }, []);

  const getFirstLetter = (name: string) => {
    return name ? name.trim().charAt(0).toUpperCase() : 'P';
  };

  const getNextLevelText = (level: string) => {
    if (level.includes('Level 1')) {
      return '1000 XP to reach Explorer - Level 2';
    } else if (level.includes('Level 2')) {
      return '1000 XP to reach Communicator - Level 3';
    } else if (level.includes('Level 3')) {
      return '1000 XP to reach Full Fluency - Level 4';
    } else {
      return 'You are at maximum level!';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 24) + 80, // Space for bottom tab bar
        paddingHorizontal: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShareModalVisible(true)}
            style={styles.headerButton}
          >
            <Icon name={Share2} color={textColor} size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/settings' as any)}
            style={styles.headerButton}
          >
            <Icon name={Settings} color={textColor} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {userPhoto ? (
          <Image source={{ uri: userPhoto }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {getFirstLetter(userName)}
            </Text>
          </View>
        )}
        <Text style={[styles.profileName, { color: textColor }]}>{userName}</Text>
        {userEmail ? (
          <Text style={{ fontSize: 14, color: mutedTextColor, marginBottom: 8, fontWeight: '500' }}>
            {userEmail}
          </Text>
        ) : null}
        <Text style={[styles.profileLanguage, { color: mutedTextColor }]}>
          Learning {selectedLanguage}
        </Text>
        <Text style={[styles.profileLevel, { color: mutedTextColor }]}>
          {experienceLevel}
        </Text>

        {/* Edit Profile Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/personal-info' as any)}
          style={styles.editProfileButton}
        >
          <Text style={styles.editProfileButtonText}>✏️ Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* XP Progress Card */}
      <Card style={styles.xpCard}>
        <Text style={[styles.cardTitle, { color: mutedTextColor }]}>XP PROGRESS</Text>
        <Text style={[styles.xpValueText, { color: textColor }]}>0 / 1000 XP</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '0%' }]} />
        </View>
        <Text style={[styles.xpLevelUpText, { color: mutedTextColor }]}>
          {getNextLevelText(experienceLevel)}
        </Text>
      </Card>

      {/* Your Statistics */}
      <View style={styles.statsSection}>
        <Text style={[styles.sectionTitleHeader, { color: textColor }]}>YOUR STATISTICS</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Icon name={Flame} color="#FF9500" size={24} />
              <Text style={[styles.statValue, { color: textColor }]}>3</Text>
              <Text style={[styles.statLabel, { color: mutedTextColor }]}>Day streak</Text>
            </Card>
            <Card style={styles.statCard}>
              <Icon name={BookOpen} color="#007AFF" size={24} />
              <Text style={[styles.statValue, { color: textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: mutedTextColor }]}>Completed lessons</Text>
            </Card>
          </View>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Icon name={CheckCircle2} color="#34A853" size={24} />
              <Text style={[styles.statValue, { color: textColor }]}>0%</Text>
              <Text style={[styles.statLabel, { color: mutedTextColor }]}>Quiz accuracy</Text>
            </Card>
            <Card style={styles.statCard}>
              <Icon name={Bookmark} color="#E040FB" size={24} />
              <Text style={[styles.statValue, { color: textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: mutedTextColor }]}>Words saved</Text>
            </Card>
          </View>
        </View>
      </View>

      {/* Languages Section */}
      <View style={styles.languagesSection}>
        <Text style={[styles.sectionTitleHeader, { color: textColor }]}>LANGUAGES BEING LEARNED</Text>
        <View style={styles.languagesList}>
          {/* Language 1: Asante Twi */}
          <View style={styles.languageRow}>
            <View style={styles.languageLeft}>
              <View style={[styles.languageIcon, { backgroundColor: '#FAF9F6' }]}>
                <Text style={styles.languageEmoji}>🇬🇭</Text>
              </View>
              <Text style={[styles.languageName, { color: textColor }]}>Asante Twi</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>620 XP</Text>
            </View>
          </View>

          {/* Language 2: Ga */}
          <View style={styles.languageRow}>
            <View style={styles.languageLeft}>
              <View style={[styles.languageIcon, { backgroundColor: '#FAF9F6' }]}>
                <Text style={styles.languageEmoji}>🇬🇭</Text>
              </View>
              <Text style={[styles.languageName, { color: textColor }]}>Ga</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>50 XP</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

    <Modal
      visible={shareModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShareModalVisible(false)}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={() => setShareModalVisible(false)}
      >
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.pullTab} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share Profile</Text>
            <TouchableOpacity 
              onPress={() => setShareModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name={X} color={textColor} size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalDescription}>
            Share your achievements and invite friends to learn African languages!
          </Text>

          {/* Profile Card Preview */}
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.previewAvatar} />
              ) : (
                <View style={styles.previewAvatarPlaceholder}>
                  <Text style={styles.previewAvatarText}>
                    {getFirstLetter(userName)}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.previewName}>{userName}</Text>
                <Text style={styles.previewSubtext}>Learning {selectedLanguage}</Text>
              </View>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.previewStatsRow}>
              <View style={styles.previewStatCol}>
                <Icon name={Flame} color="#FF9500" size={18} />
                <Text style={styles.previewStatValue}>3 Day Streak</Text>
              </View>
              <View style={styles.previewStatCol}>
                <Icon name={BookOpen} color="#007AFF" size={18} />
                <Text style={styles.previewStatValue}>{experienceLevel.split(' - ')[0]}</Text>
              </View>
            </View>
          </View>

          {/* Share Options */}
          <View style={styles.shareOptionsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleNativeShare}
              style={[styles.shareOptionButton, { backgroundColor: '#25D366' }]}
            >
              <Text style={styles.shareOptionText}>Share to WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleNativeShare}
              style={[styles.shareOptionButton, { backgroundColor: '#000000' }]}
            >
              <Text style={styles.shareOptionText}>Share to X (Twitter)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCopyLink}
              style={[styles.shareOptionButton, styles.copyLinkButton]}
            >
              <Text style={styles.copyLinkButtonText}>
                {copied ? '✓ Link Copied!' : '🔗 Copy Profile Link'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleNativeShare}
              style={[styles.shareOptionButton, styles.systemShareButton]}
            >
              <Text style={styles.systemShareButtonText}>💬 More Share Options</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  </View>
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
    height: 48,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholderText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000000',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileLanguage: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileLevel: {
    fontSize: 13,
    fontWeight: '400',
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  editProfileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  xpCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 18,
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  xpValueText: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F4F4F5',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 5,
  },
  xpLevelUpText: {
    fontSize: 13,
    fontWeight: '400',
  },
  statsSection: {
    marginBottom: 28,
  },
  sectionTitleHeader: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,

    height: 130,
    paddingVertical: 8,
    paddingHorizontal: 8,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  languagesSection: {
    marginBottom: 16,
  },
  languagesList: {
    gap: 12,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  languageEmoji: {
    fontSize: 20,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
  },
  xpBadge: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  xpBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  pullTab: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E5E5EA',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  previewCard: {
    width: '100%',
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  previewAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  previewSubtext: {
    fontSize: 13,
    color: '#71717a',
    fontWeight: '500',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  previewStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewStatCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewStatValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  shareOptionsContainer: {
    width: '100%',
    gap: 10,
  },
  shareOptionButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  shareOptionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  copyLinkButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  copyLinkButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  systemShareButton: {
    backgroundColor: '#F4F4F5',
  },
  systemShareButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
});
