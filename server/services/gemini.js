import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn('Warning: GEMINI_API_KEY is not set.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export function getGeminiModel(modelName = 'gemini-2.5-flash') {
    return {
        async generateContent(contents) {
            return ai.models.generateContent({ model: modelName, contents });
        },
    };
}

export function startChat({ modelName = 'gemini-2.5-flash', systemInstruction, history = [] } = {}) {
    const chat = ai.chats.create({ model: modelName, history, systemInstruction });
    return {
        async sendMessage(message) {
            const resp = await chat.sendMessage({ message: typeof message === 'string' ? message : String(message ?? '') });
            const text = resp && typeof resp.text === 'string' ? resp.text : '';
            return { response: { text: () => text } };
        },
    };
}

export async function generateText({ modelName = 'gemini-2.5-flash', prompt, systemInstruction, config } = {}) {
    const resp = await ai.models.generateContent({
        model: modelName,
        contents: typeof prompt === 'string' ? prompt : String(prompt ?? ''),
        systemInstruction,
        config,
    });
    return resp && typeof resp.text === 'string' ? resp.text : '';
}

