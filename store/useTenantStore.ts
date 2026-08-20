import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------

export interface PlantSite {
  id: string;
  name: string;
  location: string;
  guardStrength: number; // max/sanctioned guard count
}

export type TenantModule =
  | 'staff' | 'patrol' | 'shifts' | 'leaves' | 'tasks'
  | 'gatepass' | 'geofence' | 'gatelogistics' | 'hodashboard';

export interface Tenant {
  id: string;
  companyName: string;
  subdomain: string; // e.g. "adani" → adani.srijandev.in
  logoUrl: string;
  primaryColor: string; // hex for white-label theming
  assignedModules: TenantModule[];
  plantSites: PlantSite[];
  createdAt: string;
  isActive: boolean;
}

// ---------------------------------------------------------
// SEED DATA
// ---------------------------------------------------------

const SEED_TENANTS: Tenant[] = [];

// ---------------------------------------------------------
// STORE DEFINITION
// ---------------------------------------------------------

interface TenantState {
  tenants: Tenant[];
  activeTenantId: string | null;
  isLoading: boolean;

  initTenants: () => Promise<void>;
  addTenant: (tenant: Tenant) => Promise<void>;
  updateTenant: (id: string, data: Partial<Tenant>) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  setActiveTenant: (id: string | null) => void;
  getActiveTenant: () => Tenant | null;
}

import { fetchTenants, createTenantAction, updateTenantAction, deleteTenantAction } from '@/app/actions/tenantActions';

export const useTenantStore = create<TenantState>((set, get) => ({
  tenants: [],
  activeTenantId: 'TENANT-001',
  isLoading: false,

  initTenants: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchTenants();
      set({ tenants: data || [], isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  addTenant: async (tenant) => {
    set(state => ({ tenants: [tenant, ...state.tenants] }));
    await createTenantAction(tenant);
  },
  
  updateTenant: async (id, data) => {
    set(state => ({
      tenants: state.tenants.map(t => t.id === id ? { ...t, ...data } : t),
    }));
    await updateTenantAction(id, data);
  },
  
  deleteTenant: async (id) => {
    set(state => ({
      tenants: state.tenants.filter(t => t.id !== id),
    }));
    await deleteTenantAction(id);
  },
  
  setActiveTenant: (id) => set({ activeTenantId: id }),
  getActiveTenant: () => {
    const { tenants, activeTenantId } = get();
    return tenants.find(t => t.id === activeTenantId) ?? null;
  },
}));
