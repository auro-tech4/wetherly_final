const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export interface RealWeatherData {
  city: string;
  temp: number;
  humidity: number;
  wind: number;
  condition: "sunny" | "rain" | "cloudy" | "night" | "thunderstorm";
  rainChance: number;
  aqi: number;
  uvIndex: number;
  coord?: { lat: number; lon: number };
  status: {
    temp: string;
    humidity: string;
    aqi: string;
    wind: string;
  };
}

export const fetchRealWeather = async (city: string): Promise<RealWeatherData | null> => {
  if (!API_KEY) {
    console.error("OpenWeather API Key missing");
    return null;
  }

  try {
    // 1. Resolve Location using Geocoding API (More robust than direct search)
    const geoQuery = encodeURIComponent(city.trim());
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${geoQuery}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();

    let lat, lon, resolvedName;

    if (geoData && geoData.length > 0) {
      lat = geoData[0].lat;
      lon = geoData[0].lon;
      resolvedName = geoData[0].name;
    } else {
      // Fallback: Try with just the city name if full string fails
      const cityNameOnly = city.split(',')[0].trim();
      const geoRes2 = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityNameOnly)}&limit=1&appid=${API_KEY}`
      );
      const geoData2 = await geoRes2.json();
      if (geoData2 && geoData2.length > 0) {
        lat = geoData2[0].lat;
        lon = geoData2[0].lon;
        resolvedName = geoData2[0].name;
      } else {
        return null; // Truly not found
      }
    }

    // 2. Fetch Current Weather using Lat/Lon
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) return null;

    // 3. Fetch Air Pollution
    let mappedAqi = 50;
    try {
      const pollutionRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const pollutionData = await pollutionRes.json();
      const rawAqi = pollutionData.list?.[0]?.main?.aqi || 1; 
      const aqiRange = [0, 50, 100, 150, 200, 300, 500];
      mappedAqi = aqiRange[rawAqi] || 50;
    } catch (e) {}

    // 4. Build Response with real data
    const main = weatherData.weather[0].main.toLowerCase();
    let condition: RealWeatherData["condition"] = "sunny";
    if (main.includes("rain") || main.includes("drizzle")) condition = "rain";
    else if (main.includes("cloud")) condition = "cloudy";
    else if (main.includes("clear")) condition = "sunny";
    else if (main.includes("thunderstorm")) condition = "thunderstorm";
    else if (main.includes("mist") || main.includes("snow") || main.includes("haze")) condition = "cloudy";

    const temp = Math.round(weatherData.main.temp);
    const humidity = weatherData.main.humidity;
    const wind = Math.round(weatherData.wind.speed * 3.6); 

    return {
      city: resolvedName || weatherData.name,
      temp,
      humidity,
      wind,
      aqi: mappedAqi,
      rainChance: (weatherData.clouds?.all > 40) ? (main.includes("rain") ? 90 : 55) : (weatherData.clouds?.all || 12),
      uvIndex: temp > 28 ? (temp > 35 ? 9 : 7) : 4,
      coord: { lat, lon },
      condition,
      status: {
        temp: temp > 30 ? "Hot" : temp > 20 ? "Warm" : "Cold",
        humidity: humidity > 70 ? "High" : humidity > 30 ? "Good" : "Low",
        aqi: mappedAqi < 50 ? "Good" : mappedAqi < 150 ? "Moderate" : "Poor",
        wind: wind < 20 ? "Safe" : "Breezy",
      },
    };
  } catch (error) {
    console.error("OpenWeather Fetch failed", error);
    return null;
  }
};

export const fetchForecast = async (lat: number, lon: number): Promise<any[]> => {
  if (!API_KEY) return [];
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    if (!data || data.cod !== "200") return [];

    return data.list.slice(0, 8).map((item: any) => ({
      hour: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
      wind: Math.round(item.wind.speed * 3.6),
      rainfall: item.rain?.['3h'] || 0
    }));
  } catch (e) {
    return [];
  }
};
export const fetchByCoords = async (lat: number, lon: number): Promise<RealWeatherData | null> => {
  if (!API_KEY) return null;
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();
    if (weatherData.cod !== 200) return null;

    let mappedAqi = 50;
    try {
      const pollutionRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const pollutionData = await pollutionRes.json();
      const rawAqi = pollutionData.list?.[0]?.main?.aqi || 1; 
      const aqiRange = [0, 50, 100, 150, 200, 300, 500];
      mappedAqi = aqiRange[rawAqi] || 50;
    } catch (e) {}

    const main = weatherData.weather[0].main.toLowerCase();
    let condition: RealWeatherData["condition"] = "sunny";
    if (main.includes("rain") || main.includes("drizzle")) condition = "rain";
    else if (main.includes("cloud")) condition = "cloudy";
    else if (main.includes("clear")) condition = "sunny";
    else if (main.includes("thunderstorm")) condition = "thunderstorm";
    else if (main.includes("mist") || main.includes("snow") || main.includes("haze")) condition = "cloudy";

    const temp = Math.round(weatherData.main.temp);
    const humidity = weatherData.main.humidity;
    const wind = Math.round(weatherData.wind.speed * 3.6); 

    return {
      city: weatherData.name,
      temp,
      humidity,
      wind,
      aqi: mappedAqi,
      rainChance: (weatherData.clouds?.all > 40) ? 80 : (weatherData.clouds?.all || 12),
      uvIndex: temp > 28 ? 8 : 4,
      coord: { lat, lon },
      condition,
      status: {
        temp: temp > 30 ? "Hot" : "Warm",
        humidity: humidity > 70 ? "High" : "Good",
        aqi: mappedAqi < 50 ? "Good" : "Moderate",
        wind: wind < 20 ? "Safe" : "Breezy",
      },
    };
  } catch (error) {
    return null;
  }
};


