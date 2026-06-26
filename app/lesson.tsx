import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Volume2, Bookmark } from 'lucide-react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/services/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc } from 'firebase/firestore';

interface VocabItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  audioURL: string;
  partOfSpeech: string;
  category: string;
  language: string;
}

// Rich fallback mock vocabulary data for Asante Twi
const MOCK_VOCAB: Record<string, VocabItem[]> = {
  family: [
    {
      id: 'fam_1',
      word: 'Maame',
      translation: 'Mother',
      pronunciation: 'Maa-me',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'family',
      language: 'Asante Twi'
    },
    {
      id: 'fam_2',
      word: 'Papa',
      translation: 'Father',
      pronunciation: 'Pa-pa',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'family',
      language: 'Asante Twi'
    },
    {
      id: 'fam_3',
      word: 'Wɔfa',
      translation: 'Uncle',
      pronunciation: 'Wɔ-fa',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'family',
      language: 'Asante Twi'
    },
    {
      id: 'fam_4',
      word: 'Sewaa',
      translation: 'Aunt',
      pronunciation: 'Se-waa',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'family',
      language: 'Asante Twi'
    },
    {
      id: 'fam_5',
      word: 'Nua barima',
      translation: 'Brother',
      pronunciation: 'Nua ba-ri-ma',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'family',
      language: 'Asante Twi'
    }
  ],
  numbers: [
    {
      id: 'num_1',
      word: 'Baako',
      translation: 'One',
      pronunciation: 'Baa-ko',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'numbers',
      language: 'Asante Twi'
    },
    {
      id: 'num_2',
      word: 'Mmienu',
      translation: 'Two',
      pronunciation: 'Mmie-nu',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'numbers',
      language: 'Asante Twi'
    },
    {
      id: 'num_3',
      word: 'Mmiɛnsa',
      translation: 'Three',
      pronunciation: 'Mmiɛn-sa',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'numbers',
      language: 'Asante Twi'
    },
    {
      id: 'num_4',
      word: 'Nan',
      translation: 'Four',
      pronunciation: 'Nan',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'numbers',
      language: 'Asante Twi'
    },
    {
      id: 'num_5',
      word: 'Num',
      translation: 'Five',
      pronunciation: 'Num',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'numbers',
      language: 'Asante Twi'
    }
  ],
  animals: [
    {
      id: 'anim_1',
      word: 'Kraman',
      translation: 'Dog',
      pronunciation: 'Kra-man',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'animals',
      language: 'Asante Twi'
    },
    {
      id: 'anim_2',
      word: 'Apatre',
      translation: 'Fish',
      pronunciation: 'A-pa-tre',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'animals',
      language: 'Asante Twi'
    },
    {
      id: 'anim_3',
      word: 'Ɔkɔdeɛ',
      translation: 'Eagle',
      pronunciation: 'Ɔ-kɔ-deɛ',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'animals',
      language: 'Asante Twi'
    },
    {
      id: 'anim_4',
      word: 'Agyinamoa',
      translation: 'Cat',
      pronunciation: 'A-gyi-na-moa',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'animals',
      language: 'Asante Twi'
    },
    {
      id: 'anim_5',
      word: 'Nantwie',
      translation: 'Cow',
      pronunciation: 'Nan-twie',
      audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
      partOfSpeech: 'NOUN',
      category: 'animals',
      language: 'Asante Twi'
    }
  ]
};

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const { category, language } = useLocalSearchParams();

  // Normalize parameters
  const currentCategory = (category as string)?.toLowerCase() || 'family';
  const currentLanguage = (language as string) || 'Asante Twi';

  const [loading, setLoading] = useState(true);
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Fetch words from Firestore or fallback to mock data
  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        // Expected structure: Languages / Asante Twi / Lessons / family / Lesson 1
        // Fetch all documents under the "Lesson 1" collection
        const colRef = collection(
          db,
          'Languages',
          currentLanguage,
          'Lessons',
          currentCategory,
          'Lesson 1'
        );
        const snapshot = await getDocs(colRef);
        
        if (!snapshot.empty) {
          const list: VocabItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              word: data.word || '',
              translation: data.translation || '',
              pronunciation: data.pronunciation || '',
              audioURL: data.audioURL || '',
              partOfSpeech: data.partOfSpeech || 'NOUN',
              category: data.category || currentCategory,
              language: data.language || currentLanguage,
            });
          });
          setVocabList(list);
        } else {
          // Fallback to local mock data
          const localList = MOCK_VOCAB[currentCategory] || MOCK_VOCAB.family;
          setVocabList(localList);
        }
      } catch (err) {
        console.warn('Firestore fetch failed, using local mock data:', err);
        const localList = MOCK_VOCAB[currentCategory] || MOCK_VOCAB.family;
        setVocabList(localList);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [currentCategory, currentLanguage]);

  // Check if current word is already bookmarked in Firestore
  useEffect(() => {
    const checkBookmark = async () => {
      if (!vocabList[currentIndex] || !auth.currentUser) {
        setIsBookmarked(false);
        return;
      }
      try {
        const userId = auth.currentUser.uid;
        const currentWord = vocabList[currentIndex].word;
        const bookmarkRef = doc(db, 'users', userId, 'saved_words', currentWord);
        const docSnap = await getDoc(bookmarkRef);
        setIsBookmarked(docSnap.exists());
      } catch (e) {
        console.warn('Failed to check bookmark status:', e);
        setIsBookmarked(false);
      }
    };

    checkBookmark();
  }, [vocabList, currentIndex]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const playPronunciation = async () => {
    const item = vocabList[currentIndex];
    if (!item || !item.audioURL) return;

    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: item.audioURL },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.warn('Failed to play audio:', error);
      Alert.alert('Playback Notice', 'Pronunciation audio could not be played. Please check your network connection.');
    }
  };

  const toggleBookmark = async () => {
    const item = vocabList[currentIndex];
    if (!item) return;

    if (!auth.currentUser) {
      Alert.alert('Login Required', 'You need to be logged in to save words.');
      return;
    }

    setBookmarkLoading(true);
    const userId = auth.currentUser.uid;
    const bookmarkRef = doc(db, 'users', userId, 'saved_words', item.word);

    try {
      if (isBookmarked) {
        await deleteDoc(bookmarkRef);
        setIsBookmarked(false);
      } else {
        await setDoc(bookmarkRef, {
          word: item.word,
          translation: item.translation,
          pronunciation: item.pronunciation,
          audioURL: item.audioURL || '',
          partOfSpeech: item.partOfSpeech || 'NOUN',
          category: item.category || currentCategory,
          language: item.language || currentLanguage,
          savedAt: new Date().toISOString(),
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error('Bookmark toggle failed:', e);
      Alert.alert('Error', 'Failed to save or remove the word. Please try again.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleNext = async () => {
    const newProgress = Math.round(((currentIndex + 1) / vocabList.length) * 100);

    // Save progress locally and to Firestore
    try {
      await AsyncStorage.setItem(`progress_${currentCategory}`, newProgress.toString());
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const progressRef = doc(db, 'users', userId, 'progress', currentCategory);
        await setDoc(progressRef, {
          progress: newProgress,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Error saving progress:', err);
    }

    if (currentIndex < vocabList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to Quiz Screen
      router.push(`/quiz?category=${currentCategory}&language=${currentLanguage}` as any);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#18181b" />
        <Text style={styles.loadingText}>Loading lesson content...</Text>
      </View>
    );
  }

  if (vocabList.length === 0) {
    return (
      <View style={[styles.errorContainer, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>No vocabulary cards available.</Text>
        <Button variant="default" onPress={handleBack} style={styles.backButtonCta}>
          Go Back
        </Button>
      </View>
    );
  }

  const currentItem = vocabList[currentIndex];
  const progressPercent = vocabList.length > 0 ? (currentIndex / vocabList.length) * 100 : 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 24),
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButtonCircle} activeOpacity={0.7}>
          <Icon name={ChevronLeft} color="#000000" size={24} />
        </TouchableOpacity>

        {/* Custom Progress Bar */}
        <View style={styles.progressOuter}>
          <View style={[styles.progressInner, { width: `${progressPercent}%` }]} />
        </View>

        <Text style={styles.progressText}>
          {currentIndex + 1} / {vocabList.length}
        </Text>
      </View>

      {/* Lesson Category */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>
          {currentCategory.toUpperCase()} • {currentItem.language.toUpperCase()}
        </Text>
      </View>

      {/* Vocabulary Card */}
      <Card style={styles.vocabCard}>
        <View style={styles.partOfSpeechTag}>
          <Text style={styles.partOfSpeechText}>
            {currentItem.partOfSpeech.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.largeWord}>{currentItem.word}</Text>
        <Text style={styles.pronunciation}>[{currentItem.pronunciation}]</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.translation}>{currentItem.translation}</Text>

        <TouchableOpacity 
          style={styles.speakerButton} 
          onPress={playPronunciation}
          activeOpacity={0.7}
        >
          <Icon name={Volume2} color="#000000" size={28} />
        </TouchableOpacity>
      </Card>

      {/* Action Footer */}
      <View style={styles.footer}>
        <Button
          variant="outline"
          size="lg"
          onPress={toggleBookmark}
          disabled={bookmarkLoading}
          style={[
            styles.bookmarkButton, 
            isBookmarked ? { borderColor: '#18181b', backgroundColor: '#F4F4F5' } : {}
          ]}
        >
          <Icon 
            name={Bookmark} 
            color={isBookmarked ? '#000000' : '#71717a'} 
            size={24} 
            fill={isBookmarked ? '#000000' : 'none'}
          />
        </Button>

        <Button
          variant="default"
          size="lg"
          onPress={handleNext}
          style={styles.nextButton}
          textStyle={styles.nextButtonText}
        >
          {currentIndex === vocabList.length - 1 ? 'Start Quiz' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#71717a',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonCta: {
    width: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    marginTop: 8,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressOuter: {
    flex: 1,
    height: 12,
    backgroundColor: '#E4E4E7',
    borderRadius: 6,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    minWidth: 42,
    textAlign: 'right',
  },
  categoryContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#71717a',
    letterSpacing: 1.5,
  },
  vocabCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    padding: 32,
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  partOfSpeechTag: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 24,
  },
  partOfSpeechText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#71717a',
    letterSpacing: 0.5,
  },
  largeWord: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 24,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#E4E4E7',
    marginBottom: 24,
  },
  translation: {
    fontSize: 24,
    fontWeight: '600',
    color: '#27272a',
    textAlign: 'center',
    marginBottom: 36,
  },
  speakerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
  },
  bookmarkButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  nextButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
