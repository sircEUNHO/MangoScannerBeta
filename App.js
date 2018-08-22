/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Home from './pages/Home';
import DiseasesList from './pages/diseases/List';
import Disease from './pages/diseases/Indiv';



type Props = {};
const RootStack = StackNavigator(
  {
    Home: {
      screen: Home,
    },
    
    DiseasesList: {
      screen: DiseasesList,
    },

    Disease: {
      screen: Disease,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}