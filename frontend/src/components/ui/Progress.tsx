// A simple reusable circular tracer component using SVG
export function CircularTracer({ value, max, label, color }: { value: number, max: number, label: string, color: string }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const dashoffset = circumference - progress * circumference;

  return (
    <div className="circular-tracer-container">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle 
          cx="60" cy="60" r={radius} 
          fill="transparent" 
          stroke="var(--border-color)" 
          strokeWidth="8" 
        />
        <circle 
          cx="60" cy="60" r={radius} 
          fill="transparent" 
          stroke={color} 
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="tracer-content">
        <div className="tracer-value">{value}</div>
        <div className="tracer-label">{label}</div>
      </div>
    </div>
  );
}

export function ProgressBar({ label, current, target, unit, color }: { label: string, current: number, target: number, unit: string, color: string }) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{current} / {target} {unit}</span>
      </div>
      <div className="macro-progress-bar">
        <div className="macro-fill" style={{ width: `${percent}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
}
