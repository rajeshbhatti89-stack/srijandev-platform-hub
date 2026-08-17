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

  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, data: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  setActiveTenant: (id: string | null) => void;
  getActiveTenant: () => Tenant | null;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      tenants: SEED_TENANTS,
      activeTenantId: 'TENANT-001',

      addTenant: (tenant) => set(state => ({ tenants: [tenant, ...state.tenants] })),
      updateTenant: (id, data) => set(state => ({
        tenants: state.tenants.map(t => t.id === id ? { ...t, ...data } : t),
      })),
      deleteTenant: (id) => set(state => ({
        tenants: state.tenants.filter(t => t.id !== id),
      })),
      setActiveTenant: (id) => set({ activeTenantId: id }),
      getActiveTenant: () => {
        const { tenants, activeTenantId } = get();
        return tenants.find(t => t.id === activeTenantId) ?? null;
      },
    }),
    { name: 'srijandev-tenant-v1' }
  )
);
