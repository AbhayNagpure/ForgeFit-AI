

export type MascotState = 
  | 'idle' | 'warmingUp' | 'lifting' | 'pushUps' | 'resting' | 'hydration'
  | 'progress' | 'excited' | 'running' | 'protein' | 'stretching' | 'strong'
  | 'pr' | 'frustrated' | 'thinking' | 'celebration' | 'postWorkout' | 'sleep';

const SPRITE_MAP: Record<MascotState, { x: number, y: number }> = {
  idle: { x: 0, y: 0 },
  warmingUp: { x: 20, y: 0 },
  lifting: { x: 40, y: 0 },
  pushUps: { x: 60, y: 0 },
  resting: { x: 80, y: 0 },
  hydration: { x: 100, y: 0 },
  
  progress: { x: 0, y: 50 },
  excited: { x: 20, y: 50 },
  running: { x: 40, y: 50 },
  protein: { x: 60, y: 50 },
  stretching: { x: 80, y: 50 },
  strong: { x: 100, y: 50 },
  
  pr: { x: 0, y: 100 },
  frustrated: { x: 20, y: 100 },
  thinking: { x: 40, y: 100 },
  celebration: { x: 60, y: 100 },
  postWorkout: { x: 80, y: 100 },
  sleep: { x: 100, y: 100 },
};

type MascotProps = {
  state?: MascotState;
  size?: number;
  animated?: boolean;
};

export function Mascot({ state = 'idle', size = 120, animated = true }: MascotProps) {
  const pos = SPRITE_MAP[state] || SPRITE_MAP.idle;
  
  return (
    <div style={{ 
      width: size, 
      height: size, 
      overflow: 'hidden', 
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      position: 'relative',
      WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 70%)',
      maskImage: 'radial-gradient(circle, black 60%, transparent 70%)',
      animation: animated ? 'floatMascot 3s ease-in-out infinite' : 'none'
    }}>
      {/* Background glow */}
      <div style={{ 
        position: 'absolute', 
        width: '60%', 
        height: '60%', 
        top: '20%',
        backgroundColor: 'var(--accent)', 
        filter: 'blur(30px)', 
        opacity: 0.2, 
        borderRadius: '50%',
        animation: animated ? 'pulseGlow 3s ease-in-out infinite' : 'none',
        zIndex: 0
      }} />

      {/* The sprite */}
      <div style={{
        width: size * 1.35, // scale up slightly to crop sides
        height: size * 1.5, // scale up more vertically to push text down out of view
        backgroundImage: 'url(/mascot_sprite.jpg)',
        backgroundSize: '600% 300%',
        backgroundPosition: `${pos.x}% ${pos.y}%`,
        zIndex: 1,
        marginTop: -(size * 0.1) // nudge up to center the face
      }} />
    </div>
  );
}
