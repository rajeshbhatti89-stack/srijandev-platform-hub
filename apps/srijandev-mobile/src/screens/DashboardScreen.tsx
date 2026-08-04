import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Clock, MapPin, Navigation, Power, CheckCircle, ShieldCheck } from 'lucide-react-native';
import * as Location from 'expo-location';
import { globalStyles, COLORS } from '../theme';
import { apiClient, getSession, clearSession } from '../api/client';
import { connectTelemetry, sendGPSUpdate, disconnectTelemetry } from '../api/websocket';

export const DashboardScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationWatcher, setLocationWatcher] = useState<any>(null);

  useEffect(() => {
    loadUser();
    return () => {
      stopTracking();
      disconnectTelemetry();
    };
  }, []);

  const loadUser = async () => {
    const session = await getSession();
    if (!session) {
      navigation.replace('Login');
      return;
    }
    setUser(session);
    // Connect WebSocket
    connectTelemetry();
  };

  const handleLogout = async () => {
    stopTracking();
    disconnectTelemetry();
    await clearSession();
    navigation.replace('Login');
  };

  const toggleDuty = async () => {
    if (!isOnDuty) {
      // Starting Duty (Clock In)
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'GPS permission is required for field duties.');
        return;
      }
      
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      
      try {
        await apiClient.post('/api/tenant/attendance/clock', {
          type: 'clock_in',
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          location_name: 'Field Entry Point'
        });
        
        setIsOnDuty(true);
        startTracking();
      } catch (err) {
        Alert.alert('Clock In Failed', 'Could not record attendance');
      }
    } else {
      // Ending Duty (Clock Out)
      stopTracking();
      try {
        await apiClient.post('/api/tenant/attendance/clock', {
          type: 'clock_out',
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          location_name: 'Field Exit Point'
        });
      } catch (e) {}
      setIsOnDuty(false);
    }
  };

  const startTracking = async () => {
    const watcher = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, timeInterval: 30000, distanceInterval: 10 },
      (loc) => {
        setLocation(loc);
        if (user) {
          sendGPSUpdate(
            user.id, 
            user.name, 
            'Field Zone (Live)', 
            loc.coords.latitude, 
            loc.coords.longitude, 
            85 // mock battery
          );
        }
      }
    );
    setLocationWatcher(watcher);
  };

  const stopTracking = () => {
    if (locationWatcher) {
      locationWatcher.remove();
      setLocationWatcher(null);
    }
  };

  return (
    <ScrollView style={globalStyles.safeArea}>
      <View style={globalStyles.header}>
        <View>
          <Text style={globalStyles.headerTitle}>SrijanDev Pulse</Text>
          <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>{user?.name || 'Agent'} • {user?.tenant_subdomain || 'NCR'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Power color={COLORS.danger} size={24} />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        {/* Status Card */}
        <View style={[globalStyles.card, { alignItems: 'center', paddingVertical: 30, borderColor: isOnDuty ? COLORS.primary : COLORS.border }]}>
          <TouchableOpacity 
            onPress={toggleDuty}
            style={{
              width: 140, height: 140, borderRadius: 70,
              backgroundColor: isOnDuty ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
              borderWidth: 4, borderColor: isOnDuty ? COLORS.primary : COLORS.textSecondary,
              alignItems: 'center', justifyContent: 'center', marginBottom: 20
            }}
          >
            {isOnDuty ? <Navigation color={COLORS.primary} size={48} /> : <Clock color={COLORS.textSecondary} size={48} />}
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '800', color: isOnDuty ? COLORS.primary : COLORS.white }}>
            {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
          </Text>
          <Text style={{ color: COLORS.textSecondary, marginTop: 8 }}>
            {isOnDuty ? 'GPS Tracking Active' : 'Tap circle to Clock In'}
          </Text>
        </View>

        {/* GPS Status */}
        {isOnDuty && location && (
          <View style={[globalStyles.card, { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{ p: 10, borderRadius: 10, backgroundColor: 'rgba(16,185,129,0.1)', marginRight: 15 }}>
              <MapPin color={COLORS.primary} size={24} />
            </View>
            <View>
              <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Live Location Syncing</Text>
              <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>{location.coords.latitude.toFixed(4)}°, {location.coords.longitude.toFixed(4)}°</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <TouchableOpacity 
            style={[globalStyles.card, { flex: 1, marginRight: 8, alignItems: 'center' }]}
            onPress={() => navigation.navigate('Scanner')}
          >
            <ShieldCheck color={COLORS.info} size={32} style={{ marginBottom: 10 }} />
            <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Scan Patrol</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[globalStyles.card, { flex: 1, marginLeft: 8, alignItems: 'center' }]}
            onPress={() => Alert.alert('Coming Soon', 'Incident form will open here')}
          >
            <CheckCircle color={COLORS.warning} size={32} style={{ marginBottom: 10 }} />
            <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Incidents</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
