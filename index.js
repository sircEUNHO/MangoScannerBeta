import { AppRegistry } from 'react-native';
import App from './App';

import firebase from 'react-native-firebase';

global.firebase = firebase;
AppRegistry.registerComponent('MangoScannerBeta', () => App);
