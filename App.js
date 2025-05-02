import React, { useEffect, useState } from 'react';
import RootNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { UserProvider } from './src/context/UserContext';


export default function App() {

  return (
      <GestureHandlerRootView style={styles.container}>
      <UserProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </UserProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D'
  },
});
