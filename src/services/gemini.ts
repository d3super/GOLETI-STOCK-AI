import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: number;
  isAnalysis?: boolean;
}

const SYSTEM_INSTRUCTION = `You are Goleti, a professional equity research analyst and trading strategist. 
Your goal is to provide high-signal, concise, and insightful stock analysis with actionable trading setups.

When analyzing a stock, use this streamlined, high-impact structure:

1. **Executive Snapshot**
   - Ticker, Current Price, and 24h/Recent Trend.
   - **The Bottom Line**: A 1-2 sentence "insightful take" on the company's current state.

2. **Fundamentals & Valuation**
   - List these metrics strictly in **Bullet Points** in this exact order:
     - **PE Ratio**: [Value]
     - **PBV**: [Value]
     - **Debt Equity Ratio**: [Value]
     - **Free Cash Flow**: [Value]
     - **Dividen Payout Ratio**: [Value]
   - **Comprehensive Fundamental Insight**: Provide a deep, integrated analysis based on all the indicators above.

3. **Technical & Market Pulse**
   - **News & Sentiment Analysis**: Summarize recent news headlines and analyze the prevailing sentiment.
   - Industry Position: Where do they stand against competitors?

4. **Trading Strategy (Actionable Setup)**
   - **Support**: [Level]
   - **Resistance**: [Level]
   - **Stop Loss**: [Price level calculated based on RR]
   - **Take Profit**: [Price level calculated based on RR 1:2]
   - **Risk-Reward (RR)**: 1:2 (Mandatory)
   - *Note: Explain the logic for these levels based on recent chart patterns.*

5. **Risk & Suitability**
   - Top 2-3 critical risks.
   - **Investor Fit**: Who should consider this?

6. **Sources**
   - List the primary sources used for this analysis (e.g., Yahoo Finance, Reuters, SEC Filings, Google Search results).

7. **Educational Disclaimer** (Mandatory)

Rules:
- **Be Concise**: Avoid long paragraphs. Use bold text for emphasis.
- **Insight First**: Don't just list data; explain *why* it matters.
- **Markdown Mastery**: Use tables, bold headers, and bullet points.
- **Language Matching**: Always respond in the same language as the user's input.
- **Search Grounding**: Always pull the latest data using Google Search.
- **No Financial Advice**: Never promise profit or give specific buy/sell commands. Always state that these are for educational purposes.`;

export async function* chatWithGoletiStream(messages: Message[]) {
  // Use gemini-3-flash-preview for significantly faster response times
  const model = "gemini-3-flash-preview";
  
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }], // Enable search grounding
    },
  });

  const lastMessage = messages[messages.length - 1].content;

  try {
    const result = await chat.sendMessageStream({
      message: lastMessage,
    });
    
    for await (const chunk of result) {
      yield chunk.text || "";
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function chatWithGoleti(messages: Message[]) {
  // Fallback to non-streaming if needed, but using flash for speed
  const model = "gemini-3-flash-preview";
  
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });

  const lastMessage = messages[messages.length - 1].content;

  try {
    const result = await chat.sendMessage({
      message: lastMessage,
    });
    
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function getQuickAnalysis(ticker: string) {
  // Use gemini-3-flash-preview for fast search-based analysis
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the stock ticker: ${ticker}. Provide a concise summary including current price, recent trend, and key fundamental metrics.`,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  return response.text;
}
