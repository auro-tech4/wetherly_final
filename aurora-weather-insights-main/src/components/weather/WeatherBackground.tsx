import { useEffect, useState } from 'react';
import { WeatherCondition } from '@/data/mockWeather';

interface Props {
  condition: WeatherCondition;
}

const WeatherBackground = ({ condition }: Props) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 3 + 1,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, hsl(185 100% 50% / 0.15), transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, hsl(220 100% 60% / 0.2), transparent 70%)' }} />

      {/* Stars for night */}
      {(condition === 'night' || condition === 'cloudy') && particles.map(p => (
        <div key={p.id} className="absolute rounded-full bg-foreground/60"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            animation: `twinkle ${2 + p.delay}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }} />
      ))}

      {/* Rain */}
      {(condition === 'rain' || condition === 'thunderstorm') && Array.from({ length: 40 }, (_, i) => (
        <div key={`rain-${i}`} className="absolute w-px bg-primary/40"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${20 + Math.random() * 30}px`,
            animation: `rain-fall ${0.5 + Math.random() * 0.5}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }} />
      ))}

      {/* Lightning */}
      {condition === 'thunderstorm' && (
        <div className="absolute inset-0 bg-primary/5" style={{ animation: 'lightning 4s ease-in-out infinite' }} />
      )}

      {/* Floating clouds */}
      {(condition === 'cloudy' || condition === 'rain') && [0, 1, 2].map(i => (
        <div key={`cloud-${i}`} className="absolute opacity-10"
          style={{
            top: `${10 + i * 15}%`,
            animation: `cloud-drift ${20 + i * 10}s linear infinite`,
            animationDelay: `${i * 7}s`,
            fontSize: `${60 + i * 20}px`,
          }}>☁️</div>
      ))}

      {/* Sun glow */}
      {condition === 'sunny' && (
        <div className="absolute -top-20 right-20 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(45 100% 60%), transparent 70%)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
      )}

      {/* Moon */}
      {condition === 'night' && (
        <div className="absolute top-16 right-24 text-6xl opacity-30 animate-float">🌙</div>
      )}

      {/* Floating particles */}
      {particles.slice(0, 20).map(p => (
        <div key={`particle-${p.id}`} className="absolute w-1 h-1 rounded-full bg-primary/20 animate-float"
          style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
};

export default WeatherBackground;
