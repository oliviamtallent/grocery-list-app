import * as React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, ActivityIndicator, Appearance } from 'react-native';
import { Icon, Tooltip } from 'react-native-elements'
import Item from './Item.js'
import AddEditModal from './AddEditModal'
import DualBtnModal from './DualBtnModal'
import { useTheme } from '../src/theme/ThemeProvider';
import APP_CONSTANTS from '../src/strings';
import DataHandler from "./DataHandler";
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import globalStyles from '../src/theme/styles.js';
import DatabaseHandler from './DatabaseHandler';
import FamilyModal from './FamilyModal.js';

export function MainScreen({navigation}) {
  /* theme values */
  const { dark, colors, setScheme } = useTheme();
  const styles = globalStyles(colors);

  /* input values */
  const [familyModal, onShowFamilyModal] = React.useState(false);
  const [logout, onShowLogout] = React.useState(false);
  const [add, onShowAdd] = React.useState(false);
  const [info, onShowInfo] = React.useState(false);
  const [family, changeFamily] = React.useState("Your Grocery List");
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [visible, changeVisibility] = React.useState(true);
  const [join, onShowJoin] = React.useState(false);
  const [create, onShowCreate] = React.useState(false);
  const [code, onChangeCode] = React.useState(null);
  const [codeError, onChangeCodeError] = React.useState(null);
  const [nameError, onChangeNameError] = React.useState(null);
  const [name, onChangeName] = React.useState(null);
  const [leaveFamily, onShowLeaveFamily] = React.useState(false);
  const [leaveFamilyName, onChangeLeaveFamily] = React.useState(null);
  const [displayFamily, setDisplayFamily] = React.useState(DataHandler.getUsername());
  const [dispFamilyId, setFamilyId] = React.useState(DataHandler.getUsername());

  /* continuing to put this off!!! */
  // DatabaseHandler.getDispFam((val) => {
  //   setDisplayFamily(val);
  //   setFamilyId(val);
  // })

  /* autologin handler */
  const handleLogout = async () => {
    DataHandler.setUsername(null);
    auth()
      .signOut()
      .then(() => {
        onShowLogout(false);
        changeFamily(null);
        DataHandler.setUsername(null);
        DataHandler.setFamily(null);
        navigation.navigate('Login')
      });
  }

  /* family configuration */
  const joinFamily = () => {
    onChangeCodeError(null);
    if (code === null || code.length === 0) {
      onChangeCodeError('Please enter a code');
    } else {
      DatabaseHandler.joinFamily(code, (val) => {
        onChangeCode(null);
        onChangeName(null);
        onShowJoin(false);
        onShowFamilyModal(true);
        setDisplayFamily(val.data().name);
        setFamilyId(val.id);
      }, () => { onChangeCodeError('Invalid join code'); });
    } 
  }
  const createFamily = () => {
    onChangeNameError(null);
    if (name === null || name.length === 0) {
      onChangeNameError('Please enter a name');
    } else {
      DatabaseHandler.createFamily(name, 
        (val) => {
          onChangeCode(null);
          onChangeName(null);
          onShowCreate(false);
          setDisplayFamily(name);
          setFamilyId(val.id);
        });
    }
  }

  const leaveFamilyMethod = (family) => {
    DatabaseHandler.leaveFamily(family, () => { 
      onShowLeaveFamily(false);
      if (dispFamilyId == family.key) {
        setDisplayFamily(DatabaseHandler.getUsername());
        setFamilyId(DatabaseHandler.getUsername());
      }
    });
  }

  /* database access method */
  React.useEffect(() => {
    if (dispFamilyId != null) {
      const subscriber = firestore()
        .collection('Items')
        .where('family','==', dispFamilyId)
        .onSnapshot((querySnapshot) => {
          const items = [];

          querySnapshot.forEach(docSnapshot => {
            items.push({
              ...docSnapshot.data(),
              key: docSnapshot.id,
            });
          })

          setItems(items);
          setLoading(false);
        })
        
      return () => subscriber()
    } else {
      if (DataHandler.getUsername() != null) {  
        setFamilyId(DataHandler.getUsername())
        setDisplayFamily(DataHandler.getUsername())
      }
    }
  }, [dispFamilyId])

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => onShowFamilyModal(true)}>
            <Icon style={styles.mainIcon} size={30} name='people' color={colors.text}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onShowLogout(true)}>
            <Icon style={styles.mainIcon} size={30} name='person' color={colors.text}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeVisibility(!visible)}>
            <Icon style={styles.mainIcon} size={30} name={visible ? 'visibility' : 'visibility-off'} color={colors.text}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onShowInfo(true)}>
            <Icon style={styles.mainIcon} size={30}name='info' color={colors.text}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.header}>{displayFamily === DatabaseHandler.getUsername() || displayFamily === null ? "Your Grocery List" : displayFamily}</Text>
        { !loading && (
          <>
            { items.length == 0 && (
              <View style={styles.emptyContainer}>
                <Image style={styles.emptyImg} source={require('../assets/empty_image.png')}/>
                <Text style={styles.emptyText}>{APP_CONSTANTS.FINISHED_FOR_NOW}</Text>
              </View>
            )}
              <FlatList
                data={items}
                contentContainerStyle={{ paddingBottom: 200 }} 
                renderItem={({ item }) => (
                  (visible || !item.isPurchased) ? 
                    <Item isPurchased={item.isPurchased} name={item.name} count={item.count} measurment={item.measurment} notes={item.notes} requestUser={item.requestUser} currentUser={DataHandler.getUsername()} isNote={item.isNote} id={item.key}/>
                  : null
                )}
                />
          </>
        )}

        { loading && (
          <ActivityIndicator/>
        )}
      </View>
      <Image style={styles.headerImg} source={require('../assets/main-image.png')}/>
      <TouchableOpacity style={styles.fab} onPress={() => {onShowAdd(true)}}>
        <Icon size={25} name='add' color={colors.primary}/>
      </TouchableOpacity>

      <Modal transparent={true} visible={familyModal}>
        <TouchableOpacity style={styles.modalBg} onPress={() => onShowFamilyModal(false)} activeOpacity={1}>
            <FamilyModal
              showJoin={() => {onShowJoin(true),onShowFamilyModal(false)}}
              updateCurrent={(disp, id) => { setDisplayFamily(disp), setFamilyId(id) ,onShowFamilyModal(false) }}
              onCancel = {() => onShowFamilyModal(false)}
              leaveFamily = {(item) => {onChangeLeaveFamily(item),onShowLeaveFamily(true)}}
            />
        </TouchableOpacity>
      </Modal>
      <Modal transparent={true} visible={logout}>
        <DualBtnModal
          colors={colors}
          headerTxt={APP_CONSTANTS.ARE_YOU_SURE}
          cancelTxt={APP_CONSTANTS.CANCEL}
          submitTxt={APP_CONSTANTS.LOGOUT}
          onCancel={() => onShowLogout(false)}
          onSubmit={() => handleLogout()}
        />
      </Modal>
      <Modal transparent={true} visible={add}>
        <AddEditModal 
          title={APP_CONSTANTS.ADD}
          family={dispFamilyId}
          onCancel={() => onShowAdd(false)} 
          onSubmit={() => onShowAdd(false)}
        />
      </Modal>
      <Modal transparent={true} visible={info}>
        <TouchableWithoutFeedback onPress={() => onShowInfo(false)}>
          <View style={styles.modalBg}>
            <Image style={styles.infoImg} source={require('../assets/info-image.png')}/>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal transparent={true} visible={join}>
        <DualBtnModal
          colors={colors}
          headerTxt={APP_CONSTANTS.FAMILY_HINT}
          cancelTxt={APP_CONSTANTS.CANCEL}
          submitTxt={APP_CONSTANTS.JOIN}
          onCancel={() => {onShowJoin(false), onShowFamilyModal(true)}}
          onSubmit={() => joinFamily()}
        >
          <View style={[
              styles.input,
              {marginTop: 10,marginHorizontal: 15, height: 45},
              {borderColor: codeError ? colors.accent : colors.border}]}
            >
              <TextInput
                style={[styles.inputText,{marginStart: 10}]}
                onChangeText={onChangeCode}
                value={code}
                placeholder={APP_CONSTANTS.CODE_HINT}
              />
            </View>
            {codeError != null && (
              <Text style={[styles.errorText,{marginStart: 20}]}>{codeError}</Text>
            )}
          <TouchableOpacity style={styles.switchBtn} onPress={() => {onShowJoin(false),onShowCreate(true)}}>
            <Text style={{color: colors.text,fontSize: colors.textSize}}>{APP_CONSTANTS.NEW}</Text>
            <Text style={[styles.boldText,{ fontSize: colors.textSize}]}>{APP_CONSTANTS.CREATE_FAMILY_HINT}</Text>
          </TouchableOpacity>
        </DualBtnModal>
      </Modal>
      <Modal transparent={true} visible={create}>
        <DualBtnModal
          colors={colors}
          headerTxt={APP_CONSTANTS.CREATE_FAMILY_HINT}
          cancelTxt={APP_CONSTANTS.CANCEL}
          submitTxt={APP_CONSTANTS.CREATE}
          onCancel={() => onShowCreate(false)}
          onSubmit={() => {createFamily()}}
        >
          <View style={[
            styles.input,
            {marginTop: 10,marginHorizontal: 15, height: 45},
            {borderColor: nameError ? colors.accent : colors.border}]}
          >
            <TextInput
              style={[styles.inputText,{marginStart: 10}]}
              onChangeText={onChangeName}
              value={name}
              placeholder={APP_CONSTANTS.ENTER_FAMILY_HINT}
            />
            </View>
            {nameError != null && (
              <Text style={[styles.errorText,{marginStart: 20}]}>{nameError}</Text>
            )}
            <TouchableOpacity style={styles.switchBtn} onPress={() => {onShowCreate(false),onShowJoin(true)}}>
              <Text style={{color: colors.text,fontSize: colors.textSize}}>{APP_CONSTANTS.RETURNING}</Text>
              <Text style={[styles.boldText,{ fontSize: colors.textSize}]}>{APP_CONSTANTS.FAMILY_HINT}</Text>
            </TouchableOpacity>
          </DualBtnModal>
      </Modal>
      <Modal transparent={true} visible={leaveFamily}>
        <DualBtnModal
          colors={colors}
          headerTxt={APP_CONSTANTS.ARE_YOU_SURE}
          cancelTxt={APP_CONSTANTS.CANCEL}
          submitTxt={APP_CONSTANTS.LEAVE_FAMILY}
          onCancel={() => onShowLeaveFamily(false)}
          onSubmit={() => leaveFamilyMethod(leaveFamilyName)}
        >
          <Text style={{marginStart: 15, color: colors.text}}>This will delete all of your items in this list.</Text>
        </DualBtnModal>
      </Modal>
    </View>
  )
}