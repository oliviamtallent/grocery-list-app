import * as React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Appearance, Modal } from 'react-native';
import { Icon } from 'react-native-elements'
import { useTheme } from '../src/theme/ThemeProvider';
import APP_CONSTANTS from '../src/strings';
import auth from '@react-native-firebase/auth';
 
export function LoginScreen({navigation}) {
  /* theme values */
  const { dark, colors, setScheme } = useTheme();
  const styles = makeStyles(colors);

  /* input values */
  const [email, onChangeEmail] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);
  const [emailError, onChangeEmailError] = React.useState(null);
  const [passwordError, onChangePasswordError] = React.useState(null);
  const [forgot, showForgotPass] = React.useState(null);

  /* focus values */
  const password_ref = React.useRef();

  /* database access methods */
  const login = () => {
    onChangeEmailError(null)
    onChangePasswordError(null)
    if (email === null || email.length === 0) {
      onChangeEmailError("Please enter an email")
    } else if (password === null || password.length === 0) {
      onChangePasswordError("Please enter a password")
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          onChangeEmail(null)
          onChangePassword(null)
          navigation.navigate('Main')
        })
        .catch(error => {
          if (error.code === 'auth/invalid-email') {
            onChangeEmailError('Please enter a vaild email.')
          }

          if (error.code === 'auth/wrong-password') {
            onChangePasswordError('Password is incorrect.')
          }

          if (error.code === 'auth/user-not-found') {
            onChangeEmailError('User does not exist.')
          }

          console.error(error);
        });
    }
  }

  const resetPass = () => {
    onChangeEmailError(null)
    onChangePasswordError(null)

    if (email === null || email.length == 0) {
      onChangeEmailError('Enter an email address to reset password.')
    } else {
      auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        showForgotPass(true)
      })
      .catch(error => {
        if (error.code == 'auth/invalid-email') {
          onChangeEmailError('Please enter a valid email.')
        }

        if (error.code === 'auth/user-not-found') {
          onChangeEmailError('User does not exist.')
        }
        console.log(error)
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.header}>{APP_CONSTANTS.LOGIN}</Text>
        <View style={[styles.input,{borderColor: emailError ? colors.accent : colors.border}]}>
          <Icon style={styles.inputIcon} name='person' color={colors.text}/>
          <TextInput
            style={styles.inputText}
            onChangeText={onChangeEmail}
            value={email}
            returnKeyType={'next'}
            placeholder={APP_CONSTANTS.EMAIL_HINT}
            underlineColorAndroid ='transparent'
            onSubmitEditing={() => password_ref.current.focus()}
          />
        </View>
        {emailError != null && (
          <Text style={styles.errorText}>{emailError}</Text>
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
        <View style={{flexDirection: 'row', marginTop: 5, justifyContent: 'space-between'}}>
          <Text style={[styles.errorText,{ height: passwordError != null ? '100%' : 0}]}>{passwordError}</Text>
          <TouchableOpacity onPress={() => resetPass()}>
            <Text style={[styles.boldText,{marginEnd: 50}]}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={() => login()}>
          <Text style={styles.btnText}>{APP_CONSTANTS.LOGIN}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchBtn} onPress={() => {navigation.navigate('Register');onChangeEmail(null);onChangePassword(null)}}>
          <Text style={styles.plainText}>{APP_CONSTANTS.NEW_TO_APP}</Text>
          <Text style={styles.boldText}>{APP_CONSTANTS.REGISTER}</Text>
        </TouchableOpacity>
      </View>
      <Image style={styles.headerImg} source={require('../assets/login-image.png')}/>

      <Modal transparent={true} visible={forgot}>
        <TouchableOpacity style={styles.modalBg} onPress={() => showForgotPass(false)} activeOpacity={1}>
          <View style={styles.modal}>
            <Text style={[styles.header,{marginTop: 15, marginStart: 10}]}>{'Password Reset'}</Text>
            <Text style={[styles.plainText,{marginStart: 15}]}>{'Check the email sent to ' + email}</Text>
            <View style={styles.horizLine}/>
            <TouchableOpacity style={[styles.modalBtn,{width: '100%'}]} onPress={() => showForgotPass(false)}>
              <Text style={styles.plainText}>{APP_CONSTANTS.OK}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}


const makeStyles = (colors) => StyleSheet.create({
  /* container */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainer: {
    backgroundColor: colors.primary,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    height: '100%',
    marginTop: 240
  },
  input: {
    flexDirection: 'row',
    height: 55,
    marginTop: 20,
    marginHorizontal: 40,
    borderWidth: 2,
    borderRadius: 7,
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
    marginTop: 40,
    marginBottom: 10,
    marginStart: 40,
    color: colors.text,
  },
  inputText: {
    fontSize: colors.textSize,
    width: '100%',
    color: colors.text,
  },
  btnText: {
    fontSize: colors.textSize,
    fontWeight: 'bold',
    color: colors.primary,
  },
  plainText: {
    fontSize: colors.textSize,
    color: colors.text,
  },
  boldText: {
    fontSize: colors.textSize,
    fontWeight: 'bold',
    color: colors.accent
  },
  errorText: {
    fontSize: colors.textSize,
    color: colors.accent,
    marginStart: 50,
  },

  /* buttons */
  loginBtn: {
    height: 50,
    paddingStart: 10,
    marginTop: 30,
    marginHorizontal: 80,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center'
  },
  switchBtn: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  modalBtn: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%'
  },

  /* other views */
  headerImg: {
    marginStart: 5,
    width: 150, 
    height: 250, 
    marginTop: 30,
    position: 'absolute',
    resizeMode: 'contain',
  },
  inputIcon: {
    padding: 10,
    opacity: .36,
  },
  horizLine: {
    backgroundColor: colors.border,
    marginTop: 10,
    height: 2,
  },
});