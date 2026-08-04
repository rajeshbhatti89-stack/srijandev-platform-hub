import { Platform } from 'react-native';

const WS_URL = __DEV__ 
  ? (Platform.OS === 'android' ? 'ws://10.0.2.2:3000/ws' : 'ws://localhost:3000/ws')
  : 'wss://api.srijandev.in/ws';

let ws: WebSocket | null = null;
let reconnectTimer: any = null;

export const connectTelemetry = (onMessage?: (data: any) => void) => {
  if (ws) return;

  console.log('[Telemetry] Connecting to WebSocket...', WS_URL);
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('[Telemetry] Connected to SrijanDev Pulse Server');
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (onMessage) onMessage(data);
    } catch (err) {
      console.error('[Telemetry] Parse error:', err);
    }
  };

  ws.onerror = (e) => {
    console.error('[Telemetry] WebSocket error:', e);
  };

  ws.onclose = () => {
    console.log('[Telemetry] Disconnected. Reconnecting in 5s...');
    ws = null;
    reconnectTimer = setTimeout(() => {
      connectTelemetry(onMessage);
    }, 5000);
  };
};

export const sendGPSUpdate = (userId: number, name: string, zone: string, lat: number, lng: number, battery: number) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'GPS_TELEMETRY',
      data: {
        userId,
        name,
        zone,
        lat,
        lng,
        battery,
        timestamp: new Date().toISOString()
      }
    }));
  }
};

export const disconnectTelemetry = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};
