'use client';

import { useState, useEffect } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useOperationsStore } from '@/store/useOperationsStore';
import { MapPin, ShieldAlert, Activity, Wifi, Radio } from 'lucide-react';
import dynamic from 'next/dynamic';

// Next.js needs dynamic import for react-leaflet to prevent SSR window issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function LiveMapView() {
  const { currentUser, guards } = useEnterpriseStore();
  const { geofencePosts } = useOperationsStore();

  const isSuperAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';

  const scopedPosts = geofencePosts.filter(p =>
    isSuperAdmin || isHO || p.siteId === currentUser?.assignedSiteId
  );
  
  const scopedGuards = guards.filter(g =>
    (isSuperAdmin || isHO || g.assignedSiteId === currentUser?.assignedSiteId) && g.status === 'On Duty'
  );

  // We will assign random live coordinates to guards near their assigned posts to simulate live tracking
  const [liveGuards, setLiveGuards] = useState<{ id: string, name: string, lat: number, lng: number, postName: string, isBreaching: boolean }[]>([]);

  useEffect(() => {
    // Generate initial live coordinates for guards based on their assigned post's geofence
    const simulateGuards = () => {
      const active = scopedGuards.map(guard => {
        const post = scopedPosts.find(p => p.postName === guard.assignedPost) || scopedPosts[0];
        if (!post) return null;

        // Simulate position - 80% chance inside geofence, 20% breaching
        const isBreaching = Math.random() > 0.8;
        const drift = isBreaching ? (post.radiusMeters + 50) / 111320 : (post.radiusMeters * 0.5) / 111320; 
        // 111320 meters approx 1 degree lat

        return {
          id: guard.id,
          name: guard.name,
          postName: post.postName,
          lat: post.centerLat + (Math.random() - 0.5) * drift * 2,
          lng: post.centerLng + (Math.random() - 0.5) * drift * 2,
          isBreaching
        };
      }).filter(Boolean) as typeof liveGuards;

      setLiveGuards(active);
    };

    simulateGuards();
    
    // Simulate guards moving slightly every 5 seconds
    const interval = setInterval(simulateGuards, 5000);
    return () => clearInterval(interval);
  }, [scopedGuards.length, scopedPosts.length]);

  // Center map on the first geofence post
  const centerLat = scopedPosts.length > 0 ? scopedPosts[0].centerLat : 28.6139;
  const centerLng = scopedPosts.length > 0 ? scopedPosts[0].centerLng : 77.2090;

  const breaches = liveGuards.filter(g => g.isBreaching).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radio size={22} className="text-blue-400" /> Live Operations Map
          </h2>
          <p className="text-sm text-gray-400 mt-1">Real-time guard tracking and geofence breach monitoring</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-900 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3">
             <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-sm text-gray-300">{liveGuards.length} Active</span>
             </div>
             <div className="w-px h-4 bg-white/10"></div>
             <div className="flex items-center gap-1.5">
               <ShieldAlert size={14} className={breaches > 0 ? 'text-red-400' : 'text-gray-500'} />
               <span className={`text-sm ${breaches > 0 ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
                 {breaches} Breaches
               </span>
             </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-white/10 relative z-0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        
        {typeof window !== 'undefined' && (
          <MapContainer 
            center={[centerLat, centerLng]} 
            zoom={16} 
            scrollWheelZoom={true} 
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {/* Draw Geofences */}
            {scopedPosts.map(post => (
              <Circle 
                key={post.id}
                center={[post.centerLat, post.centerLng]}
                radius={post.radiusMeters}
                pathOptions={{ 
                  color: '#3b82f6', 
                  fillColor: '#3b82f6', 
                  fillOpacity: 0.1,
                  weight: 2,
                  dashArray: '4'
                }}
              >
                <Popup>
                  <div className="text-center text-black">
                    <p className="font-bold">{post.postName}</p>
                    <p className="text-xs text-gray-600">{post.radiusMeters}m radius</p>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Draw Guards */}
            {liveGuards.map(guard => {
              const iconHtml = `<div style="background-color: ${guard.isBreaching ? '#ef4444' : '#10b981'}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px ${guard.isBreaching ? '#ef4444' : '#10b981'};"></div>`;
              
              // We use L.divIcon dynamically here to avoid importing L globally on SSR
              const L = require('leaflet');
              const customIcon = L.divIcon({
                html: iconHtml,
                className: '',
                iconSize: [14, 14],
                iconAnchor: [7, 7]
              });

              return (
                <Marker 
                  key={guard.id} 
                  position={[guard.lat, guard.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="text-black">
                      <p className="font-bold">{guard.name}</p>
                      <p className="text-xs text-gray-600 mt-1">Assigned: {guard.postName}</p>
                      {guard.isBreaching && (
                        <p className="text-xs text-red-600 font-bold mt-1">⚠️ Out of Bounds</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
