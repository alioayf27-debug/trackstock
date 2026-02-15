import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from "../types";

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize Gemini Client", e);
}

export const getStockSummary = async (ticker: string, companyName: string): Promise<string> => {
  if (!ai) {
    return `${companyName} (${ticker}) is showing significant volatility today. Analysts are watching key resistance levels as global market sentiment shifts.`;
  }

  try {
    const model = "gemini-3-flash-preview";
    const prompt = `Provide a very short, punchy 2-sentence financial summary for ${companyName} (${ticker}). Why is it interesting right now? Focus on momentum, recent news, or technicals. Be professional but exciting.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "Market data analysis in progress.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "AI analysis unavailable at this moment. Showing technical fallback.";
  }
};

export const getNewsSummary = async (headline: string, source: string): Promise<string> => {
    if (!ai) {
        return "This story is developing. Analysts are monitoring the impact on related sectors. Click 'Read Full Story' for more details.";
    }

    try {
        const model = "gemini-3-flash-preview";
        const prompt = `You are a financial news analyst. Write a 2-sentence summary explaining the potential market impact of this headline from ${source}: "${headline}". Keep it factual and concise.`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text || "Summary unavailable.";
    } catch (error) {
        return "Unable to generate AI summary at this time.";
    }
};

export const getMarketNews = async (): Promise<NewsItem[]> => {
    if (!ai) return [];

    try {
        const model = "gemini-3-flash-preview";
        const response = await ai.models.generateContent({
            model,
            contents: "Generate 6 diverse, realistic, and current-sounding financial news headlines. Mix of US Tech, Global Markets, Energy, and Crypto. Timestamps should be relative (e.g. 'Just now', '12m ago'). Sources should be reputable financial outlets.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            source: { type: Type.STRING },
                            headline: { type: Type.STRING },
                            time: { type: Type.STRING },
                            url: { type: Type.STRING }
                        },
                        required: ["source", "headline", "time"]
                    }
                }
            }
        });

        if (response.text) {
            const news = JSON.parse(response.text) as NewsItem[];
            // Ensure URLs are set (schema allows it but good to be safe)
            return news.map(n => ({...n, url: n.url || '#'}));
        }
        return [];
    } catch (e) {
        console.error("Failed to fetch market news", e);
        return [];
    }
};