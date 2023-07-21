import { StyleSheet } from 'react-native';

const globalStyles = (colors) => StyleSheet.create({
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

export default globalStyles;