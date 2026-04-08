import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { graphData } from '@/data/mockWeather';

const charts = [
  { key: 'temperature', label: 'Temperature (°C)', color: 'hsl(30, 100%, 60%)' },
  { key: 'humidity', label: 'Humidity (%)', color: 'hsl(185, 100%, 50%)' },
  { key: 'wind', label: 'Wind Speed (km/h)', color: 'hsl(220, 100%, 60%)' },
  { key: 'rainfall', label: 'Rainfall (mm)', color: 'hsl(270, 100%, 65%)' },
] as const;

interface Props {
  city?: string;
  forecastData?: any[];
}

const WeatherGraphs = ({ city, forecastData }: Props) => {
  const data = forecastData && forecastData.length > 0 ? forecastData : graphData;

  return (
    <section className="px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl glow-text mb-8 text-center uppercase tracking-widest">
          Weather Graph Analysis for {city || 'Current Location'}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charts.map((chart, i) => (
            <motion.div key={chart.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <h3 className="text-foreground font-semibold mb-4">{chart.label}</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'hsl(215 15% 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220 20% 8%)', border: '1px solid hsl(220 30% 22%)', borderRadius: '12px' }}
                    labelStyle={{ color: 'hsl(215 15% 55%)', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey={chart.key === 'temperature' ? 'temperature' : chart.key} stroke={chart.color} strokeWidth={3} dot={{ r: 4, fill: chart.color }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    style={{ filter: `drop-shadow(0 0 6px ${chart.color})` }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default WeatherGraphs;

