import { GoogleGenAI, Type } from "@google/genai";
import { Room } from '../types';

const apiKey = process.env.API_KEY || ''; 
// Note: In a real app, handle missing key gracefully. 
// For this demo, we assume the environment is set up correctly as per instructions.

const ai = new GoogleGenAI({ apiKey });

export const getRoomRecommendation = async (query: string, availableRooms: Room[]): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot generate recommendation.";

  try {
    const roomsContext = JSON.stringify(availableRooms.map(r => ({
      id: r.id,
      name: r.name,
      capacity: r.capacity,
      facilities: r.facilities,
      type: r.type
    })));

    const prompt = `
      You are a university room booking assistant.
      User Query: "${query}"
      Available Rooms: ${roomsContext}

      Analyze the user's need (capacity, equipment, type) and the available rooms.
      Recommend the best fitting room(s).
      Explain WHY you chose it briefly.
      If no room fits perfectly, suggest the closest match.
      Keep the response friendly and concise (max 3 sentences).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sorry, I couldn't generate a recommendation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to the AI assistant.";
  }
};