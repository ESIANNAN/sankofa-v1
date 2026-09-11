import React from 'react';
import { Colors } from '@/theme/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const colorScheme = useColorScheme() || 'light';

  const backgroundColor =
    colorScheme === 'dark'
      ? Colors.dark.background
      : Colors.light.background;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {children}
    </View>
  );
};