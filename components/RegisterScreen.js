import * as React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Modal, Appearance } from 'react-native';
import { Icon, Tooltip } from 'react-native-elements'
import { useTheme } from '../src/theme/ThemeProvider';
import firestore from '@react-native-firebase/firestore';
import APP_CONSTANTS from '../src/strings';
import auth from '@react-native-firebase/auth';
import DatabaseHandler from './DatabaseHandler';

export function RegisterScreen({navigation}) {
  /* theme values */
  const { dark, colors, setScheme } = useTheme();
  const styles = makeStyles(colors);
  
  /* input values */
  const [success, onShowSuccess] = React.useState(false);
  const [username, onChangeUsername] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);
  const [email, onChangeEmail] = React.useState(null);
  const [usernameError, onChangeUsernameError] = React.useState(null);
  const [passwordError, onChangePasswordError] = React.useState(null);
  const [emailError, onChangeEmailError] = React.useState(null);

  /* focus values */
  const username_ref = React.useRef();
  const password_ref = React.useRef();
  
  /* database accessor methods */
  const register = () => {
    onChangeUsernameError(null)
    onChangePasswordError(null)
    onChangeEmailError(null)
    if (email === null || email.length === 0) {
      onChangeEmailError("Please enter an email")
    } else if (username === null || username.length === 0) {
      onChangeUsernameError("Please enter a username")
    } else if (password === null || password.length === 0) {
      onChangePasswordError("Please enter a password")
    } else if (password.length < 6) {
      onChangePasswordError("Password must be at least 6 characters long.")
    } else {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(email)) {
        createUser()
      } else {
        onChangeEmailError('Please enter a valid email.')
      }
    }
  }

  const createUser = () => {
    firestore()
      .collection('Users')
      .where('username','==',username)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          DatabaseHandler.setUsername(username);
          firestore()
            .collection('Users')
            .add({
              username: username,
            })
            .then(() => {
              auth()
                .createUserWithEmailAndPassword(email, password)
                .then((result) => {      
                  result.user.updateProfile({
                      displayName: username
                  }).then(() => {
                    onChangeUsername(null);
                    onChangeEmail(null);
                    onChangePassword(null);
                    onShowSuccess(true);
                  })
                })
           })
        } else {
          onChangeUsernameError('Username is unavaliable.')
        }
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Register</Text>
        <View style={[styles.input,{borderColor: emailError ? colors.accent : colors.border}]}>
          <Icon style={styles.inputIcon} name='email' color={colors.text}/>
          <TextInput
            style={styles.inputText}
            onChangeText={onChangeEmail}
            value={email}
            type='email'
            placeholder={APP_CONSTANTS.EMAIL_HINT}
            underlineColorAndroid ='transparent'
            returnKeyType='next'
            onSubmitEditing={() => username_ref.current.focus()}
          />
        </View>
        {emailError != null && (
          <Text style={styles.errorText}>{emailError}</Text>
        )}
        <View style={[styles.input,{borderColor: usernameError ? colors.accent : colors.border}]}>
          <Icon style={styles.inputIcon} name='person' color={colors.text}/>
          <TextInput
            style={styles.inputText}
            onChangeText={onChangeUsername}
            value={username}
            placeholder={APP_CONSTANTS.USERNAME_HINT}
            underlineColorAndroid ='transparent'
            returnKeyType='next'
            ref={username_ref}
            onSubmitEditing={() => password_ref.current.focus()}
          />
        </View>
        {usernameError != null && (
          <Text style={styles.errorText}>{usernameError}</Text>
        )}
        <View style={[styles.input,{borderColor: passwordError ? colors.accent : colors.border}]}>
          <Icon style={styles.inputIcon} name='lock' color={colors.text}/>
          <TextInput
            style={styles.inputText}
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={true}
            placeholder={APP_CONSTANTS.PASSWORD_HINT}
            ref={password_ref}
          />
        </View>
        {passwordError != null && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}
        <TouchableOpacity style={styles.regBtn} onPress={() => register()}>
          <Text style={styles.btnText}>{APP_CONSTANTS.REGISTER}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.plainText}>{APP_CONSTANTS.ALREADY_ACCOUNT}</Text>
          <Text style={styles.boldText}>{APP_CONSTANTS.LOGIN}</Text>
        </TouchableOpacity>
      </View>
      <Image style={styles.headerImg} source={require('../assets/register-image.png')}/>
      <Modal transparent={true} visible={success}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={[styles.header,{marginTop: 10, marginStart: 10}]}>{"Joined Grocery List!"}</Text>
            <Text style={[styles.plainText,{marginStart: 10}]}>{APP_CONSTANTS.HELP_INFO}</Text>
            <View style={styles.horizLine}/>
            <TouchableOpacity style={styles.modalBtn} onPress={() => {onShowSuccess(false),navigation.navigate('Main')}}>
              <Text style={[styles.plainText,{fontWeight: 'bold'}]}>{APP_CONSTANTS.OK}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}


const makeStyles = (colors) => StyleSheet.create({
  /* containers */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainer: {
    backgroundColor:  colors.primary,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    height: '100%',
    marginTop: 170,
  },
  input: {
    flexDirection: 'row',
    height: 55,
    marginTop: 15,
    marginHorizontal: 40,
    borderWidth: 2,
    borderRadius: 7,
    borderColor: colors.border,
    alignItems: 'center'
  },
  modal: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    marginHorizontal: 50,
  },
  modalBg: {
    backgroundColor: colors.translucent,
    flex: 1,
    justifyContent: 'center',
  },

  /* text */
  header: {
    fontWeight: 'bold',
    fontSize: colors.headerTextSize,
    marginTop: 45,
    marginBottom: 10,
    marginStart: 30,
    color: colors.text,
  },
  inputText: {
    fontSize: colors.textSize,
    flex: 1,
  },
  plainText: {
    fontSize: colors.textSize,
    color: colors.text,
  },
  boldText: {
    fontSize: colors.textSize,
    fontWeight: 'bold',
    color: colors.accent,
  },
  errorText: {
    fontSize: colors.textSize,
    color: colors.accent,
    marginStart: 45,
    marginTop:5,
  },
  
  /* buttons */
  regBtn: {
    height: 50,
    paddingStart: 10,
    marginTop: 30,
    marginHorizontal: 80,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontSize: colors.textSize,
    fontWeight: 'bold',
    color: colors.primary,
  },
  switchBtn: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  modalBtn: {
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  /* other views */
  headerImg: {
    marginStart: 15,
    width: 150, 
    height: 190, 
    marginTop: 20,
    position: 'absolute',
    resizeMode: 'contain',
  },
  inputIcon: {
    marginHorizontal: 10,
    opacity: .36,
  },
  joinIcon: {
    marginEnd: 10,
    opacity: .36,
  },
  horizLine: {
    backgroundColor: colors.border,
    marginTop: 10,
    height: 2,
  },
});