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
  TouchableNativeFeedback,
  Animated,
  Dimensions
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height

import * as Animatable from 'react-native-animatable';

export default class App extends Component<Props> {
  static navigationOptions = {
    // headerTitle instead of title
    header: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      loginHeight: new Animated.Value(90),
      showStartButton: true,
      showOptions: false,
    };
  }

  componentWillMount() {

  }

  increaseHeightOfLogin = () => {
    Animated.timing(this.state.loginHeight, {
      toValue: SCREEN_HEIGHT - (SCREEN_HEIGHT * 0.4),
      duration: 500
    }).start();

    this.startButton.zoomOut(500).then(
      (endState) => {
        if (endState.finished) {
          this.setState({showStartButton: false});
          this.showOptionsView();
        }
      }
    );
  }

  showOptionsView = () => {
    this.setState({showOptions: true});
    this.optionsView.fadeIn(500);
  } 
  
  render() {
    let { loginHeight, showStartButton, showOptions } = this.state;



    return (
      <View style={{flex: 1}}>
        <ImageBackground
          source={require('./img/banner2.jpg')}
          style={{flex: 1, backgroundColor: '#123'}}
        >
          <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
            <Animatable.View animation="zoomInUp" iterationCount={1} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: 80, width: 80 }}>
              <Text style={{ textAlign: 'center', color: '#659B5E', fontWeight: 'bold' }}>ScanGo</Text>
            </Animatable.View>
          </View>
          <Animatable.View animation="slideInUp" iterationCount={1}>
            <Animated.View style={{ height: loginHeight, backgroundColor: 'white', justifyContent: 'center' }}>
              <View style={{ paddingHorizontal: 25, opacity: 1 }}>
                {
                  showStartButton ? 
                    <Animatable.View style={{ alignItems: 'center', justifyContent: 'center' }} ref={ref => this.startButton = ref}>
                    <TouchableNativeFeedback
                    onPress={() => this.increaseHeightOfLogin() }
                      background={TouchableNativeFeedback.Ripple('#C7CCB9')}>
                      <View style={{paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text style={{ color: '#A6A2A2' }}>Start</Text>
                      </View>
                    </TouchableNativeFeedback>
                    </Animatable.View> 
                    : null
                }
                {
                  showOptions ? 
                  <Animatable.View ref={ref => this.optionsView = ref} style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 6 }}>
                      <Text>Take Photo</Text>
                      </View>
                      <View style={{ flex: 6 }}>
                      <Text>Select a Picture</Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 8, marginBottom: 8 }}>
                      <Text style={{ textAlign: 'center' }}>or</Text>
                    </View>
                    <View>
                    <Text>View Lists of Mango Diseases</Text>
                    </View>
                  </Animatable.View>
                  : null
                }
              </View>
            </Animated.View>
            <View style={{
              height: 50,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopColor: '#e8e8ec',
              borderTopWidth: 1,
              paddingHorizontal: 25
            }}>
              <Text style={{ textAlign: 'center', fontSize: 11 }}>
              @Copyright - 박윤후
              </Text>
            </View>
          </Animatable.View>
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
