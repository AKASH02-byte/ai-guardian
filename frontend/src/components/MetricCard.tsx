import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  trendIsGood?: boolean;
  highlightColor?: 'blue' | 'rose' | 'amber' | 'emerald' | 'slate';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  trendIsGood = false,
  highlightColor = 'slate'
}) => {
  let borderLeft = 'border-l-4 border-slate-300';
  if (highlightColor === 'rose') borderLeft = 'border-l-4 border-rose-500';
  if (highlightColor === 'amber') borderLeft = 'border-l-4 border-amber-500';
  if (highlightColor === 'blue') borderLeft = 'border-l-4 border-blue-600';
  if (highlightColor === 'emerald') borderLeft = 'border-l-4 border-emerald-500';

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 shadow-2xs ${borderLeft} transition-all`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline justify-between mt-2">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${
              trendIsGood
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'stable' && <Minus className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};
