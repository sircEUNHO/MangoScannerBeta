/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableNativeFeedback
} from 'react-native';

export default class DiseaseItem extends Component<Props> {


  constructor(props) {
    super(props);
    this.state = {
    };
  }
  // this.props.navigation.state.param with parameters
  render() {
    return (
      <TouchableNativeFeedback onPress={() => { this.props.navigation.navigate('Disease', { disease: this.props.disease }) }} background={TouchableNativeFeedback.Ripple('#C7CCB9')}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomColor: '#A6A2A2', borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18 }}>{this.props.disease.name}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}