
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeMenuImage = async (base64Image: string): Promise<AnalysisResponse> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analyze this image which is either a menu or a dish. If it's a menu, extract the main menu items. If it's a dish, identify it. For each item, provide: name, a brief description (briefing), a list of ingredients, a list of seasonings, and extra information (allergies, origin, or interesting facts). Respond in Korean.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the dish" },
                description: { type: Type.STRING, description: "Detailed explanation of the dish" },
                ingredients: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of main ingredients" 
                },
                seasonings: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of seasonings/spices" 
                },
                extraInfo: { type: Type.STRING, description: "Additional data, tips or allergy warnings" },
              },
              required: ["name", "description", "ingredients", "seasonings", "extraInfo"],
            },
          },
        },
        required: ["items"],
      },
    },
  });

  const response = await model;
  const jsonStr = response.text || "{\"items\": []}";
  return JSON.parse(jsonStr) as AnalysisResponse;
};
