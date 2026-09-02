import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
const ai = new GoogleGenAI({});
async function run() {
  const chat = ai.chats.create({ model: 'gemini-2.5-flash' });
  try {
    const res = await chat.sendMessage({ message: "Hello" } as any);
    console.log("SUCCESS:", res.text);
  } catch(e: any) {
    console.error("Error with object payload:", e.message);
  }
}
run();
