import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";

export default function Chat() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const { messages, isLoading, createSession, sendMessage } = useChat(sessionId || undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Create a new session on mount
    if (!sessionId) {
      createSession("Chat Session").then((id) => {
        if (id) setSessionId(id);
      });
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    await sendMessage(sessionId, input);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Chat</h1>
        <p className="text-muted-foreground mt-2">
          Chat with Gemini AI. Your conversations are stored for learning and context.
        </p>
      </div>

      <Card className="border-border/50 flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Conversation
          </CardTitle>
          <CardDescription>Powered by Gemini 1.5 Flash with learning capability</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg rounded-bl-none">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim() || !sessionId}
            size="icon"
            className="gap-2"
          >
            <Send className="h-4 w-4" />
          </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {sessionId ? "Press Enter to send. Your conversations are stored for context learning." : "Initializing chat session..."}
          </p>
        </div>
      </Card>
    </div>
  );
}
