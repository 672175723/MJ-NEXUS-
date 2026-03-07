import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async getBettingInsights(matchDetails: string) {
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
    return JSON.parse(response.text || "{}");
  },

  async optimizeProductListing(productName: string, description: string) {
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
    return JSON.parse(response.text || "{}");
  },

  async getAdTargetingInsights(productDetails: string) {
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
    return JSON.parse(response.text || "{}");
  },

  async getCommerceInsights(productDetails: string) {
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
    return JSON.parse(response.text || "{}");
  },

  async getSmartGroupSuggestions(userInterests: string) {
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
    return JSON.parse(response.text || "[]");
  },

  async getLiveMatches(currentDate: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 8-10 realistic upcoming and live sports matches for ${currentDate}. Include Football (Champions League, Premier League), Basketball (NBA), Tennis, and E-Sports. Some matches should be currently live, others upcoming. For each match, provide: id, sport, league, homeTeam, awayTeam, poolAmount (number), participants (number), startTime (HH:mm), status ('Upcoming' or 'Live'), minute (number, only if Live), and odds (object with h, d, a).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
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
      }
    });
    return JSON.parse(response.text || "[]");
  },

  async chatSupport(message: string, history: any[]) {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are MJ NEXUS AI assistant. You help users with betting strategies, platform navigation, and general questions about our ecosystem (Marketplace, Servisécur, Crypto). Be professional, helpful, and emphasize the unified nature of our services."
      }
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async getHelpAssistant(message: string, history: any[]) {
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
  }
};
