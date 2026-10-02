import { Activity, Clock3, Dumbbell, Flame, Scale, Trophy } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function ProgressTracking() {
  const { progressSummary } = useAppContext();
  const summary = progressSummary;
  const maxMinutes = Math.max(1, ...(summary?.weeklyMinutes.map((week) => week.minutes) ?? [1]));

  return (
    <div className="page-stack progress-page">
      <section className="metric-grid metric-grid-three progress-metrics">
        <Metric icon={<Flame size={19} />} label="Current streak" value={`${summary?.currentStreak ?? 0}`} unit="days" />
        <Metric icon={<Dumbbell size={19} />} label="Completed workouts" value={`${summary?.totalWorkouts ?? 0}`} unit="total" tone="blue" />
        <Metric icon={<Clock3 size={19} />} label="Training time" value={`${Math.round((summary?.totalMinutes ?? 0) / 60)}`} unit="hours" tone="violet" />
      </section>

      <section className="content-grid content-grid-wide">
        <article className="surface-card chart-card">
          <div className="section-heading">
            <div><span className="eyebrow">Last eight weeks</span><h3>Training minutes</h3></div>
            <Activity size={20} />
          </div>
          <div className="chart-scroll">
            <div className="bar-chart" aria-label="Weekly training minutes">
              {(summary?.weeklyMinutes ?? []).map((week) => (
                <div className="bar-column" key={week.label}>
                  <span className="bar-value">{week.minutes || '0'}</span>
                  <div className="bar-shell"><div style={{ height: week.minutes ? `${Math.max(4, (week.minutes / maxMinutes) * 100)}%` : '0%' }} /></div>
                  <span>{week.label}</span>
                </div>
              ))}
            </div>
          </div>
          <span className="swipe-hint">Swipe to see all weeks →</span>
          {!summary?.weeklyMinutes.some((week) => week.minutes > 0) ? <p className="helper-text">Complete workouts to build your real training trend.</p> : null}
        </article>

        <article className="surface-card weight-card">
          <div className="section-heading">
            <div><span className="eyebrow">Recorded trend</span><h3>Body weight</h3></div>
            <Scale size={20} />
          </div>
          <div className="weight-number">
            <strong>{summary?.weightTrend.current ?? '—'}</strong>
            <span>{summary?.weightTrend.current ? 'kg' : 'Not logged'}</span>
          </div>
          {summary?.weightTrend.change !== null && summary?.weightTrend.change !== undefined ? (
            <div className={`trend-chip ${summary.weightTrend.change > 0 ? 'up' : 'down'}`}>
              {summary.weightTrend.change > 0 ? '+' : ''}{summary.weightTrend.change} kg across recorded history
            </div>
          ) : <p className="helper-text">Log weight consistently to reveal a trend. Daily fluctuations are normal.</p>}
          <div className="weight-points">
            {(summary?.weightHistory.slice(-8) ?? []).map((entry) => (
              <div key={entry.date}><span>{entry.weight}</span><small>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></div>
            ))}
          </div>
        </article>
      </section>

      <section className="surface-card records-section">
        <div className="section-heading">
          <div><span className="eyebrow">Strength milestones</span><h3>Recent personal records</h3></div>
          <Trophy size={20} />
        </div>
        <div className="records-grid">
          {summary?.personalRecords.length ? summary.personalRecords.map((record) => (
            <article className="record-card" key={record.id}>
              <Trophy size={17} />
              <span>{record.exerciseName}</span>
              <strong>{record.weight} kg</strong>
              <small>{record.reps ? `${record.reps} reps · ` : ''}{new Date(record.date).toLocaleDateString()}</small>
            </article>
          )) : <div className="empty-inline">No records yet. Forge can record a PR when you report one.</div>}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value, unit, tone = '' }: { icon: React.ReactNode; label: string; value: string; unit: string; tone?: string }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div><span>{label}</span><strong>{value} <small>{unit}</small></strong></div></article>;
}
