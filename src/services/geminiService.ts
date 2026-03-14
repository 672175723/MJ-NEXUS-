import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Simple cache to prevent redundant calls
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes("429") || error.status === 429 || error.code === 429 || error.message?.includes("RESOURCE_EXHAUSTED"))) {
      const jitter = Math.random() * 1000;
      console.warn(`Gemini API rate limited. Retrying in ${Math.round(delay + jitter)}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const geminiService = {
  async getBettingInsights(matchDetails: string) {
    const cacheKey = `betting_insights_${matchDetails}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      return cache[cacheKey].data;
    }

    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this sports event and provide betting insights, probabilities, and risk assessment: ${matchDetails}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prediction: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              riskLevel: { type: Type.STRING },
              keyFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["prediction", "confidence", "riskLevel", "keyFactors"]
          }
        }
      });
      try {
        return JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        return {};
      }
    });

    cache[cacheKey] = { data: result, timestamp: Date.now() };
    return result;
  },

  async optimizeProductListing(productName: string, description: string) {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Optimize this product listing for better sales. Provide an improved title, a compelling description, and suggested tags. Product: ${productName}, Current Description: ${description}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimizedTitle: { type: Type.STRING },
              optimizedDescription: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["optimizedTitle", "optimizedDescription", "tags"]
          }
        }
      });
      try {
        return JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        return {};
      }
    });
  },

  async getAdTargetingInsights(productDetails: string) {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest the best target audience and keywords for advertising this product: ${productDetails}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              targetAudience: { type: Type.STRING },
              suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimatedReach: { type: Type.STRING }
            },
            required: ["targetAudience", "suggestedKeywords", "estimatedReach"]
          }
        }
      });
      try {
        return JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        return {};
      }
    });
  },

  async getCommerceInsights(productDetails: string) {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this product for marketplace commerce insights: ${productDetails}. Provide market demand analysis, suggested pricing, competitive advantages, and seasonal trends.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              marketDemand: { type: Type.STRING },
              suggestedPrice: { type: Type.NUMBER },
              competitiveAdvantage: { type: Type.STRING },
              seasonalTrend: { type: Type.STRING }
            },
            required: ["marketDemand", "suggestedPrice", "competitiveAdvantage", "seasonalTrend"]
          }
        }
      });
      try {
        return JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        return {};
      }
    });
  },

  async getSmartGroupSuggestions(userInterests: string) {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on these user interests: ${userInterests}, suggest 3 "Smart Betting Groups" with catchy names, target sports, and a brief description of the strategy they use.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sport: { type: Type.STRING },
                strategy: { type: Type.STRING }
              },
              required: ["name", "sport", "strategy"]
            }
          }
        }
      });
      try {
        return JSON.parse(response.text || "[]");
      } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        return [];
      }
    });
  },

  async getLiveMatches(currentDate: string) {
    const cacheKey = `live_matches_${currentDate}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      return cache[cacheKey].data;
    }

    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a list of 8-10 realistic upcoming and live sports matches for ${currentDate}. Include Football (Champions League, Premier League), Basketball (NBA), Tennis, and E-Sports. Some matches should be currently live, others upcoming. For each match, provide: id, sport, league, homeTeam, awayTeam, poolAmount (number), participants (number), startTime (HH:mm), status ('Upcoming' or 'Live'), minute (number, only if Live), and odds (object with h, d, a).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    sport: { type: Type.STRING },
                    league: { type: Type.STRING },
                    homeTeam: { type: Type.STRING },
                    awayTeam: { type: Type.STRING },
                    poolAmount: { type: Type.NUMBER },
                    participants: { type: Type.NUMBER },
                    startTime: { type: Type.STRING },
                    status: { type: Type.STRING },
                    minute: { type: Type.NUMBER },
                    odds: {
                      type: Type.OBJECT,
                      properties: {
                        h: { type: Type.NUMBER },
                        d: { type: Type.NUMBER },
                        a: { type: Type.NUMBER }
                      },
                      required: ["h", "a"]
                    }
                  },
                  required: ["id", "sport", "league", "homeTeam", "awayTeam", "poolAmount", "participants", "startTime", "status", "odds"]
                }
              }
            },
            required: ["matches"]
          }
        }
      });
      try {
        const parsed = JSON.parse(response.text || "{}");
        return parsed.matches || [];
      } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        return [];
      }
    });

    cache[cacheKey] = { data: result, timestamp: Date.now() };
    return result;
  },

  async chatSupport(message: string, history: any[]) {
    return withRetry(async () => {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are MJ NEXUS AI assistant. You help users with betting strategies, platform navigation, and general questions about our ecosystem (Marketplace, Servisécur, Crypto). Be professional, helpful, and emphasize the unified nature of our services."
        }
      });
      const response = await chat.sendMessage({ message });
      return response.text;
    });
  },

  async getHelpAssistant(message: string, history: any[]) {
    return withRetry(async () => {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are the MJ NEXUS Help Center Expert. Your goal is to provide detailed, accurate information about all features of the MJ NEXUS platform. 

Key Features to explain:
1. Dashboard: Overview of balance, active bets, and loyalty points.
2. Betting: 
   - Live Matches: Real-time sports betting.
   - P2P Custom Bets: User-created betting pools for anything (milestones, crypto, etc.).
   - Gaming Arena: Multiplayer gaming rooms with voice chat.
3. Marketplace:
   - B2B: Bulk buying for businesses.
   - B2C: Direct consumer shopping.
   - AI Optimization: Sellers can use AI to optimize listings.
4. Servisécur (Home Services):
   - Verified technicians (plumbers, electricians, IT).
   - Secure booking and payment via wallet.
5. MJ Health: Telemedicine with certified doctors.
6. Mobility:
   - Ride Hailing (Moto, Car, Premium).
   - Covoiturage (Carpooling) for long distances.
7. Logistics: Express delivery and smart moving services.
8. Marketing Hub:
   - Bulk WhatsApp/SMS/Email marketing.
   - AI Auto-Pilot for WhatsApp Business (automated, stealthy responses).
9. Finance:
   - Multi-currency wallet (XAF, EUR, USD).
   - Crypto trading and transfers.
   - Micro-loans based on activity.
10. Education: Professional courses with material delivery.
11. Security Levels (L1 to L6): Hierarchical access for platform management.

Always encourage users to explore the different tabs and highlight the 'Unified' aspect of the ecosystem. If a user asks about a feature not listed, explain that MJ NEXUS is constantly evolving.`
        }
      });
      const response = await chat.sendMessage({ message });
      return response.text;
    });
  }
};
