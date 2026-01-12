
import { GoogleGenAI, Type } from "@google/genai";

export const classifyWhatsAppMessage = async (message: string, businessType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Classify this Bangladeshi customer WhatsApp message for a ${businessType} business. Message: "${message}". Return JSON only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "price_inquiry|order|complaint|general|greeting" },
          suggested_reply: { type: Type.STRING, description: "Polite Bangla reply" },
          urgency: { type: Type.STRING, description: "high|medium|low" },
          should_convert_to_order: { type: Type.BOOLEAN }
        },
        required: ["category", "suggested_reply", "urgency", "should_convert_to_order"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const parseReceiptImage = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
        { text: "Extract structured data from this receipt. Prices are in BDT. Vendor name might be in Bangla. Return JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vendor: { type: Type.STRING },
          total_amount: { type: Type.NUMBER },
          category: { type: Type.STRING, description: "raw_materials|utilities|rent|inventory|other" },
          date: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["vendor", "total_amount", "category", "date"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const getBusinessHealthAdvice = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this business data: ${JSON.stringify(data)}. Provide a concise business health score (0-100) and 2 sentences of advice in Bangla for a small shop owner. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          advice: { type: Type.STRING }
        },
        required: ["score", "advice"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateMarketingPost = async (
  product: string, 
  goal: string, 
  tone: string, 
  businessName: string,
  platform: string,
  season: string,
  contentType: string // 'Post' or 'Ad Copy'
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a highly creative and engaging ${contentType} for ${platform} for a Bangladeshi F-commerce business named "${businessName}". 
    The product/topic is: ${product}. 
    Goal: ${goal}. 
    Tone: ${tone}. 
    Current Season/Festival: ${season}.
    Language: Standard Bengali (Bangla). 
    
    Requirements for ${contentType}:
    - Use a catchy hook at the start.
    - Mention features/benefits clearly.
    - For "Ad Copy", include delivery information (Cash on Delivery available, inside/outside Dhaka charges).
    - Use appropriate emojis for the Bangladeshi audience.
    - Add relevant hashtags.
    - Clear Call to Action (e.g., "অর্ডার করতে ইনবক্স করুন বা কল করুন 017XXXXXXXX").
    
    Return the content as plain text.`,
  });
  return response.text;
};

export const generateMarketingImage = async (product: string, businessType: string, season: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `A high quality, vibrant promotional marketing photo for a Bangladeshi ${businessType} business. 
  The photo features ${product}. 
  Context: ${season}. 
  Style: Realistic professional commercial photography with local Bangladeshi aesthetic, soft warm lighting. No text in the image.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
