import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { Text } from './components/Themed';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const openAuthSession = async () => {
    try {
      let result = await WebBrowser.openAuthSessionAsync(
        // We add `?` at the end of the URL since the test backend that is used
        // just appends `authToken=<token>` to the URL provided.
        `https://notes-rn.herokuapp.com/google-login/?linkingUri=${Linking.createURL(
          '/?'
        )}`,
        Linking.createURL('/?')
      );
      console.log(result);
      let redirectData;
      // if (result.url) {
      //   redirectData = Linking.parse(result.url);
      // }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
        <Text onPress={openAuthSession}>Auth</Text>
      </SafeAreaProvider>
    );
  }
}
