import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  weatherData?: any;
  city?: string;
}

const AIInsights = ({ weatherData, city }: Props) => {
  const insights = useMemo(() => {
    if (!weatherData) return [];
    
    const temp = weatherData.temp;
    const humidity = weatherData.humidity;
    const condition = weatherData.condition;
    const uvIndex = weatherData.uvIndex || 5;

    const list = [];

    if (temp > 32) list.push('🌡️ High heat detected. Avoid direct sunlight and stay hydrated.');
    else if (temp < 15) list.push('❄️ Refreshing chill! Heavy layering recommended for comfort.');
    else list.push('🌤️ Optimal temperature for outdoor activities.');

    if (uvIndex > 6) list.push('🧴 Very high UV! SPF 50+ and sunglasses are essential today.');
    
    if (condition === 'rain' || condition === 'thunderstorm') {
      list.push('🌂 Continuous rainfall likely. Keep an umbrella and rain gear handy.');
    } else if (condition === 'cloudy') {
      list.push('☁️ Overcast skies may affect visibility. Great for soft-light photography.');
    }

    if (humidity > 75) list.push('💧 High humidity may make it feel warmer than it is.');
    
    list.push('🚗 Travel conditions are favorable for all major routes.');
    list.push('🌿 Excellent time for garden maintenance or park visits.');

    return list;
  }, [weatherData]);

  return (
    <section className="px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl glow-text mb-6 flex items-center gap-3 justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
          Live Weather Intelligence for {city || 'Your Location'}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 glow-border min-h-[200px] flex flex-col justify-center"
        >
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <p className="text-foreground/90 leading-relaxed font-medium">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIInsights;



