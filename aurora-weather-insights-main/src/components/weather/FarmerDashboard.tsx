import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Droplets, AlertTriangle, Bug, ThermometerSun, Sparkles, Loader2 } from 'lucide-react';
import { getAIResponse } from '@/lib/gemini';

const crops = ['Rice', 'Wheat', 'Maize', 'Vegetables'];
const soils = ['Sandy', 'Clay', 'Loamy'];

interface Props {
  weatherData?: any;
  city?: string;
}

const FarmerDashboard = ({ weatherData, city }: Props) => {
  const [localCity, setLocalCity] = useState('');
  const [crop, setCrop] = useState('Rice');
  const [soil, setSoil] = useState('Loamy');
  const [moisture, setMoisture] = useState(55);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    if (city) setLocalCity(city);
  }, [city]);

  const decisions = useMemo(() => {
    if (!weatherData) return null;

    const rainChance = weatherData.rainChance || 0;
    const humidity = weatherData.humidity || 0;
    const wind = weatherData.wind || 0;
    const temp = weatherData.temp || 0;

    const irrigation = rainChance > 70
      ? { text: 'No irrigation needed — rain expected', status: 'safe' }
      : moisture < 40
        ? { text: 'Yes, irrigate in the morning', status: 'warning' }
        : { text: 'Soil moisture sufficient', status: 'safe' };

    const rain = {
      chance: rainChance,
      startTime: rainChance > 50 ? 'Incoming' : 'N/A',
      duration: rainChance > 50 ? 'Check local radar' : 'None',
    };

    const spray = wind > 15
      ? { text: 'Postpone — high wind speed', status: 'warning' }
      : rainChance > 60
        ? { text: 'Avoid — rain expected soon', status: 'warning' }
        : { text: 'Best time: 6 AM – 8 AM', status: 'safe' };

    const risks = [];
    if (temp > 35) risks.push({ text: 'Heat stress risk for crops', icon: ThermometerSun });
    if (humidity > 80) risks.push({ text: 'Fungal infection risk — high humidity', icon: Bug });
    if (rainChance > 80) risks.push({ text: 'Waterlogging alert', icon: Droplets });
    if (humidity > 75) risks.push({ text: 'High humidity may affect crop health', icon: AlertTriangle });

    if (risks.length === 0) risks.push({ text: 'Optimal conditions for growth', icon: Sprout });

    return { irrigation, rain, spray, risks };
  }, [weatherData, moisture]);

  useEffect(() => {
    const fetchAdvice = () => {
      if (!weatherData) return;
      
      const { temp, rainChance, humidity } = weatherData;
      let advice = '';

      if (rainChance > 60) {
        advice = `🌧️ Rain is highly likely today (${rainChance}% chance). Irrigation is not needed. Ensure drainage for your ${crop} crops in ${soil} soil.`;
      } else if (temp > 32) {
        advice = `☀️ High heat alert (${temp}°C). Provide extra water to your ${crop} field today, preferably in the evening to retain moisture in ${soil} soil.`;
      } else if (humidity > 80) {
        advice = `💧 High humidity (${humidity}%) may cause pest issues in ${crop}. Monitor closely and avoid heavy nitrogen application.`;
      } else {
        advice = `✅ Conditions are stable for ${crop} growth. Proceed with your standard farming schedule.`;
      }

      setAiAdvice(advice);
    };

    fetchAdvice();
  }, [crop, soil, weatherData]);


  return (
    <section className="px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl glow-text mb-2 text-center flex items-center gap-3 justify-center">
          🌾 Hyperlocal Farmer Decision Engine for {city || 'Your Village'}
        </motion.h2>
        <p className="text-center text-muted-foreground mb-8">Built for Indian farmers to make smarter daily decisions</p>

        {/* Inputs */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Village / Location</label>
              <input value={localCity} onChange={e => setLocalCity(e.target.value)}
                placeholder="Enter village name"
                className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none border border-border focus:border-primary transition-colors placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Crop Type</label>
              <select value={crop} onChange={e => setCrop(e.target.value)}
                className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none border border-border focus:border-primary transition-colors [color-scheme:dark]">
                {crops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Soil Type</label>
              <select value={soil} onChange={e => setSoil(e.target.value)}
                className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none border border-border focus:border-primary transition-colors [color-scheme:dark]">
                {soils.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Soil Moisture: {moisture}%</label>
              <input type="range" min={0} max={100} value={moisture} onChange={e => setMoisture(Number(e.target.value))}
                className="w-full mt-3 accent-primary" />
            </div>
          </div>
        </motion.div>

        {/* AI Insight Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-8 border-primary/20 bg-primary/5 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-20 h-20 text-primary" />
          </div>
          <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> AI AGRI-ADVISOR
          </h3>
          {loadingAdvice ? (
            <div className="flex items-center gap-3 py-4">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm animate-pulse">Analyzing crop patterns and weather trends...</p>
            </div>
          ) : (
            <p className="text-foreground leading-relaxed italic">"{aiAdvice || 'Select a crop and location to get AI advice.'}"</p>
          )}
        </motion.div>

        {/* Outputs */}
        {decisions && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Irrigation */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-card p-6 glow-border">
              <h3 className="font-display text-lg text-primary mb-3 flex items-center gap-2">
                <Droplets className="w-5 h-5" /> Irrigation Decision
              </h3>
              <p className="text-foreground text-lg font-medium">"Should I irrigate today?"</p>
              <p className={`mt-2 text-sm ${decisions.irrigation.status === 'safe' ? 'text-green-400' : 'text-yellow-400'}`}>
                → {decisions.irrigation.text}
              </p>
            </motion.div>

            {/* Rain Prediction */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 glow-border">
              <h3 className="font-display text-lg text-primary mb-3">🌧️ Rain Prediction</h3>
              <p className="text-foreground">"Will it rain in next 6 hours?"</p>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>Rain chance: <span className="text-foreground font-medium">{decisions.rain.chance}%</span></p>
                <p>Status: <span className="text-foreground font-medium">{decisions.rain.startTime}</span></p>
                <p>Expected Duration: <span className="text-foreground font-medium">{decisions.rain.duration}</span></p>
              </div>
            </motion.div>

            {/* Fertilizer Spray */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 glow-border">
              <h3 className="font-display text-lg text-primary mb-3">🧪 Fertilizer Spray Planner</h3>
              <p className="text-foreground">"Best time to spray fertilizer?"</p>
              <p className={`mt-2 text-sm ${decisions.spray.status === 'safe' ? 'text-green-400' : 'text-yellow-400'}`}>
                → {decisions.spray.text}
              </p>
            </motion.div>

            {/* Crop Risks */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 glow-border">
              <h3 className="font-display text-lg text-primary mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Crop Risk Alerts
              </h3>
              <div className="space-y-2">
                {decisions.risks.map((risk, i) => (
                  <div key={i} className="flex items-center gap-2 text-yellow-400 text-sm">
                    <risk.icon className="w-4 h-4 shrink-0" />
                    <span>{risk.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FarmerDashboard;


