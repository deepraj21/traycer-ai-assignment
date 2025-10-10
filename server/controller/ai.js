import { startChat, generateText } from '../services/gemini.js';
import { CLASSIFY_PROMPT, PLAN_SYSTEM_INSTRUCTION, PLAN_PROMPT, EXECUTE_SYSTEM_INSTRUCTION, EXECUTE_PROMPT } from '../utils/prompt.js';

export const classify = async (req, res) => {
    try {
        const { query } = req.body || {};
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'query is required' });
        }
        const prompt = CLASSIFY_PROMPT(query);
        const text = await generateText({ prompt, systemInstruction: 'Return only one word.' });
        const normalized = (text || '').trim().toLowerCase();
        const result = normalized.includes('plan') ? 'plan' : 'general';
        return res.json({ type: result });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'classification failed' });
    }
}

export const plan = async (req, res) => {
    try {
        const { query, code, history = [] } = req.body || {};
        if (!query) return res.status(400).json({ error: 'query is required' });

        const chat = startChat({
            systemInstruction: PLAN_SYSTEM_INSTRUCTION,
            history: Array.isArray(history) ? history : [],
        });
        const prompt = PLAN_PROMPT({ query, code, history });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        let tasks;
        try { tasks = JSON.parse(text); } catch { tasks = null; }
        if (!Array.isArray(tasks)) {
            const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
            tasks = lines.map((t, i) => ({ task: t.replace(/^[-*\d.\s]+/, '') || `Task ${i + 1}` }));
        }
        return res.json({ tasks });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'plan failed' });
    }
}

export const execute = async (req, res) => {
    try {
        const { task, query, code, history = [] } = req.body || {};
        if (!task) return res.status(400).json({ error: 'task is required' });

        const chat = startChat({
            systemInstruction: EXECUTE_SYSTEM_INSTRUCTION,
            history: Array.isArray(history) ? history : [],
        });
        const prompt = EXECUTE_PROMPT({ task, query, code, history });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        let parsed;
        try { parsed = JSON.parse(text); } catch (e) {
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                try { parsed = JSON.parse(match[0]); } catch { }
            }
        }
        if (!parsed || typeof parsed !== 'object') {
            return res.status(200).json({ explanation: 'Model did not return JSON. Raw output returned.', files: {}, raw: text });
        }
        if (!parsed.files || typeof parsed.files !== 'object') {
            parsed.files = {};
        }
        return res.json(parsed);
    } catch (err) {
        return res.status(500).json({ error: err.message || 'execute failed' });
    }
}