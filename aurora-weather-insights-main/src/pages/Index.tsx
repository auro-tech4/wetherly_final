import { useState, useEffect } from 'react';
import { WeatherCondition } from '@/data/mockWeather';
import WeatherBackground from '@/components/weather/WeatherBackground';
import HeroSection from '@/components/weather/HeroSection';
import CircleDashboard from '@/components/weather/CircleDashboard';
import LiveLocation from '@/components/weather/LiveLocation';
import ForecastSection from '@/components/weather/ForecastSection';
import AIInsights from '@/components/weather/AIInsights';
import WeatherGraphs from '@/components/weather/WeatherGraphs';
import TravelPlanner from '@/components/weather/TravelPlanner';
import OutfitSuggestion from '@/components/weather/OutfitSuggestion';
import CityComparison from '@/components/weather/CityComparison';
import FarmerDashboard from '@/components/weather/FarmerDashboard';

import { fetchRealWeather, fetchForecast, fetchByCoords } from '@/lib/weather';
import { toast } from 'sonner';

const Index = () => {
  const [city, setCity] = useState('New Delhi');
  const [condition, setCondition] = useState<WeatherCondition>('sunny');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      const data = await fetchRealWeather(cityName);
      if (data) {
        setWeatherData(data);
        setCondition(data.condition);
        setCity(data.city);

        if (data.coord) {
          const forecast = await fetchForecast(data.coord.lat, data.coord.lon);
          setForecastData(forecast);
        }
      } else {
        toast.error(`Could not fetch data for ${cityName}`);
      }
    } catch (error) {
      toast.error("An error occurred while fetching weather.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const data = await fetchByCoords(latitude, longitude);
        if (data) {
          setWeatherData(data);
          setCondition(data.condition);
          setCity(data.city);
          const forecast = await fetchForecast(latitude, longitude);
          setForecastData(forecast);
        }
      } catch (error) {
        toast.error("Failed to fetch weather for your location");
      } finally {
        setLoading(false);
      }
    }, () => {
      setLoading(false);
      toast.error("Location access denied or unavailable");
    });
  };


  const handleSearch = (cityName: string) => {
    fetchWeather(cityName);
  };

  // Initial fetch
  useEffect(() => {
    fetchWeather('New Delhi');
  }, []);

  return (
    <div className="min-h-screen relative">
      <WeatherBackground condition={condition} />
      <div className="relative z-10">
        <HeroSection onSearch={handleSearch} loading={loading} />
        
        {/* Pass weatherData down to components */}
        <CircleDashboard weatherData={weatherData} />
        
        <LiveLocation city={city} weatherData={weatherData} onUseLocation={handleUseLocation} />
        
        <ForecastSection city={city} />
        
        <AIInsights weatherData={weatherData} city={city} />
        
        <WeatherGraphs city={city} forecastData={forecastData} />
        
        <FarmerDashboard city={city} weatherData={weatherData} />
      </div>


    </div>
  );
};




export default Index;

