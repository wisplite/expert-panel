"use client";

import { useState } from "react";
import Message from "./components/message";
import { Send, Settings } from "lucide-react";

export default function Home() {
  const [activeModel, setActiveModel] = useState("gpt-4o");
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [userConversation, setUserConversation] = useState([]);
  const [aiConversation, setAiConversation] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const handleSendMessage = () => {
    setUserConversation((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserMessage("");
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
          <input type="text" className="w-full h-10 bg-neutral-800 rounded-lg p-4 h-full" placeholder="Type your message here..." value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => {
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
          <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full" onClick={() => setLoading((prev) => !prev)}>
            <Settings className="w-full h-full" />
          </button>
        </div>
      </div>
    </div>
  );
}
