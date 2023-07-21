import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { useTheme } from '../src/theme/ThemeProvider';
import APP_CONSTANTS from '../src/strings';
import firestore from '@react-native-firebase/firestore';
import DatabaseHandler from './DatabaseHandler';

const FamilyModal = (props) => {
    /* theme values */
    const { dark, colors, setScheme } = useTheme();
    const styles = makeStyles(colors);

    /* variables */
    const [families, setFamilies] = React.useState(null);
    //const [displayFamily, setDisplayFamily] = React.useState(props.dispFam ? props.dispFam : DatabaseHandler.getUsername())
    const [loading, setLoading] = React.useState(true);

    // const setDispFam = (val) => {
    //   setDisplayFamily(val)
    //   DatabaseHandler.updateUser(val)
    // }

    React.useEffect(() => {
      const subscriber = firestore()
        .collection('Families')
        .where('members','array-contains',DatabaseHandler.getUsername())
        .onSnapshot((querySnapshot) => {
          const families = [];

          querySnapshot.forEach((docSnap) => {
            families.push({
              ...docSnap.data(),
              key: docSnap.id,
            })
          })
          
          setFamilies(families);
          setLoading(false);
        })
      
      return () => subscriber()
    }, [])

    return (
      <View style={styles.modal}>
        <View style={{flexDirection: 'row',marginTop: 15, marginStart: 15, justifyContent: 'space-between'}}>
          <Text style={[styles.header,{marginTop: 0, marginStart: 0}]}>{APP_CONSTANTS.FAMILY_JOIN}</Text>
          <TouchableOpacity style={{marginEnd: 15}} onPress={() => { props.showJoin() }}>
            <Icon size={27} name='add' color={colors.text}/>
          </TouchableOpacity>
        </View>
        {!loading && (
          <>
            <FlatList
              data={families}
              renderItem={({ item }) => (
                <View style={{paddingBottom: 10}}>
                  <View style={{flexDirection:'row', justifyContent: 'space-between', marginEnd: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginStart: 20}}>
                      <TouchableOpacity onPress={() => { props.updateCurrent(item.name, item.key) }}>
                        <Text style={styles.boldText}>{item.name}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { props.leaveFamily(item) }}>
                        <Icon size={15} style={{marginStart: 5}} name='exit-to-app'/>
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.plainText,{alignItems: 'flex-end'}]}>{item.joinCode}</Text>
                  </View>
                  {
                    item.members.map((name) => (
                      <Text style={[{marginStart: 30}, styles.plainText]}>{"- " + name}</Text>
                    ))
                  }
                </View>
              )}
            />
            <View style={{flexDirection: 'row', alignItems:'center', marginStart: 20}}>
              <TouchableOpacity onPress={() => { props.updateCurrent(DatabaseHandler.getUsername(), DatabaseHandler.getUsername()) }}>
                <Text style={styles.boldText}>Your Grocery List</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        { loading && (
          <ActivityIndicator/>
        )}
        <View style={styles.horizLine}/>
        <TouchableOpacity style={[styles.modalBtn,{width: '100%'}]} onPress={() => props.onCancel()}>
          <Text style={styles.plainText}>{APP_CONSTANTS.OK}</Text>
        </TouchableOpacity>
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
      backgroundColor: colors.primary,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      height: '100%',
      marginTop: 70,
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
      marginEnd: 20,
    },
    mainIcon: {
      marginHorizontal: 2,
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
    emptyContainer: {
      alignItems: 'center',
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
  
    /* text */
    header: {
      fontWeight: 'bold',
      fontSize: colors.headerTextSize,
      marginTop: 10,
      marginBottom: 10,
      marginStart: 20,
      color: colors.text,
    },
    boldText: {
      fontWeight: 'bold',
      color: colors.accent,
    },
    plainText: {
      fontSize: colors.textSize,
      color: colors.text,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.text,
    },
    errorText: {
      fontSize: colors.textSize,
      color: colors.accent,
      marginStart: 45,
      marginTop:5,
    },
  
    /* buttons */
    modalBtn: {
      paddingVertical: 15,
      flexDirection: 'row',
      justifyContent: 'center',
      width: '50%'
    },
    modalBtns: {
      flexDirection: 'row',
    },
    addBtn: {
      backgroundColor: colors.accent,
      height: 30,
      width: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginEnd: 20,
    },
    switchBtn: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    modalBtn2: {
      paddingVertical: 17,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    starBox: {
      height: 15,
      width: 15,
      borderWidth: 2,
      borderRadius: 10,
      marginEnd: 5,
      borderColor: colors.accent,
    },
  
    /* other views */
    headerImg: {
      marginStart: 25,
      width: 100, 
      height: 100, 
      marginTop: 10,
      position: 'absolute',
      resizeMode: 'contain',
    },
    fab: {
      backgroundColor: colors.accent,
      position: 'absolute',
      height: 75,
      width: 75,
      borderRadius: 75/2,
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      right: 0,
      marginBottom: 20,
      marginEnd: 20,
    },
    horizLine: {
      backgroundColor: colors.border,
      marginTop: 10,
      height: 2,
    },
    infoImg: {
      height: '100%',
      resizeMode: 'stretch',
      marginTop: 15,
      marginStart: 20,
    },
    emptyImg: {
      resizeMode: 'contain',
      width: '75%',
      height: 300,
    },
  });

export default FamilyModal;