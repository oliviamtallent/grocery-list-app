import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, View, Text, Image, Appearance } from 'react-native';
import { useTheme, ThemeProvider, ThemeContext } from './src/theme/ThemeProvider';
import { NavigationContainer, usePreventRemoveContext } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { MainScreen } from './components/MainScreen.js';
import * as Keychain from "react-native-keychain";
import firestore from '@react-native-firebase/firestore';
import DataHandler from "./components/DataHandler";
import { lightColors } from './src/theme/colors';
import auth from '@react-native-firebase/auth';
import DatabaseHandler from './components/DatabaseHandler';

const Stack = createNativeStackNavigator();

export default function App() {
  /* theme values */
  const styles = makeStyles(lightColors);

  const [initialRoute, setInitialRoute] = React.useState(null);
  const [user, setUser] = React.useState(null);
  function onAuthStateChanged(userParam) {
    setUser(userParam)
    if(!userParam) {
      setInitialRoute('Login') 
    } else {
      if (userParam.displayName != null) {
        DataHandler.setUID(userParam.uid)
        DataHandler.setUsername(userParam.displayName)
        DatabaseHandler.setUsername(userParam.displayName)
      }
      setInitialRoute('Main')
    }
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [])

  return initialRoute != null ? (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Register" component={RegisterScreen}/>
          <Stack.Screen name="Main" component={MainScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  ) : (
    <View style={styles.container}>
      <Image style={styles.splashImg} source={require('./assets/icon_image.png')}/>
      <Text style={styles.boldText}>Grocery List</Text>
    </View>
  )
}

const makeStyles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  splashImg: {
    resizeMode: 'contain',
    width: '75%',
    height: 200,
    marginHorizontal: 50,
  }
});