import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { router } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/services/firebase';
import {
  ChevronLeft,
  User,
  Lock,
  Bell,
  Moon,
  Globe,
  ChevronRight,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF';
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('Asante Twi');

  useEffect(() => {
    // Load preferences on mount
    const loadPreferences = async () => {
      try {
        const notifs = await AsyncStorage.getItem('settings_notifications');
        if (notifs !== null) {
          setNotificationsEnabled(notifs === 'true');
        }

        const dark = await AsyncStorage.getItem('settings_dark_mode');
        if (dark !== null) {
          setDarkModeEnabled(dark === 'true');
        }

        // Load active language
        const lang = await AsyncStorage.getItem('user_selected_language');
        const langMap: Record<string, string> = {
          asante_twi: 'Asante Twi',
          fante: 'Fante',
          ga: 'Ga',
          ewe: 'Ewe',
        };
        if (lang && langMap[lang]) {
          setActiveLanguage(langMap[lang]);
        }
      } catch (error) {
        console.warn('Error loading preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem('settings_notifications', value ? 'true' : 'false');
    } catch (error) {
      console.warn('Error saving notifications setting:', error);
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    setDarkModeEnabled(value);
    try {
      await AsyncStorage.setItem('settings_dark_mode', value ? 'true' : 'false');
    } catch (error) {
      console.warn('Error saving dark mode setting:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Sign out Firebase Authentication
      await auth.signOut();

      // Navigate to Login Screen
      router.replace('/login' as any);
    } catch (error) {
      console.warn('Error during logout:', error);
      // Fallback transition
      router.replace('/login' as any);
    }
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name={ChevronLeft} color={textColor} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        
        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionHeader}>ACCOUNT SECTION</Text>
        <Card style={styles.settingCard}>
          {/* Personal Info Row */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/personal-info' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              <View style={styles.iconContainer}>
                <Icon name={User} color={textColor} size={20} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingRowTitle}>Personal Info</Text>
                <Text style={styles.settingRowDesc}>Name, email, phone</Text>
              </View>
            </View>
            <Icon name={ChevronRight} color={mutedTextColor} size={20} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Password Row */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/reset-password' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              <View style={styles.iconContainer}>
                <Icon name={Lock} color={textColor} size={20} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingRowTitle}>Password & Security</Text>
                <Text style={styles.settingRowDesc}>Change Password</Text>
              </View>
            </View>
            <Icon name={ChevronRight} color={mutedTextColor} size={20} />
          </TouchableOpacity>
        </Card>

        {/* PREFERENCES SECTION */}
        <Text style={styles.sectionHeader}>PREFERENCES SECTION</Text>
        <Card style={styles.settingCard}>
          {/* Notifications Row */}
          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <View style={styles.iconContainer}>
                <Icon name={Bell} color={textColor} size={20} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingRowTitle}>Notifications</Text>
                <Text style={styles.settingRowDesc}>Daily reminders</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E5E5EA', true: '#000000' }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Dark Mode Row */}
          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <View style={styles.iconContainer}>
                <Icon name={Moon} color={textColor} size={20} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingRowTitle}>Dark Mode</Text>
                <Text style={styles.settingRowDesc}>Change theme</Text>
              </View>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E5E5EA', true: '#000000' }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>
        </Card>

        {/* LEARNING SECTION */}
        <Text style={styles.sectionHeader}>LEARNING SECTION</Text>
        <Card style={styles.settingCard}>
          {/* Active Language Row */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/language-settings' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              <View style={styles.iconContainer}>
                <Icon name={Globe} color={textColor} size={20} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingRowTitle}>Active Language</Text>
                <Text style={styles.settingRowDesc}>{activeLanguage}</Text>
              </View>
            </View>
            <Icon name={ChevronRight} color={mutedTextColor} size={20} />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    height: 64,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717a',
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  settingRowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  settingRowDesc: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  logoutButton: {
    backgroundColor: '#000000',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 48,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
