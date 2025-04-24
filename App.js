import React, { useEffect, useState } from 'react';
import RootNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { UserProvider } from './src/context/UserContext';


export default function App() {

  return (
    <UserProvider>
      <GestureHandlerRootView style={styles.container}>
        <RootNavigator />
        <StatusBar style="auto" />
    </GestureHandlerRootView>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D'
  },
});
