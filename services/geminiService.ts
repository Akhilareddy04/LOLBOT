
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Emotion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Generates an empathetic response in the specified language.
 */
export async function generateChatResponse(
  message: string, 
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  language: string = 'English'
) {
  // Inject language requirement into instruction
  const languagePrompt = `\n\nIMPORTANT: You MUST respond strictly in ${language}. Do not use any other language.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history,
      { role: "user", parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + languagePrompt,
      temperature: 0.9,
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: { type: Type.STRING, description: "Your empathetic response text" },
          detectedEmotion: { 
            type: Type.STRING, 
            description: "The primary emotion detected in user message",
            enum: Object.values(Emotion)
          }
        },
        required: ["reply", "detectedEmotion"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (e) {
    return {
      reply: response.text || "I'm here for you.",
      detectedEmotion: Emotion.NEUTRAL
    };
  }
}

/**
 * AI-powered check for "Neck-up" image constraint.
 */
export async function validateAvatarImage(base64Image: string): Promise<{ valid: boolean; reason?: string }> {
  // Extract base64 data correctly (remove prefix if present)
  const data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: data,
          },
        },
        {
          text: "Analyze this portrait. Is it ONLY a close-up of a human head and neck? If the image shows shoulders, chest, torso, or any body part below the neck, or if it is a celebrity or full body shot, respond with 'REJECT'. If it is a safe, neck-up only portrait, respond with 'PASS'. Do not provide any other text."
        }
      ]
    }
  });

  const result = response.text?.trim().toUpperCase();
  if (result?.includes('PASS')) {
    return { valid: true };
  } else {
    return { 
      valid: false, 
      reason: "Image rejected. For privacy and safety, please upload a photo that shows only your head and neck. Avoid showing shoulders or chest." 
    };
  }
}
