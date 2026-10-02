import { Activity, ArrowUpRight, CalendarDays, Dumbbell, Moon, Target, Utensils } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const sameLocalDay = (value: string, target = new Date()) => new Date(value).toDateString() === target.toDateString();

export function Today() {
  const { workouts, userProfile, bodyMetrics, progressSummary } = useAppContext();
  const todaysWorkouts = workouts.filter((workout) => sameLocalDay(workout.date));
  const todaysNutrition = (userProfile?.nutritionLogs ?? []).filter((entry) => sameLocalDay(entry.date));
  const todaysMetric = bodyMetrics.find((metric) => sameLocalDay(metric.date));
  const calories = todaysNutrition.reduce((sum, entry) => sum + entry.calories, 0);
  const protein = todaysNutrition.reduce((sum, entry) => sum + entry.protein, 0);
  const trainingMinutes = todaysWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const calorieTarget = userProfile?.dailyCalories || null;
  const proteinTarget = userProfile?.dailyProtein || null;
  const calorieProgress = calorieTarget ? Math.min(100, Math.round((calories / calorieTarget) * 100)) : 0;
  const proteinProgress = proteinTarget ? Math.min(100, Math.round((protein / proteinTarget) * 100)) : 0;
  const firstName = userProfile?.name?.split(' ')[0] || 'Athlete';

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <div className="eyebrow"><CalendarDays size={14} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <h2>Good to see you, {firstName}.</h2>
          <p>
            {todaysWorkouts.length
              ? `You have logged ${trainingMinutes} training minutes today. Keep the next decision simple.`
              : 'No training is logged today. Start when you are ready, or use Forge to adapt the plan.'}
          </p>
        </div>
        <div className="hero-score">
          <span>{progressSummary?.currentStreak ?? 0}</span>
          <small>day streak</small>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-icon"><Activity size={19} /></div>
          <div><span>Training today</span><strong>{trainingMinutes || '—'} {trainingMinutes ? <small>min</small> : null}</strong></div>
        </article>
        <article className="metric-card">
          <div className="metric-icon violet"><Moon size={19} /></div>
          <div><span>Sleep logged</span><strong>{todaysMetric?.sleep ?? '—'} {todaysMetric?.sleep ? <small>hours</small> : null}</strong></div>
        </article>
        <article className="metric-card">
          <div className="metric-icon blue"><Utensils size={19} /></div>
          <div><span>Meals logged</span><strong>{todaysNutrition.length}</strong></div>
        </article>
        <article className="metric-card">
          <div className="metric-icon coral"><Target size={19} /></div>
          <div><span>Weekly sessions</span><strong>{workouts.filter((workout) => Date.now() - new Date(workout.date).getTime() < 7 * 86_400_000).length}</strong></div>
        </article>
      </section>

      <section className="content-grid content-grid-wide">
        <article className="surface-card nutrition-card">
          <div className="section-heading">
            <div><span className="eyebrow">Daily fuel</span><h3>Nutrition targets</h3></div>
            <Utensils size={20} />
          </div>
          <div className="nutrition-total">
            <div><strong>{calories.toLocaleString()}</strong><span>{calorieTarget ? `of ${calorieTarget.toLocaleString()} kcal` : 'kcal logged'}</span></div>
            <span className="progress-number">{calorieTarget ? `${calorieProgress}%` : 'No target'}</span>
          </div>
          <div className="track"><span style={{ width: `${calorieProgress}%` }} /></div>
          <div className="macro-row">
            <div><span>Protein</span><strong>{protein}g {proteinTarget ? `/ ${proteinTarget}g` : ''}</strong></div>
            <div className="mini-track"><span style={{ width: `${proteinProgress}%` }} /></div>
          </div>
          {!calorieTarget || !proteinTarget ? <p className="helper-text">Ask Forge to calculate and save targets after it confirms your goal and baseline.</p> : null}
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div><span className="eyebrow">Today</span><h3>Meals</h3></div>
            <span className="count-pill">{todaysNutrition.length}</span>
          </div>
          <div className="compact-list">
            {todaysNutrition.length ? todaysNutrition.map((entry) => (
              <div className="compact-row" key={entry.id}>
                <div><strong>{entry.foodName}</strong><span>{entry.protein}g protein · {entry.source === 'ai_estimate' ? `AI estimate${entry.confidence ? ` · ${Math.round(entry.confidence * 100)}% confidence` : ''}` : 'label data'}</span></div>
                <b>{entry.calories} kcal</b>
              </div>
            )) : <EmptyState icon={<Utensils size={22} />} title="Nothing logged yet" body="Tell Forge what you ate and include the portion for a better estimate." />}
          </div>
        </article>
      </section>

      <section className="surface-card">
        <div className="section-heading">
          <div><span className="eyebrow">Session log</span><h3>Today’s training</h3></div>
          <Dumbbell size={20} />
        </div>
        <div className="session-list">
          {todaysWorkouts.length ? todaysWorkouts.map((workout) => (
            <div className="session-row" key={workout.id}>
              <div className="session-mark"><Dumbbell size={18} /></div>
              <div className="session-main"><strong>{workout.name}</strong><span>{workout.type} · {workout.exercises?.length ?? 0} exercises</span></div>
              <strong>{workout.duration} min</strong>
              <ArrowUpRight size={17} className="muted-icon" />
            </div>
          )) : <EmptyState icon={<Dumbbell size={22} />} title="No session recorded" body="A rest day is valid. If you trained, Forge can log the session in one message." />}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return <div className="empty-state"><div>{icon}</div><strong>{title}</strong><span>{body}</span></div>;
}
