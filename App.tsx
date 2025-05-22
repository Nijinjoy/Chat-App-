import React from 'react';
import RootNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, ViewStyle } from 'react-native';
import {Provider} from 'react-redux'
import store from './src/redux/store';

export default function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
      <RootNavigator />
      <StatusBar style="auto" />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D',
  } as ViewStyle,
});
