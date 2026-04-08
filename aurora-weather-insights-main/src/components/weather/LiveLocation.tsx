import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  city?: string;
  weatherData?: any;
  onUseLocation?: () => void;
}

const LiveLocation = ({ city = 'Live Location', weatherData, onUseLocation }: Props) => {
  const lat = weatherData?.coord?.lat?.toFixed(1) || '20.2';
  const lon = weatherData?.coord?.lon?.toFixed(1) || '85.8';

  return (
    <section className="px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <MapPin className="w-8 h-8 text-primary" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div>
                <h3 className="font-display text-xl text-foreground">{city}</h3>
                <p className="text-muted-foreground text-sm">Coordinates: {lat}° N, {lon}° E</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[
                { label: 'Temp', value: `${weatherData?.temp || 28}°C`, icon: '🌡️' },
                { label: 'Feels', value: `${(weatherData?.temp || 28) + 2}°C`, icon: '🥵' },
                { label: 'Wind', value: `${weatherData?.wind || 12} km/h`, icon: '💨' },
                { label: 'Rain', value: `${weatherData?.rainChance || 75}%`, icon: '🌧️' },
              ].map(item => (
                <div key={item.label} className="text-center p-3 rounded-xl bg-secondary/30">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-foreground font-semibold mt-1">{item.value}</p>
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={onUseLocation}
              className="neon-button flex items-center gap-2 shrink-0 active:scale-95 transition-transform"
            >
              <Navigation className="w-4 h-4" />
              Use My Location
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default LiveLocation;

