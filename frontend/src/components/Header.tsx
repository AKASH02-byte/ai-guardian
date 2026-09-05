import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, Building2, ChevronDown, Check } from 'lucide-react';
import { entityProfiles, type EntityId } from '../data/entityProfiles';

interface HeaderProps {
  pageTitle: string;
  pageSubtitle: string;
  selectedEntity: EntityId;
  onEntityChange: (entityId: EntityId) => void;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, pageSubtitle, selectedEntity, onEntityChange }) => {
  const [isEntityMenuOpen, setIsEntityMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeEntity = entityProfiles.find((entity) => entity.id === selectedEntity) ?? entityProfiles[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsEntityMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  return (
    <header className="bg-[#090d16] border-b border-slate-800/90 px-6 py-4 flex items-center justify-between no-print sticky top-0 z-10 shadow-lg shadow-slate-950/20">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{pageTitle}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{pageSubtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Entity selector */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsEntityMenuOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={isEntityMenuOpen}
            className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-100 text-xs px-3 py-1.5 rounded-md border border-slate-700/80 cursor-pointer transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="max-w-52 truncate">{activeEntity.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform ${isEntityMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isEntityMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-700/80 bg-[#0d1422] p-1.5 shadow-xl shadow-black/40 z-30" role="listbox" aria-label="Select financial entity">
              <p className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Entity benchmarks</p>
              {entityProfiles.map((entity) => {
                const isSelected = entity.id === selectedEntity;
                return (
                  <button
                    key={entity.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => { onEntityChange(entity.id); setIsEntityMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors ${isSelected ? 'bg-blue-500/15 text-blue-100 ring-1 ring-blue-500/35' : 'text-slate-200 hover:bg-slate-800/80'}`}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-md ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <Building2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{entity.name}</span>
                      <span className="block mt-0.5 text-[10px] text-slate-400">{entity.tier}</span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets, CVEs, risks..."
            className="pl-8 pr-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-md text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-slate-900 w-56 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#090d16]"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            AV
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-100 leading-tight">Anand V.</p>
            <p className="text-[10px] text-slate-400">Chief Information Security Officer</p>
          </div>
        </div>
      </div>
    </header>
  );
};
