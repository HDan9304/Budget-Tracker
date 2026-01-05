import { GoogleGenAI } from "@google/genai";
import { Expense } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getWeddingAdvice = async (
  query: string,
  expenses: Expense[],
  totalBudget: number
): Promise<string> => {
  if (!apiKey) return "Please configure your API Key to use the AI Advisor.";

  const expenseSummary = expenses.map(e => 
    `- ${e.item} (${e.category}): Est $${e.estimatedCost}, Paid $${e.paid}`
  ).join('\n');

  const systemInstruction = `
    You are a world-class Wedding Planner and Financial Advisor named "Bliss".
    Your tone is elegant, reassuring, and practical.
    
    Current Budget Context:
    - Total Budget: $${totalBudget}
    - Expense List:
    ${expenseSummary}

    Goal: Provide specific, actionable advice based on the user's query and their current budget situation.
    Keep answers concise (under 150 words) unless asked for a detailed breakdown.
    If the user asks about budget allocation, suggest standard percentages (e.g., 40% Venue, 10% Photo).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text || "I couldn't generate advice at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the wedding planning database right now. Please try again.";
  }
};

export const categorizeExpenseItem = async (item: string): Promise<string> => {
    if (!apiKey) return "Miscellaneous";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Categorize the wedding expense item "${item}" into one of these exact categories: 'Venue & Catering', 'Attire & Beauty', 'Flowers & Decor', 'Photography & Video', 'Music & Entertainment', 'Stationery', 'Gifts & Favors', 'Miscellaneous'. Return ONLY the category name string.`,
        });
        return response.text?.trim() || "Miscellaneous";
    } catch (e) {
        return "Miscellaneous";
    }
}