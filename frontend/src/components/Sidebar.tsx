import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Server,
  Bug,
  Flame,
  ShieldCheck,
  TrendingUp,
  Sliders,
  Sparkles,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react';
import { Logo } from './Logo';

export type NavItem =
  | 'overview'
  | 'risk-intelligence'
  | 'assets'
  | 'vulnerabilities'
  | 'threats'
  | 'controls'
  | 'optimizer'
  | 'simulator'
  | 'recommendations'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'risk-intelligence', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'assets', label: 'Assets', icon: Server },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    { id: 'threats', label: 'Threats', icon: Flame },
    { id: 'controls', label: 'Security Controls', icon: ShieldCheck },
    { id: 'optimizer', label: 'Investment Optimizer', icon: TrendingUp },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 no-print flex-shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Logo size="md" />
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
          SIH26105
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavItem)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-slate-300">Team BYTE</span>
          <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/20 font-mono">LIVE API</span>
        </div>
        <p className="text-[11px] text-slate-500 truncate">Bharat Financial Services</p>
      </div>
    </aside>
  );
};
