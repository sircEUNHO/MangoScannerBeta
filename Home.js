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
  ImageBackground,
  Touchable,
  TouchableNativeFeedback
} from 'react-native';

export default class App extends Component<Props> {
  static navigationOptions = {
    // headerTitle instead of title
    header: null,
  };
  
  render() {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          source={require('./img/banner.jpg')}
          style={{flex: 1, backgroundColor: '#123'}}
        >
          <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: 80, width: 80 }}>
              <Text style={{ textAlign: 'center' }}>ScanGo</Text>
            </View>
          </View>
          <View>
            <View style={{ height: 100, backgroundColor: 'white'}}>
              <View style={{ paddingHorizontal: 25, opacity: 1, marginTop: 25 }}>
                {/*<Text>
                ASD
                </Text>*/}
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('#000')}>
                    <View>
                      <Text>Start</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            </View>
            <View style={{
              height: 70,
              backgroundColor: 'white',
              alignItems: 'flex-start',
              justifyContent: 'center',
              borderTopColor: '#e8e8ec',
              borderTopWidth: 1,
              paddingHorizontal: 25
            }}>
              <Text>
              ASD
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const startPage = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    flex: 1,
  }
});
