import React, { useEffect, useState } from 'react';
import RootNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';


export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
        <RootNavigator />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D'
  },
});
