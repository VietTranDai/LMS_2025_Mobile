import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export default function Button({
                                   title,
                                   onPress,
                                   variant = 'primary',
                                   size = 'medium',
                                   disabled = false,
                                   loading = false,
                                   style,
                                   textStyle,
                                   leftIcon,
                                   rightIcon
                               }: ButtonProps) {
    const theme = useAppTheme();

    // Get button styles based on variant
    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                };
            case 'secondary':
                return {
                    backgroundColor: theme.secondary,
                    borderColor: theme.secondary,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: theme.primary,
                    borderWidth: 1,
                };
            case 'text':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    paddingHorizontal: 0,
                };
            default:
                return {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                };
        }
    };

    // Get text color based on variant
    const getTextColor = () => {
        switch (variant) {
            case 'primary':
            case 'secondary':
                return '#FFFFFF';
            case 'outline':
            case 'text':
                return theme.primary;
            default:
                return '#FFFFFF';
        }
    };

    // Get button size
    const getButtonSize = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                };
            case 'medium':
                return {
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                };
            case 'large':
                return {
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                };
            default:
                return {
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                };
        }
    };

    // Get text size
    const getTextSize = () => {
        switch (size) {
            case 'small':
                return 14;
            case 'medium':
                return 16;
            case 'large':
                return 18;
            default:
                return 16;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                getButtonSize(),
                disabled || loading ? { opacity: 0.7 } : {},
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={getTextColor()}
                    size="small"
                />
            ) : (
                <>
                    {leftIcon && <span style={styles.leftIcon}>{leftIcon}</span>}
                    <Text
                        style={[
                            styles.text,
                            { color: getTextColor(), fontSize: getTextSize() },
                            textStyle
                        ]}
                    >
                        {title}
                    </Text>
                    {rightIcon && <span style={styles.rightIcon}>{rightIcon}</span>}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    text: {
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
    },
    leftIcon: {
        marginRight: 8,
    },
    rightIcon: {
        marginLeft: 8,
    }
});