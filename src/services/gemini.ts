import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';

export const getGeminiResponse = async (prompt: string, modelName: string = "gemini-3.1-pro-preview") => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: "You are Finora, an intelligent stock analysis chatbot. You provide fundamental, technical, and market sentiment analysis. Be professional, data-driven, and clear. Use Indonesian if the user asks in Indonesian, otherwise use English. Format your responses with Markdown for clarity.",
    },
  });

  return response.text;
};

export const getStockAnalysis = async (symbol: string) => {
  const prompt = `Analyze the stock with symbol ${symbol}. Provide a detailed report including:
  1. Current market status (price, change).
  2. Fundamental analysis (P/E ratio, Market Cap, Dividend Yield).
  3. Technical analysis (RSI, Moving Averages).
  4. Market sentiment (Bullish, Bearish, or Neutral).
  5. A final summary and recommendation.
  
  Format the output in a structured way using Markdown.`;

  return getGeminiResponse(prompt, "gemini-3.1-pro-preview");
};
