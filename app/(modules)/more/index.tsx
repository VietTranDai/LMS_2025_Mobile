import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MoreScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>More Options</Text>
            <Text style={styles.subtitle}>Settings and additional features</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F9FC',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#62656b',
    },
});