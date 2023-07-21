import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import APP_CONSTANTS from '../src/strings';
import firestore from '@react-native-firebase/firestore';
import CheckBox from "./CheckBox";
import DualBtnModal from './DualBtnModal';
import DatabaseHandler from './DatabaseHandler';

const AddEditModal = (props) => {
  /* theme values */
  const { dark, colors, setScheme } = useTheme();
  const styles = makeStyles(colors)

  /* input default values */
  const [name, onChangeName] = React.useState(props.name);
  const [count, onChangeCount] = React.useState(props.count ? props.count : "");
  const [measurment, onChangeMeasure] = React.useState(props.measurment ? props.measurment : "");
  const [notes, onChangeNotes] = React.useState(props.notes ? props.notes : "");
  const [checkBox, onChangeCheck] = React.useState(props.isNote ? true : false);
  const [nameError, onSetNameError] = React.useState(null);

  /* focus handlers */
  const ref_count = React.useRef();
  const ref_measure = React.useRef();
  const ref_notes = React.useRef();
  const ref_name = React.useRef();

  const addItem = () => {
    var db = firestore();
    onSetNameError(null)
    if (name === null || name === undefined || name.length === 0) {
      onSetNameError("Please enter a name")
    } else {
      if (props.name != undefined) {
        DatabaseHandler.updateItem(props, name, count, measurment, notes, checkBox)
      } else {
        DatabaseHandler.addItem(props, name, count, measurment, notes, checkBox, () => resetVals())
      }
    }
  }

  const resetVals = () => {
    onChangeName("")
    onChangeCount("")
    onChangeMeasure("")
    onChangeNotes("")
    onChangeCheck(false)
    ref_name.current.focus()
    props.onSubmit();
  }
  
  return (
    <DualBtnModal
      headerTxt={props.title + APP_CONSTANTS.ADD_EDIT_TITLE}
      cancelTxt={APP_CONSTANTS.CANCEL}
      submitTxt={props.title}
      onCancel={() => props.onCancel()}
      onSubmit={() => addItem()}>

      <View style={[styles.input,{borderColor: nameError ? colors.accent : colors.border}]}>
        <TextInput
          style={styles.inputText}
          onChangeText={onChangeName}
          value={name}
          placeholder={APP_CONSTANTS.NAME_HINT}
          returnKeyType='next'
          onSubmitEditing={() => (!checkBox || props.recipe === 2) ? ref_count.current.focus() : ref_notes.current.focus()}
          ref={ref_name}
        />
      </View>
      {nameError != null && (
        <Text style={styles.errorText}>{nameError}</Text>
      )}
      {(!checkBox) && (
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            onChangeText={onChangeCount}
            value={count != null ? count +"" : null }
            keyboardType='numeric'
            placeholder={APP_CONSTANTS.COUNT_HINT}
            returnKeyType='next'
            onSubmitEditing={() => ref_measure.current.focus()}
            ref={ref_count}
          />
        </View>
      )}
      {(!checkBox) && (
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            onChangeText={onChangeMeasure}
            value={measurment}
            placeholder={APP_CONSTANTS.MEASURE_HINT}
            returnKeyType='next'
            onSubmitEditing={() => ref_notes.current.focus()}
            ref={ref_measure}
          />
        </View>
      )}
      <View style={styles.input}>
        <TextInput
          style={styles.inputText}
          onChangeText={onChangeNotes}
          value={notes}
          placeholder={APP_CONSTANTS.NOTE_HINT}
          ref={ref_notes}
        />
      </View>
      <CheckBox
        checkText={APP_CONSTANTS.IS_NOTE}
        isChecked={checkBox}
        onCheck={() => {onChangeCheck(!checkBox)}}
      />
    </DualBtnModal>
  )
}


const makeStyles = (colors) => StyleSheet.create({
  /* containers */
  container: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    marginHorizontal: 50,
  },
  input: {
    flexDirection: 'row',
    height: 45,
    marginTop: 10,
    marginHorizontal: 20,
    borderWidth: 2,
    borderRadius: 7,
    borderColor: colors.border,
    alignItems: 'center',
    marginStart: 15,
  },
  isNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  /* text */
  header: {
    fontWeight: 'bold',
    fontSize: colors.headerTextSize,
    marginTop: 15,
    marginStart: 10,
    color: colors.text,
  },
  inputText: {
    fontSize: colors.textSize,
    width: '100%',
    marginStart: 10,
    color: colors.text,
  },
  boldText: {
    fontSize: colors.textSize,
    fontWeight: 'bold',
    color: colors.accent,
  },
  plainText: {
    fontSize: colors.textSize,
    color: colors.text,
  },
  errorText: {
    fontSize: colors.textSize,
    color: colors.accent,
    marginStart: 25,
    marginTop:2,
  },

  /* buttons */
  recipeBtn: {
    marginStart: 15,
    marginTop: 5,
    marginBottom: 5,
  },
}) 

export default AddEditModal;