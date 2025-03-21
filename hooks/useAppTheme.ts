import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';

/**
 * Custom hook to access the current theme colors
 * @returns The current theme's color palette
 */
export function useAppTheme() {
    const { colorScheme } = useTheme();
    return Colors[colorScheme || 'light'];
}