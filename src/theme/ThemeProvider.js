import React from 'react';
import { lightColors, darkColors } from './colors.js';
import { Appearance } from 'react-native';

export const ThemeContext = React.createContext();

export const ThemeProvider = (props) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = React.useState(colorScheme === 'dark');

  Appearance.addChangeListener(({ colorScheme }) => {
    setIsDark(colorScheme === 'dark')
  })

  /* skipping the in app changer? */
  React.useEffect(() => {},[colorScheme])

  const defaultTheme = {
    dark: isDark,
    colors: isDark ? darkColors : lightColors,
    setScheme: (scheme) => { setIsDark(scheme === 'dark') },
  }

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  )
};

export const useTheme = () => {
  return React.useContext(ThemeContext);
}