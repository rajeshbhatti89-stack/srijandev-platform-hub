import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Activity, Mail, Lock } from 'lucide-react-native';
import { globalStyles, COLORS } from '../theme';
import { apiClient, saveSession } from '../api/client';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      if (res.data.success) {
        await saveSession(res.data.user);
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      console.log('Login error', err.response?.data || err.message);
      Alert.alert('Login Failed', err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[globalStyles.container, { justifyContent: 'center', padding: 24 }]}>
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Activity color={COLORS.primary} size={32} />
        </View>
        <Text style={{ fontSize: 28, fontWeight: '900', color: COLORS.white }}>
          SrijanDev <Text style={{ fontStyle: 'italic', color: COLORS.primary }}>Pulse</Text>
        </Text>
        <Text style={{ fontSize: 12, color: COLORS.textSecondary, letterSpacing: 2, marginTop: 4 }}>
          FIELD FORCE PLATFORM
        </Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <View style={{ position: 'relative', marginBottom: 16 }}>
          <View style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }}>
            <Mail color={COLORS.textSecondary} size={20} />
          </View>
          <TextInput
            style={[globalStyles.input, { paddingLeft: 48 }]}
            placeholder="Agent Email"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }}>
            <Lock color={COLORS.textSecondary} size={20} />
          </View>
          <TextInput
            style={[globalStyles.input, { paddingLeft: 48 }]}
            placeholder="Password"
            placeholderTextColor={COLORS.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity 
        style={globalStyles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={globalStyles.buttonText}>Authenticate & Connect</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
