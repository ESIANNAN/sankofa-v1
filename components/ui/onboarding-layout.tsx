import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { View } from '@/components/ui/view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export function OnboardingLayout({
  children,
  backgroundColor = '#FAFAFA',
}: OnboardingLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor,
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      {children}
      <AvoidKeyboard offset={20} />
    </View>
  );
}