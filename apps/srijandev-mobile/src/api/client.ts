import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For local Android emulator testing, localhost is 10.0.2.2
// In production, this should be https://api.srijandev.in
const API_URL = __DEV__ 
  ? (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000')
  : 'https://api.srijandev.in';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the auth cookie/token
apiClient.interceptors.request.use(async (config) => {
  try {
    const sessionData = await SecureStore.getItemAsync('srijan_user_mobile');
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      // Backend uses cookies, but for mobile we might need to send it in headers
      // Since it's a mobile app, we simulate the cookie or auth header based on the backend implementation
      // For this implementation, we will pass the session info or token
      config.headers['Authorization'] = `Bearer ${parsed.id}`; 
      // Note: Actual backend currently relies on cookies. If needed, the backend can be adjusted 
      // to accept Authorization header for mobile clients.
    }
  } catch (e) {
    console.error('Error fetching session data', e);
  }
  return config;
});

export const saveSession = async (userSession: any) => {
  await SecureStore.setItemAsync('srijan_user_mobile', JSON.stringify(userSession));
};

export const getSession = async () => {
  const data = await SecureStore.getItemAsync('srijan_user_mobile');
  return data ? JSON.parse(data) : null;
};

export const clearSession = async () => {
  await SecureStore.deleteItemAsync('srijan_user_mobile');
};
