import { Sparkline } from './DataVisualization';

interface SimpleMetricProps {
  label: string;
  value: string;
  sparklineData: number[];
  trend?: 'up' | 'down' | 'neutral';
  startDate?: string;
  endDate?: string;
}

const SimpleMetric = ({ label, value, sparklineData, trend, startDate, endDate }: SimpleMetricProps) => (
  <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-medium text-[var(--text-secondary)]">{label}</h4>
    </div>
    <div className="flex items-end space-x-4">
      <div className="text-2xl font-semibold text-[var(--text-primary)]">
        {value}
      </div>
      <div className="flex-1">
        <div className="h-8">
          <Sparkline 
            data={sparklineData} 
            color={trend === 'up' ? 'var(--data-success)' : trend === 'down' ? 'var(--data-danger)' : '#c8956d'} 
            height={32} 
          />
        </div>
        {(startDate && endDate) && (
          <div className="flex justify-between mt-1">
            <span className="text-xs text-[var(--text-muted)]">{startDate}</span>
            <span className="text-xs text-[var(--text-muted)]">{endDate}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SimpleMetric;