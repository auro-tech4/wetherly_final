import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, Send, Loader2, Sparkles } from 'lucide-react';
import { getAIResponse, getWeatherResponse } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  city?: string;
  weatherData?: any;
}

const WeatherChatbot = ({ city = 'your location', weatherData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hey! I'm Weatherly AI, your friendly guide to the Weatherly platform. 🌤️ I can help you with local weather, outfit tips, or even explain how to use our Farmer's Dashboard and Analytics! How can I help you today?` },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<string>('rgba(var(--primary), 0.1)');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (city && messages.length === 1) {
      setMessages([{ role: 'assistant', content: `Hey! I'm Weatherly AI, your friendly guide to the Weatherly platform. 🌤️ I can help you with local weather, outfit tips, or even explain how to use our Farmer's Dashboard and Analytics! How can I help you today?` }]);
    }
  }, [city]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getWeatherResponse(userMsg, weatherData || {
        temp: 20,
        condition: 'mild',
        humidity: 50,
        wind: 5,
        description: 'mild conditions'
      });

      try {
        const data = JSON.parse(response);
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        if (data.theme) setHeaderTheme(data.theme);
      } catch (e) {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. 🌦️" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full neon-button flex items-center justify-center ${isOpen ? 'hidden' : ''}`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] glass-card glow-border flex flex-col overflow-hidden shadow-2xl"
          >
            <div 
              className="p-4 border-b border-white/10 flex items-center justify-between transition-all duration-500"
              style={{ background: headerTheme }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm glow-text font-bold">WEATHERLY AI</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Assistant • {city}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none shadow-lg'
                      : 'bg-white/5 backdrop-blur-md border border-white/10 text-foreground rounded-bl-none'
                  }`}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/60"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex gap-2 bg-white/5 rounded-2xl border border-white/10 p-1 focus-within:border-primary/50 transition-all">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about weather..."
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  disabled={isTyping}
                />
                <button 
                  onClick={sendMessage} 
                  disabled={isTyping || !input.trim()}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WeatherChatbot;
