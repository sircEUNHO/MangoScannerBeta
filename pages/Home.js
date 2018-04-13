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
  Dimensions,
  Image,
  ScrollView,
  Modal
} from 'react-native';

const ImagePicker = require('react-native-image-picker');
const SCREEN_HEIGHT = Dimensions.get('window').height
import * as Animatable from 'react-native-animatable';
const _ = require('lodash');

const diseaseRegex = {
  'Anthracnose' : ['anthracnose', 'antr'],
  'Bacterial Black Spot' : ['bacterial black spot', 'bbs'],
  'Scab': ['scab'],
}

import config from '../config';

let options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  mediaType: 'photo'
};

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
      processingStage: '',
      isProcessing: false,
      resultsHeight: new Animated.Value(SCREEN_HEIGHT),
      uploadedImage: '',
      results: null,
    };
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

  takeAPhoto = () => {
    ImagePicker.launchCamera(options, (response)  => this.onPickAPhoto(response));
  }

  selectAPhoto = () => {
    // this.setState({isProcessing: true, processingStage: 'uploading'});
    ImagePicker.launchImageLibrary(options, (response)  => this.onPickAPhoto(response));
  }

  reinitializeResultsVariable () {
    this.setState({
      results:  null,
      processingStage: '',
      uploadedImage: '',
      resultsHeight: new Animated.Value(SCREEN_HEIGHT)
    });
    // Animated.timing(this.state.resultsHeight, {
    //   toValue: 0,
    //   duration: 500
    // }).start();
  } 

  onPickAPhoto = (response)  => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      // alert(response.data);
      this.setState({isProcessing: true});
      this.uploadPhotoOnServer(response.uri);
    }
  }

  uploadPhotoOnServer (photo) {
    let metadata = {
      contentType: 'image/jpeg',
    };

    let extension = ".jpg";

    let newImageName = Math.floor(Math.random() * 100000000000000);

    let imgRef = firebase.storage().ref('images/' + newImageName + '' + extension);

    this.setState({processingStage: 'uploading'});
    imgRef.putFile(photo, metadata).then((response) => {
      return imgRef.getDownloadURL();
    }).then((url) => {
      // resolve(url)
      this.analyzeImage(url);
    });
    // .catch((error) => {
    //   reject(error)
    // });
  }

  analyzeImage = async (image) => {
    this.setState({processingStage: 'analyzing', uploadedImage: image});
    let results = await this.visionAnalyze(image);
    // console.log();
    this.setState({results: results.responses[0]});
    // console.log(this.state.results);
  }

  visionAnalyze = async(image) => {
    // console.log(image)
    return await fetch(config.googleCloud.api + config.googleCloud.apiKey, {
      method: 'POST',
      body: JSON.stringify({
        "requests": [
          {
            "image":{
              "source":{
                "imageUri": image
              }
            },
            "features": [
                {
                    "type": "LABEL_DETECTION"
                },
                {
                    "type": "WEB_DETECTION"
                }
            ]
          }
        ]
      })
    }).then((response) => {
        this.setState({processingStage: 'complete'});
        Animated.timing(this.state.resultsHeight, {
          toValue: SCREEN_HEIGHT * 0.35,
          duration: 500
        }).start();
        this.logoLoading.stopAnimation();
        return response.json();
    }, (err) => {
        console.error('promise rejected')
        console.error(err)
    });
  }

  openDiseasesList() {
    this.props.navigation.navigate('DiseasesList');
    // alert('yes');
  }
  
  render() {
    let {
      loginHeight,
      showStartButton,
      results,
      showOptions,
      isProcessing,
      resultsHeight,
      processingStage,
      uploadedImage
    } = this.state;

    let loadingText = null;
    let isMangoText = null;
    let diseaseText = null;
    let diseaseMatchKeywords = null;
    let matchedDisease = [];
    let uploadedImageViewer = null;
    if (uploadedImage) {
      uploadedImageViewer= (<Image source={{ uri: uploadedImage }} style={{ height: 150, marginBottom: 16, }}  resizeMode="contain"/>)
    }
    if (processingStage === 'complete') {
      loadingText = "Complete!"
      if (results) {
        let isMango = _.filter(
          _.map(results.labelAnnotations, (label) => {
            return label.description.toLowerCase().includes('mango');
          })
        ).length > 0;

        if (isMango) {
          isMangoText = (
            <View>
              <Text style={{ textAlign: 'center', color: '#659B5E', fontSize: 19, fontWeight: 'bold', marginBottom: 16 }}>
                Mangoriffic! This is a Mango! 
              </Text>
            </View>
          )
          // console.log(matchedDisease);

          matchedDisease = _.filter(
            _.map(diseaseRegex, (diseaseToMatch, index) => {
              let diseaseDidMatch = false;

              _.forEach(diseaseToMatch, (dtm) => {
                let dtmMatchedWebEntities = _.filter(
                  _.map(results.webDetection.webEntities, (label) => {
                    if(label.description)
                  return label.description.toLowerCase().includes(dtm);
                  })
                ).length > 0;

                let dtmMatchedBGL = _.filter(
                  _.map(results.webDetection.bestGuessLabels, (label) => {
                    if(label.label)
                    return label.label.toLowerCase().includes(dtm);
                  })
                ).length > 0;

                // console.log(dtmMatchedWebEntities);

                if (dtmMatchedWebEntities || dtmMatchedBGL) {
                  diseaseDidMatch  = true;
                }
              });

              if (diseaseDidMatch) {
                return index;
              }
            })
          );

          console.log(matchedDisease)

          if (matchedDisease.length > 0) {
            diseaseText = _.map(matchedDisease, (mdisease, index) =>
              <View key={index}>
                <Text style={{ textAlign: 'center', color: '#E6AF2E', fontSize: 17, marginBottom: 16 }}>
                  Holy Cow! It seems that your mango has {mdisease}!
                </Text>
              </View>
            );
            // may laman
          } else {
            // wala
            diseaseText = (
              <View>
                <Text style={{ textAlign: 'center', color: '#659B5E', fontSize: 17, marginBottom: 16  }}>
                  Congratulations! It seems that your mango is healthy!
                </Text>
              </View>
            );
          }
        } else {
          isMangoText = (
            <View style={{ paddingHorizontal: 32 }}>
              <Text style={{ textAlign: 'center', color: '#E6AF2E', fontSize: 17, marginBottom: 16  }}>
                Sorry Human! This is NOT a Mango! Maybe you're mistaken that this is a mango.
                Sometimes the quality of the photo may affect my analyzing ability! Please try again!  
              </Text>
            </View>
          )
        }

        // always show keywords
        if (results.webDetection.webEntities) {
          diseaseMatchKeywords = _.map(results.webDetection.webEntities,
            (mdisease, index) =>
            {
              if (mdisease.description) { 
                return (
                <View key={index} style={{paddingBottom: 4, flexDirection: 'row', paddingLeft: 8}}>
                  <Text style={{ paddingRight: 4, color: '#191716' }}>{'\u2022'}</Text>
                  <Text style={{ textAlign: 'left', color: '#191716' }}>
                    {mdisease.description}
                  </Text>
                </View>
                )
              } else {
                return null
              }
            }
          )
        }
      }
    } else if(processingStage === 'analyzing') {
      loadingText = "Analyzing Image!"
    } else if(processingStage === 'uploading') {
      loadingText = "Analyzing Image!"
    } else {
      loadingText = null;
    }


    return (
      <View style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isProcessing}
          onRequestClose={() => {
            if (processingStage === 'complete') {
              this.setState({isProcessing : !isProcessing});
              this.reinitializeResultsVariable();
            }
          }}>
          <View style={{backgroundColor: '#EFF1ED', flex: 1}}>
            <ScrollView contentContainerStyle={{backgroundColor: '#EFF1ED'}} scrollEnabled={processingStage === 'complete'}>
              <Animated.View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDD892',  height: resultsHeight }}>
                <Animatable.Image
                  source={require('../img/logoxs.png')}
                  style={{height: 60, width: 61, marginBottom: 6}}
                  iterationCount="infinite"
                  animation="bounce"
                  easing="ease-in-out"
                  duration={1500}
                  ref={ref => this.logoLoading = ref}
                />
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#659B5E' }}>{ loadingText }</Text>
              </Animated.View>
              <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16}}>
                {
                  isMangoText
                }
                {
                  diseaseText
                }
                {
                  uploadedImageViewer
                }
                <View>
                  {
                    diseaseMatchKeywords ? <Text style={{  color: '#191716', paddingBottom: 8 }}>Here's some keyword that matched on your image!</Text> : null
                  }
                  {
                    diseaseMatchKeywords
                  }
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <ImageBackground
          source={require('../img/banner2.jpg')}
          style={{flex: 1, backgroundColor: '#123'}}
        >
          <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
            <Animatable.View animation="zoomInUp" iterationCount={1} style={{ backgroundColor: '#373D20', borderRadius: 6, borderWidth: 3, borderColor: '#373D20', height: 120, width: 120 }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF1ED', borderRadius: 6,}}>
                <Image
                  source={require('../img/logoxs.png')}
                  style={{height: 70, width: 71, marginTop: 3,}}
                />
                <Text style={{ textAlign: 'center', color: '#659B5E', fontWeight: 'bold', marginTop: 3, fontSize: 16 }}>Mango Flick</Text>
              </View>
            </Animatable.View>
          </View>
          <Animatable.View animation="slideInUp" iterationCount={1}>
            <Animated.View style={{ height: loginHeight,  backgroundColor: '#EFF1ED', justifyContent: 'center' }}>
              <View style={{ paddingHorizontal: 25, opacity: 1 }}>
                {
                  showStartButton ? 
                    <Animatable.View style={{ alignItems: 'center', justifyContent: 'center' }} ref={ref => this.startButton = ref}>
                    <TouchableNativeFeedback
                    onPress={() => this.increaseHeightOfLogin() }
                      background={TouchableNativeFeedback.Ripple('#C7CCB9')}>
                      <View style={{paddingHorizontal: 16, paddingVertical: 8, borderColor: '#E6AF2E', borderWidth: 1.5, borderRadius: 3 }}>
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
                      <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderColor: '#FCB97D' }}>
                        <TouchableNativeFeedback
                          onPress={() => this.takeAPhoto() }
                          background={TouchableNativeFeedback.Ripple('#C7CCB9')}>
                          <View style={{paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                              source={require('../img/camera.png')}
                              style={{ height: 80, width: 80, marginBottom: 4 }}
                            />
                            <Text style={{ color: '#A6A2A2' }}>Take a Photo</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableNativeFeedback
                          onPress={() => this.selectAPhoto() }
                          background={TouchableNativeFeedback.Ripple('#C7CCB9')}>
                          <View style={{paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                              source={require('../img/gallery.png')}
                              style={{ height: 80, width: 80, marginBottom: 4 }}
                            />
                            <Text style={{ color: '#A6A2A2' }}>Select a Photo</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </View>
                    <View style={{ marginTop: 8, marginBottom: 8 }}>
                      <Text style={{ textAlign: 'center' }}>or</Text>
                    </View>
                    <View>
                      <TouchableNativeFeedback
                        onPress={() => this.openDiseasesList() }
                        background={TouchableNativeFeedback.Ripple('#C7CCB9')}>
                        <View style={{paddingHorizontal: 16, paddingVertical: 8, borderColor: '#E6AF2E', borderWidth: 1.5, borderRadius: 3  }}>
                          <Text style={{ color: '#A6A2A2', textAlign: 'center', fontWeight: 'bold' }}>View Lists of Mango Diseases</Text>
                        </View>
                      </TouchableNativeFeedback>
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
              paddingHorizontal: 25,
              position: 'relative'
            }}>
              <Text style={{ textAlign: 'center', fontSize: 10 }}>
              @Copyright - BSCS 2018
              </Text>
              <Text style={{ position: 'absolute', right: 3, bottom: 3, fontSize: 8 }}>
                박윤후
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
