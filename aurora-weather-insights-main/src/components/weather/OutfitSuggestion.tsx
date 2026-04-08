import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';

interface Props {
  weatherData?: any;
}

const OutfitSuggestion = ({ weatherData }: Props) => {
  const temp = weatherData?.temp || 28;
  const condition = weatherData?.condition || 'sunny';

  const getSuggestions = () => {
    if (temp > 30) return [
      { icon: '👕', label: 'T-Shirt', desc: 'Light cotton fabric' },
      { icon: '🕶️', label: 'Sunglasses', desc: 'Protect your eyes' },
      { icon: '🧢', label: 'Cap', desc: 'Avoid direct heat' },
      { icon: '🧴', label: 'Sunscreen', desc: 'UV protection' },
    ];
    if (condition === 'rain' || condition === 'thunderstorm') return [
      { icon: '🧥', label: 'Raincoat', desc: 'Waterproof outer layer' },
      { icon: '🌂', label: 'Umbrella', desc: 'Windproof is better' },
      { icon: '🥾', label: 'Boots', desc: 'Keep feet dry' },
      { icon: '👜', label: 'Waterproof bag', desc: 'Protect electronics' },
    ];
    return [
      { icon: '👕', label: 'Casual Shirt', desc: 'Breathable material' },
      { icon: '👖', label: 'Light Pants', desc: 'Comfortable fit' },
      { icon: '👟', label: 'Sneakers', desc: 'Good for walking' },
      { icon: '⌚', label: 'Smart Watch', desc: 'Track your activity' },
    ];
  };

  const suggestions = getSuggestions();

  return (
    <section className="px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl glow-text mb-8 text-center flex items-center gap-3 justify-center">
          <Shirt className="w-6 h-6 text-primary" />
          Smart Outfit Suggestion
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestions.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-5 text-center flex flex-col items-center"
            >
              <span className="text-4xl">{item.icon}</span>
              <p className="text-primary font-bold mt-3 uppercase text-xs tracking-tighter">{item.label}</p>
              <p className="text-foreground/80 text-sm mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutfitSuggestion;

