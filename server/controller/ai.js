import { startChat, generateText } from '../services/gemini.js';
import { CLASSIFY_PROMPT, PLAN_SYSTEM_INSTRUCTION, PLAN_PROMPT, REACT_CODE_GEN_PROMPT, EXECUTE_PROMPT } from '../utils/prompt.js';

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

export const respond = async (req, res) => {
    try {
        const { query, history = [] } = req.body || {};
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'query is required' });
        }

        const chat = startChat({
            history: Array.isArray(history) ? history : [],
        });
        const result = await chat.sendMessage(query);
        const response = await result.response;
        const text = response.text();
        return res.json({ text });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'respond failed' });
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
            const unfenced = text
                .replace(/```json[\s\S]*?\n/g, '')
                .replace(/```/g, '')
                .trim();
            const arrayMatch = unfenced.match(/\[[\s\S]*\]/);
            if (arrayMatch) {
                try { tasks = JSON.parse(arrayMatch[0]); } catch { tasks = null; }
            }
        }
        if (!Array.isArray(tasks)) {
            const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
            tasks = lines
                .filter((line) => line && !/^```/.test(line))
                .map((t, i) => {
                    const cleaned = t
                        .replace(/^[-*\d\.\s]+/, '')
                        .replace(/^\{\s*"task"\s*:\s*"(.+?)"\s*\},?$/, '$1')
                        .replace(/^\[|\]$/, '')
                        .trim();
                    return { task: cleaned || `Task ${i + 1}` };
                })
                .filter((obj) => obj.task && obj.task !== '');
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
            systemInstruction: REACT_CODE_GEN_PROMPT,
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
        
        let files = {};
        if (parsed.commands && Array.isArray(parsed.commands)) {
            parsed.commands.forEach(cmd => {
                if (cmd.file_path && cmd.content) {
                    files[cmd.file_path] = { code: cmd.content };
                }
            });
        } else if (parsed.files && typeof parsed.files === 'object') {
            files = {};
            Object.entries(parsed.files).forEach(([path, content]) => {
                if (typeof content === 'string') {
                    files[path] = { code: content };
                } else if (typeof content === 'object' && content.code) {
                    files[path] = content;
                }
            });
        }
        
        return res.json({
            explanation: parsed.explanation || 'Task executed successfully',
            files: files,
            raw: parsed.raw || text
        });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'execute failed' });
    }
}