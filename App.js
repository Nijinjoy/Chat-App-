import React, { useEffect, useState } from 'react';
import RootNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '@react-navigation/native';
import { ThemeProvider } from './src/contexts/ThemeContext';


export default function App() {
  return (
    <ThemeProvider>
    <GestureHandlerRootView style={styles.container}>
        <RootNavigator />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D'
  },
});
