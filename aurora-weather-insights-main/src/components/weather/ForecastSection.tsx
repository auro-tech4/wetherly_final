import { motion } from 'framer-motion';
import { getMockHourly, getMockWeekly } from '@/data/mockWeather';

interface Props {
  city?: string;
}

const ForecastSection = ({ city = 'New Delhi' }: Props) => {
  const hourly = getMockHourly();
  const weekly = getMockWeekly();

  return (
    <section className="px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
           <h2 className="font-display text-2xl md:text-3xl text-center glow-text mb-2">
             Forecast for {city}
           </h2>
        </motion.div>

        {/* Hourly */}
        <div>
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display text-xl md:text-2xl glow-text mb-6">
            Hourly Forecast
          </motion.h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {hourly.map((h, i) => (
              <motion.div
                key={h.time}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-hover p-4 min-w-[130px] text-center shrink-0"
              >
                <p className="text-muted-foreground text-sm">{h.time}</p>
                <p className="text-3xl my-2">{h.icon}</p>
                <p className="text-foreground font-bold text-lg">{h.temp}°C</p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>💧 {h.humidity}%</p>
                  <p>💨 {h.wind} km/h</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly */}
        <div>
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display text-xl md:text-2xl glow-text mb-6">
            7-Day Forecast
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {weekly.map((d, i) => (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-hover p-4 text-center"
              >
                <p className="text-primary font-semibold text-sm">{d.day}</p>
                <p className="text-3xl my-3">{d.icon}</p>
                <p className="text-foreground font-bold">{d.high}° / <span className="text-muted-foreground font-normal">{d.low}°</span></p>
                <p className="text-xs text-muted-foreground mt-2">🌧 {d.rainChance}%</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForecastSection;

