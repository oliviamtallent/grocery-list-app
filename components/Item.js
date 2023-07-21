import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Icon } from 'react-native-elements'
import AddEditModal from './AddEditModal'
import { useTheme } from '../src/theme/ThemeProvider';
import DualBtnModal from './DualBtnModal'
import APP_CONSTANTS from '../src/strings';
import DatabaseHandler from './DatabaseHandler';

const Item = (props) => {
  /* theme values */
  const { dark, colors, setScheme } = useTheme();
  const styles = makeStyles(colors);

  /* input values */
  const [checkBox, onChangeCheck] = React.useState(props.isPurchased);
  const [edit, onShowEdit] = React.useState(false);
  const [deleteModal, onShowDelete] = React.useState(false);

  /* database access methods */
  const deleteItem = () => {
    DatabaseHandler.deleteItem(props.id, () => { onShowDelete(false); })
  }
  const updatePurchase = () => {
    DatabaseHandler.updatePurchase(props.id, checkBox, () => { onChangeCheck(!checkBox) })
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        { !props.isNote && (
          <TouchableOpacity onPress={() => {updatePurchase()}}>
            <View style={[styles.checkBox,{backgroundColor: checkBox ? colors.accent+"BF" : 'transparent'}]}/>
          </TouchableOpacity>
        )}
        { props.isNote && (
          <Icon name='close' color={colors.accent} style={styles.noteIcon} size={27}/>
        )}
        <View style={styles.mainText}>
          <View style={styles.headingText}>
            <Text style={[styles.boldText,{textDecorationLine: checkBox ? 'line-through' : ''}]}>
              {props.name}
            </Text>
            { (props.count > 1 || props.measurment.length != 0) && (
              <Text style={[styles.translucentText,{textDecorationLine: checkBox ? 'line-through' : ''}]}>
                {' x'} { props.count != 0 ? props.count : null} {props.measurment} 
              </Text>
            )}
          </View>
          {props.notes.length != 0 && (
            <Text 
              style={styles.notes(props.currentUser === props.requestUser ? 240 : 280 - (props.requestUser.length * 6))}>
              {props.notes}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.endBox}>
        {props.currentUser != props.requestUser && (
          <Text style={{color: colors.text}}>{props.requestUser}</Text>
        )}
        {props.currentUser === props.requestUser && (
          <View style={styles.edIcons}> 
            <TouchableOpacity onPress={() => onShowEdit(true)}>
              <Icon name='edit' color={colors.text}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onShowDelete(true)}>
              <Icon name='delete' color={colors.text}/>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.circle}/>
      </View>
      <Modal transparent={true} visible={edit}>
        <AddEditModal 
          title={APP_CONSTANTS.EDIT}
          name={props.name}
          count={props.count}
          measurment={props.measurment}
          notes={props.notes}
          isNote={props.isNote}
          id={props.id}
          onCancel={() => onShowEdit(false)} 
          onSubmit={() => {onShowEdit(false)}}
        />
      </Modal>
      <Modal transparent={true} visible={deleteModal}>
        <DualBtnModal
          colors={colors}
          headerTxt={APP_CONSTANTS.DELETE + APP_CONSTANTS.SPACE+props.name+APP_CONSTANTS.QUESTION}
          cancelTxt={APP_CONSTANTS.CANCEL}
          submitTxt={APP_CONSTANTS.DELETE}
          onCancel={() => onShowDelete(false)}
          onSubmit={() => deleteItem()}
        />
      </Modal>
    </View>
  )
}

const makeStyles = (colors) => StyleSheet.create({
  /* containers */
  container: {
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    marginHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  left: {
    alignItems: 'center',
    flexDirection:'row',
  },
  endBox: {
    flexDirection: 'row',
  },
  edIcons: {
    flexDirection: 'row',
  },

  /* text */
  mainText: {
    fontSize: colors.textSize,
    marginVertical: 10,
    color: colors.text,
  },
  headingText: {
    flexDirection: 'row',
    maxWidth: 220,
    flexWrap: 'wrap',
    color: colors.text,
  },
  boldText: {
    fontWeight: 'bold',
    color: colors.text,
  },
  notes: (width) => ({
    maxWidth: width,
    flexWrap: 'wrap',
    color: colors.text,
  }),
  plainText: {
    fontSize: colors.textSize,
    color: colors.text,
    fontWeight: 'bold'
  },
  translucentText: {
    color: colors.text,
    opacity: .80,
  },
  header: {
    fontWeight: 'bold',
    fontSize: colors.headerTextSize,
    marginVertical: 12,
    marginStart: 15,
    color: colors.text,
  },

  /* buttons */
  noteIcon: {
    marginHorizontal: 7,
    marginVertical: 20,
  },

  /* other views */
  checkBox: {
    height: 22,
    width: 22,
    borderWidth: 2,
    borderRadius: 7,
    marginHorizontal: 10,
    marginVertical: 20,
    borderColor: colors.accent,
  },
  circle: {
    height: 13,
    width: 13,
    borderRadius: 20,
    borderColor: colors.accent,
    borderWidth: 2,
    marginEnd: 10,
    marginStart: 5,
    alignSelf: 'center',
  },
})

export default Item;