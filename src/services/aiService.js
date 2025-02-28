// Install required packages:
// npm install openai

// First, create a service for handling API calls
// src/services/aiService.js

import OpenAI from "openai";

// Create OpenAI client with OpenRouter configuration
const createClient = () => {
  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY, // Store your API key in .env file
    defaultHeaders: {
      "HTTP-Referer": import.meta.env.VITE_SITE_URL, // Optional - for rankings
      "X-Title": import.meta.env.VITE_SITE_NAME, // Optional - for rankings
    },
    dangerouslyAllowBrowser: true, // Add this line to allow browser usage
  });
};

export const getCompletion = async (prompt) => {
  try {
    const client = createClient();

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("AI API Error:", error);
    throw error;
  }
};
