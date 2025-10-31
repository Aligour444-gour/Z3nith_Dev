import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export async function* streamChatResponse(history: Message[], systemInstruction: string) {
  try {
    const ai = getAI();
    
    const chatHistory = history.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: chatHistory,
      config: { systemInstruction },
    });

    const latestUserMessage = history[history.length - 1];

    // FIX: The 'history' parameter is not allowed in `chat.sendMessageStream`.
    // It should be passed when creating the chat session.
    const result = await chat.sendMessageStream({ 
      message: latestUserMessage.content,
    });

    for await (const chunk of result) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error streaming chat response:", error);
    yield "Sorry, I encountered an error. Please try again.";
  }
}

export async function generateChatTitle(prompt: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a concise, 5-word-or-less title for a chat conversation that starts with this prompt: "${prompt}". Do not use quotes or any other formatting in the title.`,
    });
    return response.text.trim().replace(/"/g, '');
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Chat";
  }
}
