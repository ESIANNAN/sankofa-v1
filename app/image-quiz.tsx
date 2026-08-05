import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Volume2,
  CheckCircle2,
  XCircle,
  Award,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '@/services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, getDocs, increment } from 'firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

// Screen Dimensions
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2; // 48 horizontal padding (24 * 2) and 16 gap

// Fallback high-quality curated images from Unsplash to ensure the app is visually stunning immediately
const UNSPLASH_IMAGES: Record<string, string> = {
  // Family
  mother: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  father: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
  uncle: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  aunt: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  brother: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
  // Animals
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80',
  fish: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a02?w=400&q=80',
  eagle: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
  cow: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&q=80',
  // Numbers
  one: 'https://images.unsplash.com/photo-1502685906056-78f7e17c37f0?w=400&q=80',
  two: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&q=80',
  three: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80',
  four: 'https://images.unsplash.com/photo-1542382257-201b7f70ec7a?w=400&q=80',
  five: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
  // General Fallbacks
  woman: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  man: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
  shoe: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  generic: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80'
};

const SUCCESS_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2019/2019-200.wav';
const ERROR_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-200.wav';

interface VocabItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  audioURL: string;
  imageURL?: string;
  imagePath?: string;
  partOfSpeech: string;
  category: string;
  language: string;
}

interface ImageQuizOption {
  label: string;
  imageUrl: string;
  originalItem: VocabItem;
}

interface ImageQuizQuestion {
  id: string;
  word: string;
  pronunciation: string;
  audioURL: string;
  correctAnswerLabel: string;
  options: ImageQuizOption[];
}

// Fallback Mock Vocabulary Data matching lesson.tsx
const MOCK_VOCAB: Record<string, Omit<VocabItem, 'id'>[]> = {
  family: [
    { word: 'Maame', translation: 'Mother', pronunciation: 'Maa-me', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/family/mother.png', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' },
    { word: 'Papa', translation: 'Father', pronunciation: 'Pa-pa', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/family/father.png', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' },
    { word: 'Wɔfa', translation: 'Uncle', pronunciation: 'Wɔ-fa', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/family/uncle.png', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' },
    { word: 'Sewaa', translation: 'Aunt', pronunciation: 'Se-waa', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/family/aunt.png', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' },
    { word: 'Nua barima', translation: 'Brother', pronunciation: 'Nua ba-ri-ma', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/family/brother.png', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' }
  ],
  numbers: [
    { word: 'Baako', translation: 'One', pronunciation: 'Baa-ko', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/numbers/one.png', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' },
    { word: 'Mmienu', translation: 'Two', pronunciation: 'Mmie-nu', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/numbers/two.png', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' },
    { word: 'Mmiɛnsa', translation: 'Three', pronunciation: 'Mmiɛn-sa', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/numbers/three.png', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' },
    { word: 'Nan', translation: 'Four', pronunciation: 'Nan', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/numbers/four.png', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' },
    { word: 'Num', translation: 'Five', pronunciation: 'Num', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/numbers/five.png', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' }
  ],
  animals: [
    { word: 'Kraman', translation: 'Dog', pronunciation: 'Kra-man', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/animals/dog.png', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' },
    { word: 'Apatre', translation: 'Fish', pronunciation: 'A-pa-tre', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/animals/fish.png', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' },
    { word: 'Ɔkɔdeɛ', translation: 'Eagle', pronunciation: 'Ɔ-kɔ-deɛ', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/animals/eagle.png', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' },
    { word: 'Agyinamoa', translation: 'Cat', pronunciation: 'A-gyi-na-moa', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/animals/cat.png', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' },
    { word: 'Nantwie', translation: 'Cow', pronunciation: 'Nan-twie', audioURL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav', imagePath: 'images/animals/cow.png', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' }
  ]
};

// Generates correct Unsplash URLs dynamically if Storage refs fail or are unavailable
const getFallbackImageUrl = (label: string): string => {
  const cleanLabel = label.toLowerCase().trim();
  return UNSPLASH_IMAGES[cleanLabel] || UNSPLASH_IMAGES.generic;
};

