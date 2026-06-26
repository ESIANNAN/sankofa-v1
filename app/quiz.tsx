import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/services/firebase';
import { collection, doc, setDoc, getDocs, increment } from 'firebase/firestore';

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

interface Question {
  id: string;
  type: 'word-to-translation' | 'translation-to-word';
  questionText: string;
  target: string;
  correctAnswer: string;
  options: string[];
}

const MOCK_VOCAB: Record<string, Omit<VocabItem, 'id'>[]> = {
  family: [
    { word: 'Maame', translation: 'Mother', pronunciation: 'Maa-me', audioURL: '', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' },
    { word: 'Papa', translation: 'Father', pronunciation: 'Pa-pa', audioURL: '', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' },
    { word: 'Wɔfa', translation: 'Uncle', pronunciation: 'Wɔ-fa', audioURL: '', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' },
    { word: 'Sewaa', translation: 'Aunt', pronunciation: 'Se-waa', audioURL: '', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' },
    { word: 'Nua barima', translation: 'Brother', pronunciation: 'Nua ba-ri-ma', audioURL: '', partOfSpeech: 'NOUN', category: 'family', language: 'Asante Twi' }
  ],
  numbers: [
    { word: 'Baako', translation: 'One', pronunciation: 'Baa-ko', audioURL: '', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' },
    { word: 'Mmienu', translation: 'Two', pronunciation: 'Mmie-nu', audioURL: '', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' },
    { word: 'Mmiɛnsa', translation: 'Three', pronunciation: 'Mmiɛn-sa', audioURL: '', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' },
    { word: 'Nan', translation: 'Four', pronunciation: 'Nan', audioURL: '', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' },
    { word: 'Num', translation: 'Five', pronunciation: 'Num', audioURL: '', partOfSpeech: 'NOUN', category: 'numbers', language: 'Asante Twi' }
  ],
  animals: [
    { word: 'Kraman', translation: 'Dog', pronunciation: 'Kra-man', audioURL: '', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' },
    { word: 'Apatre', translation: 'Fish', pronunciation: 'A-pa-tre', audioURL: '', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' },
    { word: 'Ɔkɔdeɛ', translation: 'Eagle', pronunciation: 'Ɔ-kɔ-deɛ', audioURL: '', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' },
    { word: 'Agyinamoa', translation: 'Cat', pronunciation: 'A-gyi-na-moa', audioURL: '', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' },
    { word: 'Nantwie', translation: 'Cow', pronunciation: 'Nan-twie', audioURL: '', partOfSpeech: 'NOUN', category: 'animals', language: 'Asante Twi' }
  ]
};

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const { category, language } = useLocalSearchParams();

  // Normalize parameters
  const currentCategory = (category as string)?.toLowerCase() || 'family';
  const currentLanguage = (language as string) || 'Asante Twi';

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Generate quiz questions
  useEffect(() => {
    const loadQuizData = async () => {
      setLoading(true);
      let list: Omit<VocabItem, 'id'>[] = [];
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
              word: data.word || '',
              translation: data.translation || '',
              pronunciation: data.pronunciation || '',
              audioURL: data.audioURL || '',
              partOfSpeech: data.partOfSpeech || 'NOUN',
              category: data.category || currentCategory,
              language: data.language || currentLanguage,
            });
          });
        } else {
          list = MOCK_VOCAB[currentCategory] || MOCK_VOCAB.family;
        }
      } catch (err) {
        list = MOCK_VOCAB[currentCategory] || MOCK_VOCAB.family;
      }

      if (list.length < 2) {
        Alert.alert('Quiz Notice', 'Not enough vocabulary words to generate a quiz.', [
          { text: 'Go Back', onPress: () => router.back() }
        ]);
        setLoading(false);
        return;
      }

      // Generate 5 questions (or list.length if less than 5)
      const generatedQuestions: Question[] = [];
      const count = Math.min(list.length, 5);

      for (let i = 0; i < count; i++) {
        const targetWord = list[i];
        const isWordToTranslation = Math.random() > 0.5;

        // Choose options
        const allTranslations = list.map(item => item.translation);
        const allWords = list.map(item => item.word);

        let options: string[] = [];
        let correctAnswer = '';
        let target = '';
        let questionText = '';

        if (isWordToTranslation) {
          correctAnswer = targetWord.translation;
          target = targetWord.word;
          questionText = 'What does this word mean?';

          // Pick 3 distractor translations (excluding correct answer)
          const distractors = allTranslations.filter(t => t !== correctAnswer);
          const shuffledDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
          options = [correctAnswer, ...shuffledDistractors].sort(() => 0.5 - Math.random());
        } else {
          correctAnswer = targetWord.word;
          target = targetWord.translation;
          questionText = 'How do you say this in Asante Twi?';

          // Pick 3 distractor words (excluding correct answer)
          const distractors = allWords.filter(w => w !== correctAnswer);
          const shuffledDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
          options = [correctAnswer, ...shuffledDistractors].sort(() => 0.5 - Math.random());
        }

        generatedQuestions.push({
          id: `q_${i}`,
          type: isWordToTranslation ? 'word-to-translation' : 'translation-to-word',
          questionText,
          target,
          correctAnswer,
          options,
        });
      }

      setQuestions(generatedQuestions);
      setLoading(false);
    };

    loadQuizData();
  }, [currentCategory, currentLanguage]);

  const handleBack = () => {
    Alert.alert('Quit Quiz', 'Are you sure you want to quit the quiz? Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => router.replace('/(tabs)/home') }
    ]);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCheck = () => {
    if (!selectedOption) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setScore(prev => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleContinue = async () => {
    setIsAnswerChecked(false);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz complete! Save XP and complete states
      setIsQuizComplete(true);
      
      try {
        const currentXP = await AsyncStorage.getItem('user_xp') || '0';
        const newXP = parseInt(currentXP) + 50;
        await AsyncStorage.setItem('user_xp', newXP.toString());

        // Increment XP and Lesson stats in Firestore
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const userRef = doc(db, 'users', userId);
          await setDoc(userRef, {
            xp: increment(50),
            lessonsCompleted: increment(1),
          }, { merge: true });
        }
      } catch (err) {
        console.warn('Failed to update stats on quiz completion:', err);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleFinish = () => {
    router.replace('/(tabs)/home');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Generating your quiz...</Text>
      </View>
    );
  }

  if (isQuizComplete) {
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={styles.completionContent}>
          <Text style={styles.trophyEmoji}>🏆</Text>
          
          <Text variant="heading" style={styles.congratsTitle}>Quiz Completed!</Text>
          <Text style={styles.congratsSubtitle}>
            Great job! You are making excellent progress in learning {currentLanguage}.
          </Text>

          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{score} / {questions.length}</Text>
              <Text style={styles.statLabel}>CORRECT</Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>+50</Text>
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
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

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
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      {/* Question Card */}
      <View style={styles.questionSection}>
        <Text style={styles.questionLabel}>{currentQuestion.questionText}</Text>
        <Text style={styles.targetWord}>{currentQuestion.target}</Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer = option === currentQuestion.correctAnswer;
          
          let cardStyle = styles.optionCard;
          let textStyle = styles.optionText;

          if (isSelected) {
            cardStyle = { ...cardStyle, ...styles.optionCardSelected };
            textStyle = { ...textStyle, ...styles.optionTextSelected };
          }

          if (isAnswerChecked) {
            if (isCorrectAnswer) {
              cardStyle = { ...cardStyle, ...styles.optionCardCorrect };
              textStyle = { ...textStyle, ...styles.optionTextCorrect };
            } else if (isSelected && !isAnswerCorrect) {
              cardStyle = { ...cardStyle, ...styles.optionCardIncorrect };
              textStyle = { ...textStyle, ...styles.optionTextIncorrect };
            }
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectOption(option)}
              activeOpacity={0.8}
              style={styles.optionContainer}
            >
              <Card style={cardStyle}>
                <Text style={textStyle}>{option}</Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Banner / Buttons */}
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
                Correct answer: {currentQuestion.correctAnswer}
              </Text>
            )}
            <Button
              variant="default"
              size="lg"
              onPress={handleContinue}
              style={[styles.footerButton, { marginTop: 12 }]}
            >
              Continue
            </Button>
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
    fontSize: 16,
    color: '#71717a',
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
  questionSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  questionLabel: {
    fontSize: 16,
    color: '#71717a',
    fontWeight: '700',
    marginBottom: 8,
  },
  targetWord: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
  },
  optionsList: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  optionContainer: {
    width: '100%',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowOpacity: 0,
    elevation: 0,
  },
  optionCardSelected: {
    borderColor: '#000000',
    backgroundColor: '#F4F4F5',
  },
  optionCardCorrect: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  optionCardIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27272a',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#000000',
  },
  optionTextCorrect: {
    color: '#15803d',
  },
  optionTextIncorrect: {
    color: '#b91c1c',
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
