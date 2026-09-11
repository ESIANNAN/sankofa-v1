import { Colors } from '@/theme/colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useColor(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
  props?: { light?: string; dark?: string }
) {
  const currentScheme = useColorScheme();
  const theme: 'light' | 'dark' = currentScheme === 'dark' ? 'dark' : 'light';
  const colorFromProps = props?.[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
