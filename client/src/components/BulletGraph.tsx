interface BulletGraphProps {
  title: string;
  subtitle?: string;
  value: number;
  target: number;
  max: number;
  ranges?: {
    poor: number;
    satisfactory: number;
    good: number;
  };
  unit?: string;
  compact?: boolean;
}

const BulletGraph = ({ 
  title, 
  subtitle, 
  value, 
  target, 
  max, 
  ranges,
  unit = '',
  compact = false 
}: BulletGraphProps) => {
  // Default ranges if not provided (thirds of max)
  const defaultRanges = ranges || {
    poor: max * 0.33,
    satisfactory: max * 0.66,
    good: max
  };

  const valuePercent = Math.min((value / max) * 100, 100);
  const targetPercent = Math.min((target / max) * 100, 100);
  const poorPercent = (defaultRanges.poor / max) * 100;
  const satisfactoryPercent = (defaultRanges.satisfactory / max) * 100;
  const goodPercent = (defaultRanges.good / max) * 100;

  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
  };

  return (
    <div className={`${compact ? 'py-3' : 'py-4'}`}>
      {/* Title and Values */}
      <div className="flex justify-between items-baseline mb-2">
        <div>
          <h4 className={`font-medium text-[var(--text-primary)] ${compact ? 'text-sm' : 'text-base'}`}>
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="text-right">
          <span className={`font-semibold text-[var(--text-primary)] ${compact ? 'text-sm' : 'text-lg'}`}>
            {formatValue(value)}{unit}
          </span>
          <div className="text-xs text-[var(--text-secondary)]">
            Target: {formatValue(target)}{unit}
          </div>
        </div>
      </div>

      {/* Bullet Graph */}
      <div className="relative">
        {/* Background ranges */}
        <div className="relative h-6 bg-[var(--bullet-poor)] rounded-sm overflow-hidden">
          {/* Satisfactory range */}
          <div 
            className="absolute left-0 top-0 h-full bg-[var(--bullet-satisfactory)]"
            style={{ width: `${satisfactoryPercent}%` }}
          />
          {/* Good range */}
          <div 
            className="absolute left-0 top-0 h-full bg-[var(--bullet-good)]"
            style={{ width: `${poorPercent}%` }}
          />
          {/* Excellent range */}
          <div 
            className="absolute left-0 top-0 h-full bg-[var(--bullet-excellent)]"
            style={{ width: `${goodPercent}%` }}
          />
          
          {/* Actual value bar */}
          <div 
            className="absolute left-0 top-1 h-4 bg-[var(--text-primary)] rounded-sm transition-all duration-300"
            style={{ width: `${valuePercent}%` }}
          />
          
          {/* Target marker */}
          <div 
            className="absolute top-0 w-0.5 h-full bg-[var(--bullet-target)] z-10"
            style={{ left: `${targetPercent}%` }}
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between mt-1 text-xs text-[var(--text-muted)]">
          <span>0</span>
          <span>{formatValue(max)}{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default BulletGraph;