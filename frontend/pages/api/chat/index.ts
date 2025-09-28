import { GoogleGenAI } from '@google/genai';
import type { NextApiRequest, NextApiResponse } from 'next'; // 1. Correct imports for Pages Router

// Initialize the Gemini client
// Ensure the @google/genai package is installed: npm install @google/genai
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * IMPORTANT FIX: For Next.js Pages Router (pages/api/*), the file MUST export a default function.
 * This handler function takes 'req' (request) and 'res' (response).
 */
export default async function handler(
  req: NextApiRequest, // Next.js automatically parses the body for POST requests
  res: NextApiResponse
) {
  // Check if the request method is POST, as designed.
  if (req.method !== 'POST') {
    // Return 405 Method Not Allowed for any other method
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // In Pages Router, the JSON body is automatically parsed into req.body
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Missing userMessage in request body.' });
    }

    // Define the System Prompt to enforce the rules (Same as before)
    const systemInstruction = `You are a helpful, specialized chatbot named AgriBot. Your responses MUST be strictly limited to the topics of: 
    1. Agricultural Commerce (market prices, supply chain, trade).
    2. Agricultural Education (best practices, farming techniques, crop knowledge).
    If the user asks a question on any other topic (like politics, movies, or general knowledge), you must politely refuse and state your limitations.`;

    // Configure the call for Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Fast and powerful free-tier model
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // Extract and return the AI's response
    const botReply = response.text ? response.text.trim() : "AgriBot failed to generate a complete answer. Please rephrase your question.";

    // Use res.status().json() to send the response back
    return res.status(200).json({
      reply: botReply
    });

  } catch (error) {
    console.error('API Error:', error);
    // Use res.status().json() to handle errors
    return res.status(500).json(
      { error: "Failed to fetch response from the AI. Check API Key, Quota, and environment variables." }
    );
  }
}
