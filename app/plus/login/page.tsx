'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPortal from '@/components/plus/LoginPortal';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const currentUser = useEnterpriseStore(state => state.currentUser);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && currentUser) {
      router.push('/plus');
    }
  }, [isClient, currentUser, router]);

  if (!isClient) return null;

  return <LoginPortal />;
}
