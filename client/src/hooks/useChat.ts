import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useChat(sessionId?: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createSessionMutation = trpc.chat.createSession.useMutation();
  const getSessionsQuery = trpc.chat.getSessions.useQuery();
  const getMessagesQuery = trpc.chat.getMessages.useQuery(
    { sessionId: sessionId || 0 },
    { enabled: !!sessionId }
  );
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const createSession = useCallback(
    async (title?: string) => {
      try {
        const result = await createSessionMutation.mutateAsync({ title });
        if (result.success) {
          return result.sessionId;
        }
        return null;
      } catch (error) {
        console.error("Failed to create session:", error);
        return null;
      }
    },
    [createSessionMutation]
  );

  const sendMessage = useCallback(
    async (sessionId: number, message: string) => {
      if (!message.trim()) return;

      setIsLoading(true);
      try {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          content: message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        const result = await sendMessageMutation.mutateAsync({
          sessionId,
          message,
        });

        if (result.success) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: result.message || "No response",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          console.error("Failed to send message:", result.error);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [sendMessageMutation]
  );

  return {
    messages,
    isLoading,
    createSession,
    sendMessage,
    sessions: getSessionsQuery.data?.sessions || [],
    sessionsLoading: getSessionsQuery.isLoading,
  };
}
