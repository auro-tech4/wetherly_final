import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, Loader2, Sparkles } from 'lucide-react';
import { getAIResponse } from '@/lib/gemini';

interface Props {
  city?: string;
}

const TravelPlanner = ({ city }: Props) => {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);

  useEffect(() => {
    if (city && !destination) {
      setDestination(city);
    }
  }, [city]);

  const handlePlan = async () => {
    if (!destination || !date) return;
    
    setLoading(true);
    const prompt = `Provide a detailed travel weather forecast and advice for ${destination} on ${date}. 
    Format the response as a JSON array of 6 objects, each with 'icon' (emoji), 'label', and 'value'. 
    Example format: [{"icon": "🌤️", "label": "Expected Weather", "value": "Sunny, 28°C"}]
    Include: Expected Weather, Rain Chance, Best Clothes, Travel Safety, Best Hours to Visit, and Local Tip.
    Return ONLY the JSON array.`;

    try {
      const response = await getAIResponse(prompt);
      const jsonStart = response.indexOf('[');
      const jsonEnd = response.lastIndexOf(']') + 1;
      const jsonStr = response.substring(jsonStart, jsonEnd);
      const data = JSON.parse(jsonStr);
      setResult(data);
    } catch (error) {
      console.error("Failed to parse AI response", error);
      setResult([
        { icon: '🌤️', label: 'Expected Weather', value: 'Data unavailable' },
        { icon: '🌧️', label: 'Rain Chance', value: 'Unknown' },
        { icon: '👕', label: 'Best Clothes', value: 'Universal casual' },
        { icon: '✅', label: 'Travel Safety', value: 'Check local news' },
        { icon: '🕐', label: 'Best Hours', value: 'Standard hours' },
        { icon: '📍', label: 'Destination', value: destination },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl glow-text mb-8 text-center flex items-center gap-3 justify-center">
          <Plane className="w-6 h-6 text-primary" />
          Travel Weather Planner
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">Destination</label>
              <input value={destination} onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Goa, India"
                className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground border border-border focus:border-primary transition-colors" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">Travel Date</label>
              <div className="relative">
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none border border-border focus:border-primary transition-colors [color-scheme:dark]" />
              </div>
            </div>
            <button 
              onClick={handlePlan} 
              disabled={loading || !destination || !date}
              className="neon-button self-end flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Plan Trip"}
            </button>
          </div>

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {result.map((item, i) => (
                <motion.div 
                  key={item.label} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-secondary/30 text-center border border-white/5 hover:border-primary/20 transition-all"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-foreground font-semibold mt-2">{item.value}</p>
                  <p className="text-muted-foreground text-xs mt-1 uppercase tracking-widest">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TravelPlanner;


