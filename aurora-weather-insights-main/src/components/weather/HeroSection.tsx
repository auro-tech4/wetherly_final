import { useState, useRef, useEffect } from 'react';
import { Search, Mic, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { citySuggestions } from '@/data/mockWeather';

interface Props {
  onSearch: (city: string) => void;
  loading?: boolean;
}

const HeroSection = ({ onSearch, loading }: Props) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = citySuggestions.filter(c => c.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (city: string) => {
    setQuery(city);
    setShowSuggestions(false);
    onSearch(city);
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSelect(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);


  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 pt-20 pb-10">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-5xl md:text-7xl font-black glow-text tracking-wider">
          WEATHERLY
        </h1>
        <p className="text-muted-foreground mt-3 text-lg md:text-xl max-w-lg mx-auto">
          Your premium AI-powered weather intelligence platform
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative w-full max-w-2xl"
      >
        <div className={`glass-card glow-border flex items-center px-5 py-4 gap-3 transition-all duration-300 ${isListening || loading ? 'animate-pulse-glow' : ''}`}>
          {loading ? (
             <Loader2 className="w-5 h-5 text-primary shrink-0 animate-spin" />
          ) : (
             <Search className="w-5 h-5 text-primary shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={e => e.key === 'Enter' && handleSelect(query)}
            placeholder="Search city, destination, village, or ask weather..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            disabled={loading}
          />
          <button onClick={toggleListening} className="relative shrink-0" disabled={loading}>
            <Mic className={`w-5 h-5 transition-colors ${isListening ? 'text-destructive' : 'text-primary'}`} />
            {isListening && (
              <span className="absolute -inset-2 rounded-full border-2 border-destructive/50 animate-ping" />
            )}
          </button>
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && query.length > 0 && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full glass-card p-2 z-50 max-h-60 overflow-y-auto"
            >
              {filtered.map((city, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-foreground hover:bg-primary/10 transition-colors"
                >
                  {city}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default HeroSection;

