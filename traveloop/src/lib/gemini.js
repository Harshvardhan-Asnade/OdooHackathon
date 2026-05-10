import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
// Note: You will need to add VITE_GEMINI_API_KEY to your .env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

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
