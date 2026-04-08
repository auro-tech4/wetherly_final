export type WeatherCondition = 'sunny' | 'rain' | 'cloudy' | 'night' | 'thunderstorm';

export interface WeatherMetric {
  label: string;
  value: number;
  max: number;
  unit: string;
  status: string;
  color: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  humidity: number;
  wind: number;
  icon: string;
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  rainChance: number;
  icon: string;
}

export interface CityWeather {
  city: string;
  country: string;
  temp: number;
  humidity: number;
  aqi: number;
  wind: number;
  rainChance: number;
  condition: WeatherCondition;
}

export const getMockMetrics = (): WeatherMetric[] => [
  { label: 'Temperature', value: 28, max: 50, unit: '°C', status: 'Warm', color: 'hsl(30, 100%, 60%)' },
  { label: 'Humidity', value: 65, max: 100, unit: '%', status: 'Good', color: 'hsl(185, 100%, 50%)' },
  { label: 'AQI', value: 82, max: 500, unit: '', status: 'Moderate', color: 'hsl(45, 100%, 50%)' },
  { label: 'Wind Speed', value: 12, max: 100, unit: 'km/h', status: 'Safe', color: 'hsl(220, 100%, 60%)' },
  { label: 'Rain Chance', value: 75, max: 100, unit: '%', status: 'High', color: 'hsl(270, 100%, 65%)' },
  { label: 'UV Index', value: 6, max: 11, unit: '', status: 'High', color: 'hsl(0, 100%, 60%)' },
];

export const getMockHourly = (): HourlyForecast[] => [
  { time: '6 AM', temp: 22, humidity: 70, wind: 8, icon: '🌤' },
  { time: '9 AM', temp: 25, humidity: 65, wind: 10, icon: '☀️' },
  { time: '12 PM', temp: 30, humidity: 55, wind: 14, icon: '☀️' },
  { time: '3 PM', temp: 32, humidity: 50, wind: 16, icon: '⛅' },
  { time: '6 PM', temp: 28, humidity: 60, wind: 12, icon: '🌥' },
  { time: '9 PM', temp: 24, humidity: 72, wind: 8, icon: '🌙' },
  { time: '12 AM', temp: 21, humidity: 78, wind: 6, icon: '🌙' },
  { time: '3 AM', temp: 19, humidity: 82, wind: 5, icon: '🌙' },
];

export const getMockWeekly = (): DailyForecast[] => [
  { day: 'Monday', high: 32, low: 22, rainChance: 20, icon: '☀️' },
  { day: 'Tuesday', high: 30, low: 21, rainChance: 45, icon: '⛅' },
  { day: 'Wednesday', high: 28, low: 20, rainChance: 75, icon: '🌧' },
  { day: 'Thursday', high: 26, low: 19, rainChance: 90, icon: '⛈' },
  { day: 'Friday', high: 29, low: 21, rainChance: 30, icon: '🌤' },
  { day: 'Saturday', high: 31, low: 22, rainChance: 15, icon: '☀️' },
  { day: 'Sunday', high: 33, low: 23, rainChance: 10, icon: '☀️' },
];

export const getAIInsights = (): string[] => [
  '🌂 Carry an umbrella in the evening — 75% rain chance after 6 PM',
  '🏃 Best time for outdoor activities: 6 PM – 8 PM',
  '💧 High humidity may make it feel hotter than actual temperature',
  '✈️ Good day for travel — clear skies expected until noon',
  '☀️ Avoid afternoon heat between 12 PM – 3 PM',
  '🌿 Air quality is moderate — sensitive groups should limit outdoor time',
];

export const getMockCities = (): CityWeather[] => [
  { city: 'Delhi', country: 'India', temp: 34, humidity: 55, aqi: 156, wind: 14, rainChance: 20, condition: 'sunny' },
  { city: 'Mumbai', country: 'India', temp: 30, humidity: 82, aqi: 98, wind: 18, rainChance: 65, condition: 'cloudy' },
  { city: 'Bhubaneswar', country: 'India', temp: 32, humidity: 70, aqi: 72, wind: 12, rainChance: 45, condition: 'cloudy' },
];

export const citySuggestions = [
  'New Delhi, India', 'Mumbai, India', 'Bhubaneswar, India', 'Kolkata, India',
  'Chennai, India', 'Bengaluru, India', 'Hyderabad, India', 'Jaipur, India',
  'Goa, India', 'Pune, India', 'London, UK', 'New York, USA',
  'Tokyo, Japan', 'Paris, France', 'Dubai, UAE', 'Singapore',
];

export const outfitSuggestions = [
  { temp: '18°C', suggestion: 'Light jacket + jeans', icon: '🧥' },
  { temp: '35°C', suggestion: 'Cotton clothes + hat', icon: '👕' },
  { temp: 'Rain', suggestion: 'Umbrella + waterproof shoes', icon: '☔' },
  { temp: '10°C', suggestion: 'Hoodie / sweater + boots', icon: '🧣' },
];

export const graphData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  temperature: 20 + Math.sin(i / 3) * 8 + Math.random() * 2,
  humidity: 50 + Math.cos(i / 4) * 25 + Math.random() * 5,
  wind: 5 + Math.sin(i / 5) * 10 + Math.random() * 3,
  rainfall: Math.max(0, Math.sin((i - 12) / 3) * 15 + Math.random() * 5),
}));
