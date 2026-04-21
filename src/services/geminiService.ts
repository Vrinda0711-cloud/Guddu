import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ImageInstruction {
  action: 'remove_background' | 'adjust_colors' | 'remove_object' | 'unknown';
  parameters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    objectDescription?: string;
    coordinates?: { x: number; y: number; width: number; height: number };
  };
}

export async function parseInstruction(instruction: string, imageBase64?: string): Promise<ImageInstruction[]> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an AI assistant helping with product photo editing. 
    Analyze the user's instruction and the image (if provided) to determine the editing actions required.
    
    Return a JSON array of actions. Actions can be:
    1. 'remove_background': Remove the subject's background.
    2. 'adjust_colors': Change brightness, contrast, or saturation.
    3. 'remove_object': Remove a specific object described by the user.
    
    For 'adjust_colors', provide values between -100 and 100 (0 is neutral).
    For 'remove_object', provide a description and if possible, normalized coordinates [0-1] for the bounding box.
    
    Example response:
    [
      { "action": "remove_background" },
      { "action": "adjust_colors", "parameters": { "brightness": 20, "contrast": 10 } }
    ]
  `;

  const contents: any[] = [{ text: instruction }];
  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (error) {
    console.error("Error parsing instruction:", error);
  }
  
  return [{ action: 'unknown' }];
}
