import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [webViewUrl, setWebViewUrl] = useState('https://cocorico-app.vercel.app');

  useEffect(() => {
    // Request notification permissions
    registerForPushNotificationsAsync();
    
    // For development, you can switch to localhost
    // setWebViewUrl('http://localhost:3000');
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#e43f30',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: webViewUrl }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        // Allow camera and microphone access
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        // Improve performance
        androidHardwareAccelerationDisabled={false}
        // Handle navigation
        onNavigationStateChange={(navState) => {
          // You can intercept navigation here if needed
          console.log('Navigated to:', navState.url);
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e1',
  },
  webview: {
    flex: 1,
  },
});
