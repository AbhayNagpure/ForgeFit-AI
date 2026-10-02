import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Play, Search, Shield, Sparkles, Star, X } from 'lucide-react';
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from './exerciseData';

export function Workouts() {
  const [selectedGroup, setSelectedGroup] = useState(MUSCLE_GROUPS[0]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;

    const stopPreviewsWhileScrolling = () => {
      previewScrollInProgress = true;
      pauseActivePreview();
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        previewScrollInProgress = false;
        if (!canHover) playClosestVisiblePreview();
      }, 260);
    };

    window.addEventListener('scroll', stopPreviewsWhileScrolling, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', stopPreviewsWhileScrolling, true);
      if (scrollTimer) clearTimeout(scrollTimer);
      previewScrollInProgress = false;
      pauseActivePreview();
    };
  }, []);

  const groupedExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = EXERCISE_LIBRARY.filter((exercise) => {
      const matchesGroup = exercise.group === selectedGroup;
      const searchable = `${exercise.name} ${exercise.target} ${exercise.subGroup}`.toLowerCase();
      return matchesGroup && (!normalizedQuery || searchable.includes(normalizedQuery));
    });

    return filtered.reduce((groups, exercise) => {
      if (!groups[exercise.subGroup]) groups[exercise.subGroup] = [];
      groups[exercise.subGroup].push(exercise);
      return groups;
    }, {} as Record<string, typeof EXERCISE_LIBRARY>);
  }, [query, selectedGroup]);

  const exerciseCount = Object.values(groupedExercises).reduce((count, exercises) => count + exercises.length, 0);

  return (
    <div className="training-page">
      <section className="training-controls">
        <div className="training-intro">
          <div><span className="eyebrow">Movement library</span><h2>{selectedGroup} exercises</h2><p>Form cues and exercise options for your available equipment.</p></div>
          <span className="exercise-count">{exerciseCount} movements</span>
        </div>

        <label className="exercise-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${selectedGroup.toLowerCase()} exercises`} />
          {query ? <button type="button" onClick={() => setQuery('')} aria-label="Clear exercise search"><X size={16} /></button> : null}
        </label>

        <div className="muscle-chip-rail" role="tablist" aria-label="Muscle group">
          {MUSCLE_GROUPS.map((group) => (
            <button
              type="button"
              role="tab"
              aria-selected={selectedGroup === group}
              className={selectedGroup === group ? 'active' : ''}
              key={group}
              onClick={() => { setSelectedGroup(group); setQuery(''); }}
            >
              {group}
            </button>
          ))}
        </div>
      </section>

      <div className="exercise-groups">
        {Object.entries(groupedExercises).map(([subGroup, exercises]) => (
          <section className="exercise-group" key={subGroup}>
            <div className="exercise-group-title">
              <span><ChevronRight size={17} /></span>
              <h3>{cleanSubGroup(subGroup)}</h3>
              <small>{exercises.length}</small>
            </div>
            <div className="exercise-grid">
              {exercises.map((exercise) => (
                <article className="exercise-card" key={`${exercise.subGroup}-${exercise.name}`}>
                  <div className="exercise-media">
                    {exercise.videoPlaceholder.endsWith('.mp4') ? (
                      <ExercisePreview src={exercise.videoPlaceholder} name={exercise.name} />
                    ) : <div className="exercise-media-fallback" style={{ backgroundImage: `url(${exercise.videoPlaceholder})` }} />}
                    <span className={`rating-badge ${exercise.rating.toLowerCase()}`}>
                      {exercise.rating === 'Essential' ? <Star size={12} fill="currentColor" /> : exercise.rating === 'Recommended' ? <Sparkles size={12} /> : <Shield size={12} />}
                      {exercise.rating}
                    </span>
                  </div>
                  <div className="exercise-body">
                    <div><h4>{exercise.name}</h4><span className="target-label">{exercise.target}</span></div>
                    <ul>{exercise.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        {!exerciseCount ? <div className="exercise-empty"><Search size={24} /><strong>No matching exercises</strong><span>Try a shorter exercise name or clear the search.</span><button onClick={() => setQuery('')}>Clear search</button></div> : null}
      </div>
    </div>
  );
}

function cleanSubGroup(value: string) {
  return value.replace(/^[^A-Za-z0-9]+/, '');
}

let activePreview: HTMLVideoElement | null = null;
let previewScrollInProgress = false;

function playPreview(video: HTMLVideoElement) {
  if (previewScrollInProgress || activePreview === video) return;
  if (activePreview) activePreview.pause();
  activePreview = video;
  void video.play().catch(() => {
    if (activePreview === video) activePreview = null;
  });
}

function pausePreview(video: HTMLVideoElement) {
  video.pause();
  if (activePreview === video) activePreview = null;
}

function pauseActivePreview() {
  if (!activePreview) return;
  const video = activePreview;
  activePreview = null;
  video.pause();
}

function playClosestVisiblePreview() {
  const viewportCenter = window.innerHeight / 2;
  let closestVideo: HTMLVideoElement | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  document.querySelectorAll<HTMLVideoElement>('.training-page .exercise-preview video').forEach((video) => {
    const bounds = video.getBoundingClientRect();
    const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0);
    if (visibleHeight < bounds.height * 0.6) return;
    const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestVideo = video;
    }
  });

  if (closestVideo) playPreview(closestVideo);
}

function ExercisePreview({ src, name }: { src: string; name: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hoverCapableRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    hoverCapableRef.current = canHover;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.35) pausePreview(video);
      else if (!canHover && entry.intersectionRatio >= 0.8) playPreview(video);
    }, { threshold: [0, 0.35, 0.8] });

    const stopWhenHidden = () => { if (document.hidden) pausePreview(video); };
    observer.observe(video);
    document.addEventListener('visibilitychange', stopWhenHidden);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', stopWhenHidden);
      pausePreview(video);
    };
  }, []);

  return (
    <div
      className={`exercise-preview ${isPlaying ? 'playing' : ''}`}
      onMouseEnter={() => { if (hoverCapableRef.current && videoRef.current) playPreview(videoRef.current); }}
      onMouseLeave={() => { if (hoverCapableRef.current && videoRef.current) pausePreview(videoRef.current); }}
      onFocus={() => { if (videoRef.current) playPreview(videoRef.current); }}
      onBlur={() => { if (videoRef.current) pausePreview(videoRef.current); }}
      tabIndex={0}
      aria-label={`Preview ${name} demonstration`}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${name} demonstration`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <span className="preview-status" aria-hidden="true"><Play size={11} fill="currentColor" /> Preview</span>
    </div>
  );
}