export default function ImageQuizScreen() {
  const insets = useSafeAreaInsets();
  const { category, language } = useLocalSearchParams();

  // Normalize parameters
  const currentCategory = (category as string)?.toLowerCase() || 'family';
  const currentLanguage = (language as string) || 'Asante Twi';

  // State Management
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ImageQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ImageQuizOption | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Audio refs
  const pronunciationSoundRef = useRef<Audio.Sound | null>(null);
  const feedbackSoundRef = useRef<Audio.Sound | null>(null);

  // Reanimated Shared Values
  const speakerScale = useSharedValue(1);

  // Clean up sound resources on unmount
  useEffect(() => {
    return () => {
      if (pronunciationSoundRef.current) {
        pronunciationSoundRef.current.unloadAsync().catch(() => {});
      }
      if (feedbackSoundRef.current) {
        feedbackSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Fetch download URL from Firebase Storage with safety fallbacks
  const resolveStorageImage = async (item: Omit<VocabItem, 'id'>): Promise<string> => {
    if (item.imageURL) return item.imageURL;
    
    const storagePath = item.imagePath || `images/${currentCategory}/${item.translation.toLowerCase()}.png`;
    try {
      const imageRef = ref(storage, storagePath);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (err) {
      // Graceful fallback to pre-curated Unsplash URLs so the UI is always beautiful
      return getFallbackImageUrl(item.translation);
    }
  };

  // Generate Image Quiz Questions
  useEffect(() => {
    const loadQuizData = async () => {
      setLoading(true);
      let list: VocabItem[] = [];

      try {
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
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              word: data.word || '',
              translation: data.translation || '',
              pronunciation: data.pronunciation || '',
              audioURL: data.audioURL || '',
              imageURL: data.imageURL || '',
              imagePath: data.imagePath || '',
              partOfSpeech: data.partOfSpeech || 'NOUN',
              category: data.category || currentCategory,
              language: data.language || currentLanguage,
            });
          });
        } else {
          // Fallback to local mock data
          const localMock = MOCK_VOCAB[currentCategory] || MOCK_VOCAB.family;
          list = localMock.map((item, index) => ({
            ...item,
            id: `mock_${index}`,
          }));
        }
      } catch (err) {
        console.warn('Firestore fetch failed for image quiz, using mock data:', err);
        const localMock = MOCK_VOCAB[currentCategory] || MOCK_VOCAB.family;
        list = localMock.map((item, index) => ({
          ...item,
          id: `mock_${index}`,
        }));
      }

      if (list.length < 2) {
        Alert.alert('Quiz Notice', 'Not enough vocabulary words to generate a quiz.', [
          { text: 'Go Back', onPress: () => router.back() }
        ]);
        setLoading(false);
        return;
      }

      // Pre-resolve all image URLs (Firebase Storage or Unsplash fallback)
      const resolvedList = await Promise.all(
        list.map(async (item) => {
          const imageUrl = await resolveStorageImage(item);
          return { ...item, resolvedImageUrl: imageUrl };
        })
      );

      // Generate up to 5 quiz questions
      const generatedQuestions: ImageQuizQuestion[] = [];
      const count = Math.min(resolvedList.length, 5);

      for (let i = 0; i < count; i++) {
        const targetWord = resolvedList[i];
        
        // Correct Option
        const correctOption: ImageQuizOption = {
          label: targetWord.translation,
          imageUrl: targetWord.resolvedImageUrl,
          originalItem: targetWord,
        };

        // Distractors: Filter out the correct option, shuffle others, and take up to 3
        const potentialDistractors = resolvedList.filter(item => item.id !== targetWord.id);
        const shuffledDistractors = potentialDistractors.sort(() => 0.5 - Math.random());
        
        const distractorOptions: ImageQuizOption[] = shuffledDistractors.slice(0, 3).map(item => ({
          label: item.translation,
          imageUrl: item.resolvedImageUrl,
          originalItem: item,
        }));

        // If we don't have enough distractors, populate with generic items
        const genericWords = ['Shoe', 'Man', 'Cat', 'Woman'];
        let fillerIdx = 0;
        while (distractorOptions.length < 3) {
          const fillerLabel = genericWords[fillerIdx % genericWords.length];
          distractorOptions.push({
            label: fillerLabel,
            imageUrl: getFallbackImageUrl(fillerLabel),
            originalItem: {
              id: `filler_${fillerIdx}`,
              word: 'Filler',
              translation: fillerLabel,
              pronunciation: '',
              audioURL: '',
              partOfSpeech: 'NOUN',
              category: currentCategory,
              language: currentLanguage,
            }
          });
          fillerIdx++;
        }

        // Shuffle options grid
        const allOptions = [correctOption, ...distractorOptions].sort(() => 0.5 - Math.random());

        generatedQuestions.push({
          id: `img_q_${i}`,
          word: targetWord.word,
          pronunciation: targetWord.pronunciation,
          audioURL: targetWord.audioURL,
          correctAnswerLabel: targetWord.translation,
          options: allOptions,
        });
      }

      setQuestions(generatedQuestions);
      setLoading(false);

      // Auto-play first word's pronunciation with a slight delay
      if (generatedQuestions.length > 0 && generatedQuestions[0].audioURL) {
        setTimeout(() => {
          playPronunciation(generatedQuestions[0].audioURL);
        }, 800);
      }
    };

    loadQuizData();
  }, [currentCategory, currentLanguage]);

  // Audio Playback Helpers
  const playPronunciation = async (url: string) => {
    if (!url) return;
    
    // Speaker trigger animation
    speakerScale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );

    try {
      if (pronunciationSoundRef.current) {
        await pronunciationSoundRef.current.stopAsync();
        await pronunciationSoundRef.current.unloadAsync();
        pronunciationSoundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      pronunciationSoundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
          pronunciationSoundRef.current = null;
        }
      });
    } catch (error) {
      console.warn('Failed to play audio:', error);
    }
  };

  const playFeedbackSound = async (isCorrect: boolean) => {
    try {
      if (feedbackSoundRef.current) {
        await feedbackSoundRef.current.stopAsync();
        await feedbackSoundRef.current.unloadAsync();
        feedbackSoundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: isCorrect ? SUCCESS_SOUND_URL : ERROR_SOUND_URL },
        { shouldPlay: true }
      );
      feedbackSoundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
          feedbackSoundRef.current = null;
        }
      });
    } catch (error) {
      console.warn('Failed to play feedback sound:', error);
    }
  };

  // User Actions
  const handleBack = () => {
    Alert.alert('Quit Quiz', 'Are you sure you want to quit the quiz? Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => router.replace('/(tabs)/home') }
    ]);
  };

  const handleSelectOption = (option: ImageQuizOption) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCheck = () => {
    if (!selectedOption || isAnswerChecked) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedOption.label === currentQuestion.correctAnswerLabel;

    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      setXpEarned(prev => prev + 10);
      playFeedbackSound(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Auto-advance after 1.5 seconds upon success
      setTimeout(() => {
        handleContinue();
      }, 1500);
    } else {
      setIncorrectCount(prev => prev + 1);
      playFeedbackSound(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleContinue = () => {
    setIsAnswerChecked(false);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Auto-play pronunciation for the next question
      if (questions[nextIndex]?.audioURL) {
        setTimeout(() => {
          playPronunciation(questions[nextIndex].audioURL);
        }, 500);
      }
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = async () => {
    setIsQuizComplete(true);
    
    // Save cumulative stats to local storage and Firestore
    try {
      const storedXP = await AsyncStorage.getItem('user_xp') || '0';
      const newXP = parseInt(storedXP) + xpEarned;
      await AsyncStorage.setItem('user_xp', newXP.toString());

      // Update Firestore user profile
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          xp: increment(xpEarned),
          lessonsCompleted: increment(1),
        }, { merge: true });
      }

      // Update lesson progress to 100% since they finished the quiz
      await AsyncStorage.setItem(`progress_${currentCategory}`, '100');
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const progressRef = doc(db, 'users', userId, 'progress', currentCategory);
        await setDoc(progressRef, {
          progress: 100,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Failed to update stats on quiz completion:', err);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleFinish = () => {
    router.replace('/(tabs)/home');
  };

  // Reanimated Styles
  const speakerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: speakerScale.value }],
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18181b" />
        <Text style={styles.loadingText}>Loading image quiz...</Text>
      </View>
    );
  }

  // Quiz Completed View
  if (isQuizComplete) {
    const totalQuestions = questions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return (
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={styles.completionContent}>
          <Text style={styles.trophyEmoji}>🏆</Text>
          
          <Text variant="heading" style={styles.congratsTitle}>Quiz Completed!</Text>
          <Text style={styles.congratsSubtitle}>
            Excellent practice! You are getting closer to mastering {currentLanguage}.
          </Text>

          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{correctCount} / {totalQuestions}</Text>
              <Text style={styles.statLabel}>CORRECT</Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>+{xpEarned}</Text>
              <Text style={styles.statLabel}>XP GAINED</Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{accuracy}%</Text>
              <Text style={styles.statLabel}>ACCURACY</Text>
            </Card>
          </View>
        </View>

        <Button
          variant="default"
          size="lg"
          onPress={handleFinish}
          style={styles.footerButton}
        >
          Finish
        </Button>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0;

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

        {/* XP Reward Display */}
        <View style={styles.xpBadge}>
          <Icon name={Award} color="#FF9500" size={16} />
          <Text style={styles.xpText}>+{xpEarned} XP</Text>
        </View>
      </View>

      {/* Question Header Section */}
      <View style={styles.questionSection}>
        {/* Speaker Button */}
        <TouchableOpacity
          onPress={() => playPronunciation(currentQuestion.audioURL)}
          activeOpacity={0.7}
        >
          <Animated.View style={[styles.speakerButton, speakerAnimatedStyle]}>
            <Icon name={Volume2} color="#000000" size={32} />
          </Animated.View>
        </TouchableOpacity>

        {/* Asante Twi Word */}
        <Text style={styles.targetWord}>{currentQuestion.word}</Text>
        {currentQuestion.pronunciation ? (
          <Text style={styles.pronunciationLabel}>[{currentQuestion.pronunciation}]</Text>
        ) : null}
        
        {/* Helper instruction */}
        <Text style={styles.questionInstruction}>Select the correct image</Text>
      </View>

      {/* Answer Grid (2x2) */}
      <View style={styles.gridContainer}>
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption?.label === option.label;
          const isCorrectAns = option.label === currentQuestion.correctAnswerLabel;

          let cardBorderColor = '#E4E4E7';
          let cardBgColor = '#FFFFFF';
          let textColor = '#27272a';

          // Visual Feedback styles
          if (isSelected) {
            cardBorderColor = '#000000';
            cardBgColor = '#F4F4F5';
          }

          if (isAnswerChecked) {
            if (isCorrectAns) {
              // Highlight correct answer in green
              cardBorderColor = '#22c55e';
              cardBgColor = '#f0fdf4';
              textColor = '#15803d';
            } else if (isSelected) {
              // Selected option is incorrect, color it red
              cardBorderColor = '#ef4444';
              cardBgColor = '#fef2f2';
              textColor = '#b91c1c';
            }
          }

          return (
            <TouchableOpacity
              key={`${currentQuestion.id}_opt_${idx}`}
              onPress={() => handleSelectOption(option)}
              activeOpacity={isAnswerChecked ? 1 : 0.8}
              style={{ width: CARD_WIDTH, marginBottom: 16 }}
            >
              <Card
                style={[
                  styles.optionCard,
                  {
                    borderColor: cardBorderColor,
                    backgroundColor: cardBgColor,
                  },
                ]}
              >
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: option.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.cardLabelContainer}>
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {option.label}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Banner & Validation Buttons */}
      <View style={styles.footerSection}>
        {isAnswerChecked ? (
          <View style={[styles.banner, isAnswerCorrect ? styles.bannerCorrect : styles.bannerIncorrect]}>
            <View style={styles.bannerHeader}>
              <Icon 
                name={isAnswerCorrect ? CheckCircle2 : XCircle} 
                color={isAnswerCorrect ? '#15803d' : '#b91c1c'} 
                size={24} 
              />
              <Text style={[styles.bannerTitle, { color: isAnswerCorrect ? '#15803d' : '#b91c1c' }]}>
                {isAnswerCorrect ? 'Correct! Well done.' : 'Incorrect.'}
              </Text>
            </View>
            {!isAnswerCorrect && (
              <Text style={styles.bannerCorrectAnswer}>
                Correct answer: {currentQuestion.correctAnswerLabel}
              </Text>
            )}
            
            {/* Show Continue button on incorrect answers (correct answers auto-advance) */}
            {!isAnswerCorrect && (
              <Button
                variant="default"
                size="lg"
                onPress={handleContinue}
                style={[styles.footerButton, { marginTop: 12 }]}
              >
                Continue
              </Button>
            )}
          </View>
        ) : (
          <Button
            variant="default"
            size="lg"
            onPress={handleCheck}
            disabled={!selectedOption}
            style={[styles.footerButton, !selectedOption ? styles.buttonDisabled : {}]}
          >
            Check
          </Button>
        )}
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
    fontWeight: '500',
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
    height: 10,
    backgroundColor: '#E4E4E7',
    borderRadius: 5,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 5,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9500',
  },
  questionSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  speakerButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  targetWord: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
  },
  pronunciationLabel: {
    fontSize: 16,
    color: '#71717a',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  questionInstruction: {
    fontSize: 16,
    color: '#71717a',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  optionCard: {
    width: '100%',
    padding: 0,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardImageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: '#F4F4F5',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardLabelContainer: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  footerSection: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
  },
  footerButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  banner: {
    borderRadius: 20,
    padding: 16,
    width: '100%',
  },
  bannerCorrect: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
  },
  bannerIncorrect: {
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderColor: '#fecaca',
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  bannerCorrectAnswer: {
    fontSize: 14,
    color: '#7f1d1d',
    marginTop: 4,
    paddingLeft: 32,
    fontWeight: '500',
  },
  completionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  trophyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  congratsSubtitle: {
    fontSize: 16,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    maxWidth: 300,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#F4F4F5',
    borderColor: '#E4E4E7',
    borderWidth: 1,
    borderRadius: 16,
    shadowOpacity: 0,
    elevation: 0,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#71717a',
    letterSpacing: 0.5,
  },
});
