/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { ThemeProvider } from './src/theme/ThemeProvider';

AppRegistry.registerComponent(appName, () => App);
