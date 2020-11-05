/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow strict-local

npx react-native run-android

 TODO:
Storage current MAX

 */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
  Platform
} from 'react-native';

import RNSoundLevel from 'react-native-sound-level';


import NotificationsController from './NotificationsController';



const styles = StyleSheet.create({
  body: {
    backgroundColor: '#ffffff',
  },
  buttonSection: {
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: '100%',
    color: 'white',
  },
  row_space: {
    height: 20
  },
  button: {
      height: 100
  },
  red: {
      backgroundColor: '#ff0000'
  },
  yellow: {
      backgroundColor: '#ffff00'
  },
  green: {
      backgroundColor: '#00ff00'
  }
});



class App extends Component {
  getVolumeRatio(){
    return this.state.currentRaw/this.state.maxVolume;
  }

  setMaxVolume = (data) => {
  
  this.setState({maxVolume:parseInt(data.nativeEvent.text),showTextInput:false});
  }

  selectColor(){
    let ratio = this.getVolumeRatio();

    let colorStyle = ratio>=1 ? styles.red : ratio>=0.7 ? styles.yellow : styles.green;

    return [colorStyle, {width:ratio*100+'%', height:100}];
  }

  getMaxVolume(){
    if(this.state.lastMinuteSounds.length > 0){
      return this.state.lastMinuteSounds.reduce((prev, current) => (prev.value > current.value) ? prev : current).value;
    }
    else{
      return 0;
    }
  }  
  isNoisePollution(seconds){
    let currentTime = new Date();    
    let lastSeconds = new Date(); lastSeconds.setSeconds(currentTime.getSeconds()-seconds);
    let lastNoises = this.state.lastMinuteSounds.filter(x => x.time_stamp > lastSeconds && x.value<this.state.maxVolume).length <= 0 && this.state.currentLoud;
    return lastNoises.length <= 0 && this.state.currentLoud;
    // console.log(this.state.lastMinuteSounds.reduce((prev, current) => (prev.value > current.value) ? prev : current));
  }

  state: { 
    currentRaw: int,
    maxVolume: int,
    showTextInput: bool,
    lastMinuteSounds:array,
    currentLoud: bool,
  } 

  constructor(props: Props) { 
    super(props); 
    this.state = { 
      currentRaw: 0,
      maxVolume:3000,
      showTextInput:false,
      lastMinuteSounds:[],
      currentLoud:false
    }; 
    NotificationsController.init();
  } 

componentDidMount() {
  RNSoundLevel.start();
  RNSoundLevel.onNewFrame = (data) => {
      let currentTime = new Date();
      let minuteAgo = new Date(); minuteAgo.setMinutes(currentTime.getMinutes()-1);
      this.state.lastMinuteSounds.push({value:this.state.currentRaw,time_stamp:currentTime});

    this.setState({
      currentRaw:data.rawValue,
      lastMinuteSounds : this.state.lastMinuteSounds.filter(x => x.time_stamp > minuteAgo),
      currentLoud:this.state.currentRaw>=this.state.maxVolume
      });

    if(this.isNoisePollution(3))
    {

      // NotificationsController.schedule({message:'message!'});
    }
  }
}
componentWillUnmount() {
  RNSoundLevel.stop();
}


  render(){
    return (
    <>
      <StatusBar barStyle="dark-content" />
      
      <View style={{backgroundColor: '#555555'}}>          
        
       

        <View style={styles.buttonSection}> 
          <View style={styles.row_space}/>  
          <Button 
            style={styles.button} 
            title="No Louder Than Now!" 
            onPress={
              (data) => {
                this.setState({maxVolume:this.state.currentRaw});
              }
              }/>
          <View style={styles.row_space}/>  
          <Button 
          style={styles.button}
          title="Set Max Sound!"
            onPress={
              (data) => {
                this.setState({showTextInput:true});
              }
              }/>
          <View style={styles.row_space}/>  
           {/* <Button style={styles.button} title={'Local Push Notification'} onPress={
             (data) => {
               console.log('BTN');
               }} /> */}
          <View style={styles.row_space}/>  

             {this.state.showTextInput ? (
        <TextInput 
        ref={input => this.myInput = input} 
        keyboardType={Platform.OS !== 'ios' ? "numeric" : "number-pad"} 
        onEndEditing={this.setMaxVolume}
        autoFocus={true}
        >
        </TextInput>
        )  : null }
          <View style={styles.row_space}/>  
        </View>   

        <View style={this.selectColor()}/>  

        <Text>{this.state.maxVolume}</Text>

        <Text style={styles.text}>{this.state.currentRaw}/{this.state.maxVolume}</Text> 
        <Text style={styles.text}>Latest highest: {this.getMaxVolume()}</Text> 

        <Text>{this.state.currentDecibel}</Text>
        <Text>{this.state.currentRaw}</Text>
        <Text>{this.state.highestDecibel}</Text>
        <Text>{this.state.highestRaw}</Text>

      <View style={{margin: '100%'}}>    
      </View>   
      </View>  
    </>
  );
  }
};



export default App;
