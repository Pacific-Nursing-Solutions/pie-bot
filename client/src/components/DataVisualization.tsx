import BulletGraph from './BulletGraph';
import { TrendingUp, TrendingDown, DollarSign, Users, Activity } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  target: number;
  max: number;
  unit?: string;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
    period: string;
  };
  ranges?: {
    poor: number;
    satisfactory: number;
    good: number;
  };
}

const KPICard = ({ title, value, target, max, unit, subtitle, trend, ranges }: KPICardProps) => (
  <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-4">
    <BulletGraph
      title={title}
      subtitle={subtitle}
      value={value}
      target={target}
      max={max}
      unit={unit}
      ranges={ranges}
    />
    {trend && (
      <div className="flex items-center mt-2 pt-2 border-t border-[var(--grid-line)]">
        {trend.direction === 'up' ? (
          <TrendingUp className="w-4 h-4 text-[var(--data-success)] mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-[var(--data-danger)] mr-1" />
        )}
        <span className={`text-sm ${trend.direction === 'up' ? 'text-[var(--data-success)]' : 'text-[var(--data-danger)]'}`}>
          {trend.percentage}% {trend.period}
        </span>
      </div>
    )}
  </div>
);

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

const Sparkline = ({ data, color = 'var(--data-primary)', height = 40 }: SparklineProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full relative group" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Hover points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <title>{value.toLocaleString()}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
};

interface CompactMetricProps {
  label: string;
  value: string;
  change?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  sparkline?: number[];
  icon?: React.ReactNode;
}

const CompactMetric = ({ label, value, change, sparkline, icon }: CompactMetricProps) => (
  <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded p-3">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        {icon && <div className="mr-2 text-[var(--text-secondary)]">{icon}</div>}
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      </div>
      {change && (
        <span className={`text-xs ${
          change.direction === 'up' ? 'text-[var(--data-success)]' : 
          change.direction === 'down' ? 'text-[var(--data-danger)]' : 
          'text-[var(--text-muted)]'
        }`}>
          {change.value}
        </span>
      )}
    </div>
    <div className="text-lg font-semibold text-[var(--text-primary)] mb-2">{value}</div>
    {sparkline && (
      <Sparkline 
        data={sparkline} 
        color={change?.direction === 'up' ? 'var(--data-success)' : 'var(--data-primary)'} 
        height={20} 
      />
    )}
  </div>
);

interface DataTableProps {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  compact?: boolean;
}

const DataTable = ({ title, headers, rows, compact = false }: DataTableProps) => (
  <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg">
    <div className="px-4 py-3 border-b border-[var(--grid-line)]">
      <h3 className="font-medium text-[var(--text-primary)]">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--grid-line)]">
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-4 py-2 text-left text-sm font-medium text-[var(--text-secondary)] ${
                  compact ? 'py-1' : 'py-2'
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-[var(--grid-line)] hover:bg-[var(--dashboard-bg)]">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 text-sm text-[var(--text-primary)] ${
                    compact ? 'py-1' : 'py-2'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export { KPICard, CompactMetric, DataTable, Sparkline, BulletGraph };