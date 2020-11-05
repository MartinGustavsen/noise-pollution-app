import React, { Component } from 'react';
import PushNotification from 'react-native-push-notification';

const Controller = {
  init() {
    PushNotification.configure({
      onNotification(notification) {
        console.log( 'NOTIFICATION:', notification );
      },

      requestPermissions: Platform.OS === 'ios'

    });
  },

  notify(opts) {
    PushNotification.localNotification(opts);
  }
}

export default Controller;