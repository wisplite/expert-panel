"use client";

import { useState } from "react";
import Message from "./components/message";
import { Send, Settings } from "lucide-react";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { OPENROUTER_API_KEY } from "./components/loadEnv";
import SettingsModal from "./components/settingsModal";

export default function Home() {
  const [activeModel, setActiveModel] = useState("openai/gpt-4o-mini");
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [userConversation, setUserConversation] = useState([]);
  const [aiConversation, setAiConversation] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const openRouter = createOpenRouter({
    apiKey: OPENROUTER_API_KEY,
  });
  const handleSendMessage = async () => {
    const newUserMessage = { role: "user", content: userMessage };
    setUserConversation((prev) => [...prev, newUserMessage]);
    setUserMessage("");
    setLoading(true);
    setWaiting(false);
    setStatus("Generating. Active model: " + activeModel);
    const messagesForApi = [...userConversation, newUserMessage];
    const result = await streamText({
      model: openRouter.chat(activeModel),
      messages: messagesForApi,
    });
    setAiConversation((prev) => [...prev, { role: "assistant", content: `${activeModel}: ` }]);
    for await (const delta of result.textStream) {
      if (!delta) continue;
      setAiConversation((prev) => {
        if (prev.length === 0) {
          return [{ role: "assistant", content: `${activeModel}: ${delta}` }];
        }
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        const last = updated[lastIndex];
        if (last.role !== "assistant") {
          updated.push({ role: "assistant", content: `${activeModel}: ${delta}` });
        } else {
          updated[lastIndex] = { ...last, content: last.content + delta };
        }
        return updated;
      });
    }
    setLoading(false);
    setWaiting(true);
    setStatus("Waiting for initial response from model...");
  }
  return (
    <div className="flex items-center justify-center h-screen flex-1">
      <div className="flex items-start justify-center h-screen w-full p-4 pr-2 gap-4 flex-col">
        <div className="flex flex-col items-start justify-start bg-neutral-900 rounded-lg p-4 w-full h-full overflow-y-auto gap-1">
          {userConversation.map((message, index) => (
            <Message key={index} content={message.content} sender={message.role} />
          ))}
        </div>
        <div className="flex items-center justify-center w-full gap-4">
          <input type="text" className="w-full h-10 bg-neutral-800 rounded-lg p-4 h-full disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading || waiting} placeholder="Type your message here..." value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }} />
        </div>
      </div>
      <div className="flex items-start justify-center h-screen w-full p-4 pl-2 gap-4 flex-col">
        {/* ai chat */}
        <div className="flex flex-col items-start justify-start bg-neutral-900 rounded-lg p-4 w-full h-full overflow-y-auto gap-1">
          {aiConversation.map((message, index) => (
            <Message key={index} content={message.content} sender={message.role} />
          ))}
        </div>
        <div className="flex items-center justify-center w-full gap-4">
          <div className={`flex items-center justify-start w-full gap-4 bg-neutral-800 rounded-lg p-4 ${waiting ? "waiting-rotating-border" : ""} ${loading ? "processing-rotating-border" : ""}`}>
            <p>{status}</p>
          </div>
          <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full" onClick={() => setSettingsModalOpen((prev) => !prev)}>
            <Settings className="w-full h-full" />
          </button>
        </div>
      </div>
      {settingsModalOpen && <SettingsModal setSettingsModalOpen={setSettingsModalOpen} />}
    </div>
  );
}
