'use client';

import { useState, useRef, useEffect } from 'react';
import { useEnterpriseStore, GuardShift } from '@/store/useEnterpriseStore';
import { useOperationsStore } from '@/store/useOperationsStore';
import { Camera, MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

// Haversine formula to calculate distance between two coordinates in meters
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

interface Props {
  guardId: string;
  guardName: string;
  siteId: string;
  post: string;
  shift: GuardShift;
  status: string;
  lastCheckIn?: string;
}

  export default function GuardClockInOut({ guardId, guardName, siteId, post, shift, status, lastCheckIn }: Props) {
    const { logAttendance, updateGuard, users } = useEnterpriseStore();
    const { geofencePosts, logGeofenceCheckIn } = useOperationsStore();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState<'camera' | 'location' | 'success' | 'error'>('camera');
    const [photoBase64, setPhotoBase64] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
  
    const isCheckedIn = status === 'On Duty';
  
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error('Camera access denied:', err);
        setErrorMsg('Camera access is required for attendance.');
        setStep('error');
      }
    };
  
    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  
    useEffect(() => {
      if (isModalOpen && step === 'camera') {
        startCamera();
      } else {
        stopCamera();
      }
      return stopCamera;
    }, [isModalOpen, step]);
  
    const handleCapture = () => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.drawImage(videoRef.current, 0, 0, 300, 400);
          const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.7);
          setPhotoBase64(dataUrl);
          setStep('location');
          verifyLocation(dataUrl);
        }
      }
    };
  
    const verifyLocation = (photoUrl: string) => {
      if (!navigator.geolocation) {
        setErrorMsg('Geolocation is not supported by your device.');
        setStep('error');
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const targetPost = geofencePosts.find(p => p.postName === post && p.siteId === siteId);
          
          if (!targetPost) {
            setErrorMsg('Assigned post geofence not found in database.');
            setStep('error');
            return;
          }
  
          const distance = getDistanceInMeters(latitude, longitude, targetPost.centerLat, targetPost.centerLng);
          
          if (distance <= targetPost.radiusMeters) {
            executeClockInOut(photoUrl, latitude, longitude);
          } else {
            setErrorMsg(`Geofence validation failed. You are ${Math.round(distance)}m away from your post (Max allowed: ${targetPost.radiusMeters}m).`);
            setStep('error');
          }
        },
        (error) => {
          console.error('Location error:', error);
          setErrorMsg('Failed to get your precise location. Please ensure GPS is enabled.');
          setStep('error');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };
  
    const executeClockInOut = (photoUrl: string, lat: number, lng: number) => {
      const isClockingIn = !isCheckedIn;
      const tenantId = users.find(u => u.id === guardId)?.tenantId || 'GLOBAL';
      // Log Attendance
      logAttendance({
        id: `ATT-${Date.now()}`,
        tenantId,
        guardId,
        guardName,
        siteId,
        date: new Date().toISOString().split('T')[0],
        shift,
        status: isClockingIn ? 'Present' : 'Relieved',
        loggedAt: new Date().toISOString(),
        loggedBy: guardName,
        photoUrl,
        lat,
        lng
      });
  
      // Update Guard Status
      updateGuard(guardId, {
        status: isClockingIn ? 'On Duty' : 'Relieved',
        lastCheckIn: isClockingIn ? new Date().toISOString() : undefined
      });

      // Log Geofence Check-in
      if (isClockingIn) {
        const targetPost = geofencePosts.find(p => p.postName === post && p.siteId === siteId);
        if (targetPost) {
          const distance = getDistanceInMeters(lat, lng, targetPost.centerLat, targetPost.centerLng);
          logGeofenceCheckIn({
            id: `GCI-${Date.now()}`,
            tenantId,
            postId: targetPost.id,
            postName: post,
            guardId,
            guardName,
            siteId,
            timestamp: new Date().toISOString(),
            status: 'Verified In-Fence',
            simulatedDistance: Math.round(distance),
          });
        }
      }

    setStep('success');
    setTimeout(() => {
      setIsModalOpen(false);
      setStep('camera');
      setPhotoBase64(null);
    }, 2000);
  };

  return (
    <div className="w-full mt-4">
      <button 
        onClick={() => setIsModalOpen(true)}
        className={`w-full font-bold py-4 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 relative z-10 overflow-hidden shadow-lg ${
          isCheckedIn 
            ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -ml-20 blur-md animate-[shine_2s_infinite]" />
        {isCheckedIn ? <><CheckCircle2 size={18} /> End Shift (Checkout)</> : <><MapPin size={18} /> Clock In</>}
      </button>

      {/* Clock In/Out Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center relative overflow-hidden shadow-2xl">
            <button 
              onClick={() => { setIsModalOpen(false); setStep('camera'); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <XCircle size={24} />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {isCheckedIn ? 'Shift Checkout' : 'Secure Clock-In'}
            </h3>

            {step === 'camera' && (
              <div className="flex flex-col items-center w-full">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500/30 mb-6 bg-black">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} width="300" height="400" className="hidden" />
                </div>
                <p className="text-sm text-gray-400 mb-6 text-center">
                  Please take a clear selfie to verify your identity.
                </p>
                <button 
                  onClick={handleCapture}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Camera size={18} /> Capture Photo
                </button>
              </div>
            )}

            {step === 'location' && (
              <div className="flex flex-col items-center py-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <MapPin size={32} className="text-blue-500" />
                  </div>
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Verifying Location</h4>
                <p className="text-sm text-gray-400 text-center flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Checking GPS against geofence...
                </p>
              </div>
            )}

            {step === 'error' && (
              <div className="flex flex-col items-center py-6 w-full">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <XCircle size={32} className="text-red-500" />
                </div>
                <h4 className="text-lg font-bold text-red-400 mb-2">Verification Failed</h4>
                <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
                  {errorMsg}
                </p>
                <button 
                  onClick={() => setStep('camera')}
                  className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl"
                >
                  Try Again
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center py-8">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400 animate-bounce">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Success!</h4>
                <p className="text-sm text-gray-400 text-center">
                  {isCheckedIn ? 'You have ended your shift.' : 'You have clocked in successfully.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
