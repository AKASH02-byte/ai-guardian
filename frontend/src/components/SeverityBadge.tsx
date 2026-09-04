import React from 'react';

interface SeverityBadgeProps {
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'sm' }) => {
  const normalized = severity.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized === 'critical') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
  } else if (normalized === 'high') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
  } else if (normalized === 'medium') {
    styles = 'bg-yellow-50 text-yellow-800 border-yellow-200';
  } else if (normalized === 'low') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border font-sans tracking-wide uppercase ${styles} ${px}`}>
      {severity}
    </span>
  );
};
