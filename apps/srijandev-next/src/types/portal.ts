export type PortalType = 'corporate' | 'platform' | 'pulse';

export interface PortalContextType {
  activePortal: PortalType;
  switchPortal: (portal: PortalType) => void;
  isSwitching: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}
