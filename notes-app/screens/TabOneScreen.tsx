import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const openAuthSession = async () => {
    try {
      let result = await WebBrowser.openAuthSessionAsync(
        // We add `?` at the end of the URL since the test backend that is used
        // just appends `authToken=<token>` to the URL provided.
        `https://notes-rn.herokuapp.com/google-login/?redirect=${Linking.createURL(
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <EditScreenInfo path='/screens/TabOneScreen.tsx' />
      <Text onPress={openAuthSession}>Auth</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
