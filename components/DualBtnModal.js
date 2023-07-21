import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';

/**
    takes headerTxt, cancelTxt, submitTxt, onCancel, and onSubmit
    returns button modal
*/

const DualBtnModal = (props) => {
  /* theme values */
  const { dark, colors, setScheme } = useTheme();
  const styles = makeStyles(colors)

  return (
    <TouchableOpacity style={styles.container} onPress={() => props.onCancel()} activeOpacity={1}>
      <TouchableOpacity onPress={()=> {}} activeOpacity={1}>
        <View style={styles.modal}>
          <Text style={styles.headerText}>{props.headerTxt}</Text>
          {props.children}
          <View style={styles.horizontalLine}/>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => props.onCancel()}>
                <Text style={styles.buttonText}>{props.cancelTxt}</Text>
              </TouchableOpacity>
              <View style={styles.verticalLine}/>
              <TouchableOpacity style={styles.button} onPress={() => props.onSubmit()}>
                <Text style={styles.buttonText}>{props.submitTxt}</Text>
              </TouchableOpacity>
            </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const makeStyles = (colors) => StyleSheet.create({
  /* containers */
  container: {
    backgroundColor: colors.translucent,
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    marginHorizontal: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
  },

  /* text */
  headerText: {
    fontWeight: 'bold',
    fontSize: colors.headerTextSize,
    marginTop: 15,
    marginStart: 10,
    marginBottom: 5,
    color: colors.text,
  },
  buttonText: {
    fontSize: colors.textSize, 
    color: colors.text,
  },

  /* button */
  button: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%'
  },

  /* other views */
  verticalLine: {
    backgroundColor: colors.border,
    width: 2,
  },
  horizontalLine: { 
    backgroundColor: colors.border, 
    marginTop: 10, 
    height: 2, 
  },
})
export default DualBtnModal;