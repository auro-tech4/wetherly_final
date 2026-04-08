import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMockMetrics, WeatherMetric } from '@/data/mockWeather';

const RadialCircle = ({ metric, index }: { metric: WeatherMetric; index: number }) => {
  const [progress, setProgress] = useState(0);
  const percentage = Math.min(100, Math.max(0, (metric.value / metric.max) * 100));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 200 + index * 150);
    return () => clearTimeout(timer);
  }, [percentage, index]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card-hover p-5 flex flex-col items-center gap-3"
    >
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
          <circle
            cx="50" cy="50" r={radius}
            stroke={metric.color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 0 6px ${metric.color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">{metric.value}</span>
          <span className="text-xs text-muted-foreground">{metric.unit}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{metric.label}</p>
        <p className="text-xs text-primary" style={{ color: metric.color }}>{metric.status}</p>
      </div>
    </motion.div>
  );
};

const CircleDashboard = ({ weatherData }: { weatherData?: any }) => {
  const metrics = useMemo(() => {
    if (!weatherData) return getMockMetrics();
    
    return [
      { label: 'Temperature', value: weatherData.temp, max: 50, unit: '°C', status: weatherData.status.temp, color: 'hsl(30, 100%, 60%)' },
      { label: 'Humidity', value: weatherData.humidity, max: 100, unit: '%', status: weatherData.status.humidity, color: 'hsl(185, 100%, 50%)' },
      { label: 'AQI', value: weatherData.aqi, max: 500, unit: '', status: weatherData.status.aqi, color: 'hsl(45, 100%, 50%)' },
      { label: 'Wind Speed', value: weatherData.wind, max: 100, unit: 'km/h', status: weatherData.status.wind, color: 'hsl(220, 100%, 60%)' },
      { label: 'Rain Chance', value: weatherData.rainChance, max: 100, unit: '%', status: weatherData.rainChance > 50 ? 'High' : 'Low', color: 'hsl(270, 100%, 65%)' },
      { label: 'UV Index', value: weatherData.uvIndex, max: 11, unit: '', status: weatherData.uvIndex > 5 ? 'High' : 'Moderate', color: 'hsl(0, 100%, 60%)' },
    ];
  }, [weatherData]);

  return (
    <section className="px-4 py-10">
      <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="font-display text-2xl md:text-3xl text-center glow-text mb-8">
        Smart Weather Analytics
      </motion.h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
        {metrics.map((m, i) => <RadialCircle key={m.label} metric={m} index={i} />)}
      </div>
    </section>
  );
};

export default CircleDashboard;

