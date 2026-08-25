import { Onboarding, OnboardingStep } from '@/components/ui/onboarding';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const StepIcon = ({
  name,
  bgColor,
  iconColor,
}: {
  name: string;
  bgColor: string;
  iconColor: string;
}) => (
  <View
    style={{
      padding: 18,
      backgroundColor: bgColor,
      borderRadius: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }}
  >
    <Feather name={name as any} size={56} color={iconColor} />
  </View>
);

export default function IntroOnboarding() {
  const steps: OnboardingStep[] = [
    {
      id: '1',
      title: 'Choose Your Language',
      description:
        'Learn Asante Twi, Fante, Ga, or Ewe-four of Ghana\'s most spoken languages, all in one app.',
      icon: (
        <StepIcon
          name="book-open"
          bgColor="#ede9fe"
          iconColor="#7c3aed"
        />
      ),
    },
    {
      id: '2',
      title: 'Learn Through Culture',
      description:
        'Every word comes with cultural context, proverbs, history, and meaning not just translation.',
      icon: (
        <StepIcon
          name="layers"
          bgColor="#dcfce7"
          iconColor="#16a34a"
        />
      ),
    },
    {
      id: '3',
      title: 'Earn XP and Stay Consistent',
      description:
        'Build a daily streak, earn XP, unlock badges, and climb the leaderboard as you improve.',
      icon: (
        <StepIcon
          name="target"
          bgColor="#fef3c7"
          iconColor="#d97706"
        />
      ),
    },
  ];

  const goToAuth = () => {
    router.replace('/signup');
  };

  return (
    <Onboarding
      steps={steps}
      onComplete={goToAuth}
      onSkip={goToAuth}
      swipeEnabled={false}
      showProgress={true}
      primaryButtonText="Start Using App"
      nextButtonText="Next Lesson"
      skipButtonText="Skip Tutorial"
    />
  );
}