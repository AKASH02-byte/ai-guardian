import React from 'react';
import { Search, Bell, Building2, ChevronDown } from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  pageSubtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, pageSubtitle }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between no-print sticky top-0 z-10 shadow-xs">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{pageTitle}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{pageSubtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Organization Selector */}
        <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs px-3 py-1.5 rounded-md border border-slate-200 cursor-pointer transition-colors font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-600" />
          <span>Bharat Financial Services Ltd.</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
        </div>

        {/* Global Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets, CVEs, risks..."
            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white w-56 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
            AV
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Anand V.</p>
            <p className="text-[10px] text-slate-500">Chief Information Security Officer</p>
          </div>
        </div>
      </div>
    </header>
  );
};
