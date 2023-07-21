import * as React from 'react';
import { useTheme } from '../src/theme/ThemeProvider';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CheckBox = (props) => {
  /* theme values */
  const { dark, colors, setScheme } = useTheme();
  const styles = makeStyles(colors);

  /* input default values */
  const [checkBox, setChecked] = React.useState(props.isChecked ? true : false);

  return(
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {setChecked(!checkBox),props.onCheck()}}>
        <View style={[styles.checkBox,{backgroundColor: checkBox ? colors.accent+"BF" : 'transparent'}]}/>
      </TouchableOpacity>
      <Text style={styles.plainText}>{props.checkText}</Text>
    </View>
  )
}

const makeStyles = (colors) => StyleSheet.create({
  /* containers */
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  /* text */
  plainText: {
    fontSize: colors.textSize,
    color: colors.text,
    marginStart: 10,
  },

  /* other views */
  checkBox: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderRadius: 7,
    marginStart: 25,
    borderColor: colors.accent,
  },
});

export default CheckBox;