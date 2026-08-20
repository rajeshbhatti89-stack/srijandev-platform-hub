'use client';

import { useEffect } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useOperationsStore } from '@/store/useOperationsStore';
import { useTenantStore } from '@/store/useTenantStore';

export function GlobalStoreInitializer() {
  const { initEnterprise } = useEnterpriseStore();
  const { initOperations } = useOperationsStore();
  const { initTenants } = useTenantStore();

  useEffect(() => {
    initEnterprise();
    initOperations();
    initTenants();
  }, [initEnterprise, initOperations, initTenants]);

  return null;
}
