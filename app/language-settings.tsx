import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Check } from 'lucide-react-native';

interface LanguageOption {
  id: string;
  name: string;
  description: string;
  flagEmoji: string;
}

const LANGUAGES: LanguageOption[] = [
  { id: 'asante_twi', name: 'Asante Twi', description: 'Most widely spoken Ghanaian language', flagEmoji: '🇬🇭' },
  { id: 'fante', name: 'Fante', description: 'Popular in the Central Region', flagEmoji: '🇬🇭' },
  { id: 'ga', name: 'Ga', description: 'Language of Greater Accra', flagEmoji: '🇬🇭' },
  { id: 'ewe', name: 'Ewe', description: 'Widely spoken in the Volta Region', flagEmoji: '🇬🇭' },
];

export default function LanguageSettingsScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF';
  const textColor = '#000000';

  const [selectedLanguage, setSelectedLanguage] = useState('asante_twi');

  useEffect(() => {
    const loadSelectedLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem('user_selected_language');
        if (lang) {
          setSelectedLanguage(lang);
        }
      } catch (error) {
        console.warn('Error loading language setting:', error);
      }
    };
    loadSelectedLanguage();
  }, []);

  const handleSelectLanguage = async (id: string) => {
    try {
      setSelectedLanguage(id);
      await AsyncStorage.setItem('user_selected_language', id);
    } catch (error) {
      console.warn('Error saving language selection:', error);
    }
  };

  const handleBack = () => {
    router.back();
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
        <Text style={[styles.headerTitle, { color: textColor }]}>Active Language</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.sectionDescription}>
          Select your primary learning language. Your progress is saved separately for each language.
        </Text>

        <View style={styles.optionsList}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => handleSelectLanguage(lang.id)}
                activeOpacity={0.7}
              >
                <Card
                  style={[
                    styles.languageCard,
                    isSelected ? styles.selectedCard : styles.unselectedCard,
                  ]}
                >
                  <View style={styles.languageLeft}>
                    {/* <Text style={styles.flagEmoji}>{lang.flagEmoji}</Text> */}
                    <View>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <Text style={styles.languageDesc}>{lang.description}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Icon name={Check} color="#FFFFFF" size={16} />
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
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
    marginTop: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#71717a',
    lineHeight: 20,
    marginBottom: 24,
  },
  optionsList: {
    gap: 12,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  unselectedCard: {
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    borderColor: '#000000',
    backgroundColor: '#FAF9F6',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  flagEmoji: {
    fontSize: 32,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  languageDesc: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
