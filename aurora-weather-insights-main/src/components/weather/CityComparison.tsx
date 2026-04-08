import { motion } from 'framer-motion';
import { getMockCities } from '@/data/mockWeather';
import { ArrowLeftRight } from 'lucide-react';

interface Props {
  currentCity?: string;
}

const CityComparison = ({ currentCity }: Props) => {
  const cities = getMockCities();

  return (
    <section className="px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl glow-text mb-8 text-center flex items-center gap-3 justify-center">
          <ArrowLeftRight className="w-6 h-6 text-primary" />
          Comparison: {currentCity || 'Current Location'} vs Others
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <motion.div key={city.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card-hover p-6"
            >
              <h3 className="font-display text-xl glow-text mb-1">{city.city}</h3>
              <p className="text-muted-foreground text-sm mb-4">{city.country}</p>
              <div className="space-y-3">
                {[
                  { label: 'Temperature', value: `${city.temp}°C`, bar: city.temp / 50 * 100, color: 'hsl(30,100%,60%)' },
                  { label: 'Humidity', value: `${city.humidity}%`, bar: city.humidity, color: 'hsl(185,100%,50%)' },
                  { label: 'AQI', value: city.aqi.toString(), bar: city.aqi / 500 * 100, color: city.aqi > 100 ? 'hsl(0,100%,60%)' : 'hsl(120,60%,50%)' },
                  { label: 'Wind', value: `${city.wind} km/h`, bar: city.wind / 100 * 100, color: 'hsl(220,100%,60%)' },
                  { label: 'Rain', value: `${city.rainChance}%`, bar: city.rainChance, color: 'hsl(270,100%,65%)' },
                ].map(metric => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="text-foreground font-medium">{metric.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(metric.bar, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: metric.color, boxShadow: `0 0 8px ${metric.color}` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityComparison;

