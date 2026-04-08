import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Using direct REST API call to 'v1' stable endpoint for maximum reliability and to fix 404 SDK errors
export const getAIResponse = async (prompt: string) => {
  if (!apiKey) return "API Key missing. Please check your .env file.";
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
       console.warn("V1 Flash failed, trying V1 Pro fallback...", data.error);
       // Fallback to gemini-pro if flash fails
       const fallbackRes = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      const fallbackData = await fallbackRes.json();
      if (fallbackData.error) throw new Error(fallbackData.error.message);
      return fallbackData.candidates[0].content.parts[0].text;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error("Gemini REST API Error:", error);
    return `Weatherly AI Error: ${error?.message || "Internal network failure. Please verify your API key."}`;
  }
};

export async function getWeatherResponse(userInput: string, weather: any) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
  You are Weatherly AI, a smart weather assistant with UI control capability.
  
  Your personality: 
  - Warm, helpful, and conversational (never robotic)
  - Add emojis naturally 🌤️✨

  Current Weather Data:
  - Temperature: ${weather.temp}°C
  - Condition: ${weather.description || weather.condition || 'Unknown'}
  - Humidity: ${weather.humidity}%
  - Wind: ${weather.wind} m/s
  - AQI: ${weather.aqi || 'N/A'}
  - Rain Chance: ${weather.rainChance || '0'}%

  User Query: "${userInput}"

  Tasks:
  1. Respond like a friendly human (not robotic).
  2. Explain the weather simply.
  3. Suggest outfit and give helpful advice.
  4. Decide a UI theme color based on weather condition.

  Theme Rules:
  - Clear/Sunny → linear-gradient(to right, #fceabb, #f8b500)
  - Cloudy → linear-gradient(to right, #757f9a, #d7dde8)
  - Rain → linear-gradient(to right, #000046, #1cb5e0)
  - Thunderstorm → linear-gradient(to bottom, #0f2027, #203a43, #2c5364)
  - Snow → linear-gradient(to right, #e6dada, #274046)
  - Mist/Fog → linear-gradient(to right, #606c88, #3f4c6b)

  Return response in this JSON format:
  {
    "message": "your response",
    "theme": "CSS gradient"
  }

  Do NOT return anything outside JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  return response;
}



export const getCityWeather = async (city: string) => {
  if (!apiKey) {
    console.error("Gemini API Key missing");
    return null;
  }

  const prompt = `Generate a realistic (but simulated) CURRENT weather data for the city "${city}" in JSON format. 
  The response must be a single JSON object with these EXACT keys:
  {
    "city": "${city}",
    "temp": number (in celsius),
    "humidity": number (0-100),
    "wind": number (km/h),
    "aqi": number (0-500),
    "rainChance": number (0-100),
    "uvIndex": number (0-11),
    "condition": "sunny" | "rain" | "cloudy" | "night" | "thunderstorm",
    "status": {
        "temp": "Warm" | "Cold" | "Hot" | "Mild",
        "humidity": "Good" | "High" | "Low",
        "aqi": "Good" | "Moderate" | "Poor",
        "wind": "Safe" | "Breezy" | "Strong"
    },
    "coord": { "lat": number, "lon": number }
  }
  Respond ONLY with the JSON object.`;

  try {
    const responseText = await getAIResponse(prompt);
    
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) return null;

    const jsonStr = responseText.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse city weather JSON", error);
    return null;
  }
};



