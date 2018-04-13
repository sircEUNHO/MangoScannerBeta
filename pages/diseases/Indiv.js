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
  ActivityIndicator,
  ScrollView,
  TouchableNativeFeedback,
  ImageBackground,
  Dimensions
} from 'react-native';

import DiseaseItem from './Item';
import * as Animatable from 'react-native-animatable';
const SCREEN_HEIGHT = Dimensions.get('window').height
const _ = require('lodash');

export default class Disease extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    // headerTitle instead of title
    // header: null,
    const { params } = navigation.state;

    return {
      title: params.disease.name,
      headerStyle: {
        backgroundColor: '#659B5E',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    };
  };


  constructor(props) {
    super(props);
    this.state = {
      disease: {},
      imageLoading: false
    };
  }

  componentWillMount() {
    if (this.props.navigation.state.params) {
      this.setState({ disease: this.props.navigation.state.params.disease });
      console.log(this.props.navigation.state.params.disease);
    }
  }

  render() {
    const { disease, imageLoading } = this.state;
    
    let remedies = null;

    let imageLoader = null;

    if (imageLoading) {
      imageLoader = (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#659B5E"/>
        </View>
      )
    } else {
      imageLoader = null;
    }

    return (
      <View style={{flex: 1, backgroundColor: '#EFF1ED'}}>
        <ScrollView contentContainerStyle={{ backgroundColor: '#EFF1ED'}}>
          <ImageBackground style={{ height: SCREEN_HEIGHT * 0.3, position: 'relative' }}  source={{ uri: disease.photo }} onLoadEnd={() => { this.setState({imageLoading: false}) }} onLoadStart={() => { this.setState({imageLoading: true}) }}>
            {
              imageLoader
            }
            <View style={{ alignItems: 'flex-start',  justifyContent: 'flex-end', display: 'flex', flex: 1, paddingRight: 16, paddingVertical: 16, }}>
              <View style={{ backgroundColor: '#A6A2A2', paddingRight: 8, paddingLeft: 16, paddingVertical: 8, }}>
                <Text style={{ color: '#EFF1ED', fontSize: 19, fontWeight: 'bold' }}>{ disease.name }</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={{paddingHorizontal: 16, paddingVertical: 8}}>
            <View style={{ paddingBottom: 16 }}>
              <Text style={{ color: '#659B5E', fontSize: 17, paddingBottom: 8 }}>Description</Text>
              <Text>{ disease.description }</Text>
            </View>
            <View>
              <Text style={{ color: '#659B5E', fontSize: 17, paddingBottom: 8 }}>How to Prevent</Text>
            </View>
            <View>
              {
                _.map(disease.remedy, (value, key) => {
                  return <View key={key} style={{ paddingBottom: 4, flexDirection: 'row' }}><Text style={{ paddingRight: 4, color: '#191716' }}>{'\u2022'}</Text><Text>{value}</Text></View>;
                })
              }
            </View>
          </View>
          
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})