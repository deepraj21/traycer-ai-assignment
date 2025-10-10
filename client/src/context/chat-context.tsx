import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ChatHistoryMessage } from "@/utils/api";
import { classifyQuery, executeTask, planTasks, respondQuery } from "@/utils/api";
import { loadCurrentProject } from "@/utils/project-storage";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  reasoning?: string;
  explanation?: string;
};

export type PlanTask = {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed";
  explanation?: string;
};

type ChatContextValue = {
  messages: ChatMessage[];
  plan: PlanTask[];
  isPlanning: boolean;
  isExecuting: boolean;
  hasProject: boolean;
  sendMessage: (text: string) => Promise<void>;
  resetPlan: () => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function useHasProject(): boolean {
  const [hasProject, setHasProject] = useState<boolean>(false);

  useEffect(() => {
    setHasProject(!!loadCurrentProject());

    const onStorage = () => setHasProject(!!loadCurrentProject());
    const onCreated = () => setHasProject(true);
    const onCleared = () => setHasProject(false);
    window.addEventListener("storage", onStorage);
    window.addEventListener("project-created", onCreated as EventListener);
    window.addEventListener("project-cleared", onCleared as EventListener);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return hasProject;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [plan, setPlan] = useState<PlanTask[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const hasProject = useHasProject();
  const runningRef = useRef(false);

  const historyForApi = useMemo<ChatHistoryMessage[]>(() => {
    return messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));
  }, [messages]);

  const broadcastFiles = useCallback((projectId: string, files: Record<string, string>) => {
    window.dispatchEvent(
      new CustomEvent("sandpack-file-change", {
        detail: { projectId, files },
      })
    );
  }, []);

  const executePlannedTasks = useCallback(async (userText: string, tasksToExecute: PlanTask[]) => {
    const current = loadCurrentProject();
    if (!current) return;

    setIsExecuting(true);
    runningRef.current = true;
    try {
      for (let i = 0; i < tasksToExecute.length; i++) {
        if (!runningRef.current) break;
        const t = tasksToExecute[i];
        setPlan((prev) => prev.map((p) => (p.id === t.id ? { ...p, status: "running" } : p)));

        const res = await executeTask({ task: t.title, query: userText, history: historyForApi });

        const explanation = res.explanation;
        const filesMap = Object.fromEntries(
          Object.entries(res.files || {}).map(([path, obj]) => [path, obj.code])
        );

        if (Object.keys(filesMap).length > 0) {
          console.log('Broadcasting files:', filesMap);
          broadcastFiles(current.id, { ...current.files, ...filesMap });
        }

        setPlan((prev) => prev.map((p) => (p.id === t.id ? { ...p, status: "completed", explanation } : p)));
      }
    } catch (err) {
      setPlan((prev) => prev.map((p) => (p.status === "running" ? { ...p, status: "failed" } : p)));
    } finally {
      setIsExecuting(false);
      runningRef.current = false;
    }
  }, [broadcastFiles, historyForApi]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);

    // classify and plan
    setIsPlanning(true);
    try {
      const cls = await classifyQuery(text);
      if (cls.type === "plan") {
        const p = await planTasks({ query: text, history: historyForApi });
        const tasks: PlanTask[] = (p.tasks || []).map((t) => ({
          id: crypto.randomUUID(),
          title: t.task,
          status: "pending",
        }));
        setPlan(tasks);

        // AI message summarizing the plan
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: `Planned ${tasks.length} task(s). I will execute them one by one.`,
          },
        ]);

        await executePlannedTasks(text, tasks);
      } else {
        // General response flow
        const res = await respondQuery({ query: text, history: historyForApi });
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", text: res.text || "" },
        ]);
      }
    } finally {
      setIsPlanning(false);
    }
  }, [executePlannedTasks, historyForApi]);

  const resetPlan = useCallback(() => setPlan([]), []);

  const value: ChatContextValue = {
    messages,
    plan,
    isPlanning,
    isExecuting,
    hasProject,
    sendMessage,
    resetPlan,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}


