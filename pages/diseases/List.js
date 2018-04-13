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
  FlatList
} from 'react-native';

import DiseaseItem from './Item';
import * as Animatable from 'react-native-animatable';
// const _ = require('lodash');

export default class DiseasesList extends Component<Props> {
  static navigationOptions = {
    // headerTitle instead of title
    // header: null,
    title: 'Mango Diseases',
    headerStyle: {
      backgroundColor: '#FCB97D',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  };


  constructor(props) {
    super(props);
    this.state = {
      diseases: [],
      loadingDiseases: true
    };
  }

  componentWillMount() {
    firebase.database().ref('diseases').once('value').then((diseaseOnFireBase) => {
      // console.error(diseases);
      let loadingDiseases = false;
      let diseases = diseaseOnFireBase.val();
      // console.error(diseaseOnFireBase.val());
      this.setState({diseases, loadingDiseases});
      // console.error(this.state.diseases);
    });
  }

  render() {
    const { diseases, loadingDiseases } = this.state;
    let showDiseasesList = null;

    if (loadingDiseases) {
      showDiseasesList = (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#659B5E" />
        </View>
      )
    } else {

      if ( diseases.length > 0 ) {
        // showDiseasesList = (
        //   <FlatList
        //     style={{flex: 1, backgroundColor: 'green'}}
        //     data={diseases}
        //     renderItem={(disease) => <Text>{disease.name}</Text>}
        //     keyExtractor={(item, index) => index.toString()}
        //   />
        // )
        showDiseasesList = (
          <View style={styles.container}>
            <FlatList
              data={this.state.diseases}
              style={{backgroundColor: '#EFF1ED'}}
              renderItem={({item}) => <DiseaseItem navigation={this.props.navigation} disease={item}></DiseaseItem>}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )
      }
    }

    return (
      <View style={{flex: 1}}>
        {
          showDiseasesList
        }
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