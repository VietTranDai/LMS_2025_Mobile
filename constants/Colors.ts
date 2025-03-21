// Define theme colors for the application
const tintColorLight = '#FF6B00';
const tintColorDark = '#FF8F3F';

export default {
    light: {
        primary: '#FF6B00',
        secondary: '#2962FF',
        tertiary: '#00695C',

        background: '#FFFFFF',
        backgroundSecondary: '#F7F9FC',
        card: '#FFFFFF',

        text: '#333333',
        textSecondary: '#666666',
        textTertiary: '#999999',

        border: '#E1E4E8',
        divider: '#EEEEEE',

        inputBackground: '#F7F9FC',
        inputText: '#333333',
        inputPlaceholder: '#999999',

        tint: tintColorLight,
        tabIconDefault: '#CCCCCC',
        tabIconSelected: tintColorLight,

        // Status colors
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#D32F2F',
        info: '#2196F3',

        // Additional colors
        overlay: 'rgba(0, 0, 0, 0.5)',
        shadow: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
        primary: '#FF8F3F',
        secondary: '#448AFF',
        tertiary: '#26A69A',

        background: '#121212',
        backgroundSecondary: '#1E1E1E',
        card: '#1E1E1E',

        text: '#FFFFFF',
        textSecondary: '#A0A0A0',
        textTertiary: '#666666',

        border: '#333333',
        divider: '#2A2A2A',

        inputBackground: '#1E1E1E',
        inputText: '#FFFFFF',
        inputPlaceholder: '#666666',

        tint: tintColorDark,
        tabIconDefault: '#666666',
        tabIconSelected: tintColorDark,

        // Status colors
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#EF5350',
        info: '#42A5F5',

        // Additional colors
        overlay: 'rgba(0, 0, 0, 0.7)',
        shadow: 'rgba(0, 0, 0, 0.3)',
    },
};