import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { getItem, setItem } from '@/utils/asyncStorage';

type ThemeContextType = {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    colorScheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
        Appearance.getColorScheme() || 'light'
    );

    useEffect(() => {
        // Load saved theme preference
        const loadTheme = async () => {
            try {
                const savedTheme = await getItem<'light' | 'dark' | 'system'>('@theme');
                if (savedTheme) {
                    setThemeState(savedTheme);
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
            }
        };

        loadTheme();

        // Listen for appearance changes
        const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
            if (theme === 'system' && newColorScheme) {
                setColorScheme(newColorScheme as 'light' | 'dark');
            }
        });

        return () => {
            subscription.remove();
        };
    }, [theme]);

    useEffect(() => {
        // Update color scheme when theme changes
        if (theme === 'system') {
            setColorScheme(Appearance.getColorScheme() as 'light' | 'dark' || 'light');
        } else {
            setColorScheme(theme);
        }
    }, [theme]);

    const setTheme = async (newTheme: 'light' | 'dark' | 'system') => {
        setThemeState(newTheme);
        await setItem('@theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};