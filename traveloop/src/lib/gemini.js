import { GoogleGenerativeAI } from '@google/generative-ai';
import { createDayWiseItinerary, estimateTripBudget, getPersonalizedRecommendations } from './plannerEngine';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const geminiModel = genAI
  ? genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  : null;

export const isGeminiConfigured = Boolean(apiKey);

// Helper function for quick text generation
export async function generateAIResponse(prompt) {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Returning fallback response.");
    return "AI Features are currently disabled due to missing API configuration.";
  }
  
  try {
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
}

function stripJsonFence(text) {
  return String(text || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

export async function generateJSONResponse(prompt, fallback) {
  if (!isGeminiConfigured) return fallback;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = stripJsonFence(result.response.text());
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating JSON AI response:', error);
    return fallback;
  }
}

export async function generateItineraryPlan({ trip, profile, constraints }) {
  const fallback = {
    summary: 'Generated with the local Traveloop planner because Gemini is unavailable.',
    days: createDayWiseItinerary(trip, profile),
    budget: estimateTripBudget(trip),
    recommendations: getPersonalizedRecommendations(profile, trip).slice(0, 6),
  };

  const prompt = `
You are Traveloop's senior travel planning engine. Return strict JSON only. No markdown.

Trip:
${JSON.stringify(trip, null, 2)}

Traveler profile:
${JSON.stringify(profile, null, 2)}

Constraints:
${JSON.stringify(constraints || {}, null, 2)}

Create a practical itinerary with:
- summary: one sentence
- days: array of day objects { day, date, city, focus, budget, activities: [{ time, name, expense, notes }] }
- optimizationNotes: array of short strings covering distance, budget, weather, and travel time
- recommendations: array of { type, city, name, reason, price }
Budget values must be numbers in USD.
`;

  return generateJSONResponse(prompt, fallback);
}
