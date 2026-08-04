import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { ShieldCheck, ArrowLeft, XCircle } from 'lucide-react-native';
import { globalStyles, COLORS } from '../theme';
import { apiClient } from '../api/client';

export const ScannerScreen = ({ navigation }: any) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    try {
      // Send the scanned checkpoint ID to the server
      const res = await apiClient.post('/api/tenant/scans', {
        checkpoint_id: data,
        notes: 'Scanned via Pulse Mobile'
      });
      
      if (res.data.success) {
        Alert.alert(
          'Patrol Verified',
          'Checkpoint scanned successfully.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (err: any) {
      Alert.alert(
        'Scan Failed',
        err.response?.data?.error || 'Invalid QR code or network error.',
        [{ text: 'Try Again', onPress: () => setScanned(false) }]
      );
    }
  };

  if (hasPermission === null) {
    return <View style={globalStyles.container} />;
  }
  if (hasPermission === false) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <XCircle color={COLORS.danger} size={48} />
        <Text style={{ color: COLORS.white, marginTop: 16 }}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Scan Checkpoint</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1 }}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Overlay Scanner Frame */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>

      <View style={{ padding: 24, backgroundColor: COLORS.surface }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck color={COLORS.primary} size={24} style={{ marginRight: 10 }} />
          <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: 'bold' }}>
            Point camera at Patrol QR Code
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  }
});
