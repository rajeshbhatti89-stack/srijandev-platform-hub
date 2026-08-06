import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For local Android emulator testing, localhost is 10.0.2.2
// In production, this should be https://api.srijandev.in
const API_URL = 'https://api.srijandev.in';

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
      // Use the proper JWT token provided by the updated backend
      // Fallback to id for backward compatibility during testing if token doesn't exist
      config.headers['Authorization'] = `Bearer ${parsed.token || parsed.id}`; 
    }
  } catch (e) {
    console.error('Error fetching session data', e);
  }
  return config;
});

// Interceptor to handle network errors and offline/weak network connections
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is related to network issues or timeouts
    if (!error.response) {
      // Network error, Server offline, or CORS issue
      alert('Network Error: Please check your connection and try again.');
    } else if (error.code === 'ECONNABORTED') {
      alert('Connection Timeout: The network is weak or the server is unresponsive.');
    }
    return Promise.reject(error);
  }
);

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
