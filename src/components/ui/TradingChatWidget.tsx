"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2, AlertCircle } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { useTradingChatStore } from "@/stores/tradingChatStore";
import { checkOllamaStatus, sendChatMessage, type ChatMessage } from "@/api/tradingChatApi";

export default function TradingChatWidget() {
  const theme = useThemeStore((state) => state.theme);
  const { isAuthenticated, user } = useAuthStore();
  const d = theme === "dark";
  
  // Use persisted store for messages and open state
  const {
    messages,
    isOpen,
    setMessages,
    setIsOpen,
    clearMessages,
    isExpired,
    checkAndClearIfDifferentUser,
  } = useTradingChatStore();
  
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Ollama status and handle message expiration on mount
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    // Check if this is a different user and clear chat if needed
    const currentUserId = user.id?.toString() || user.username;
    checkAndClearIfDifferentUser(currentUserId);
    
    const checkStatus = async () => {
      try {
        const status = await checkOllamaStatus();
        setIsOllamaAvailable(status.running);
        
        // Check if messages are expired (older than 1 hour)
        if (isExpired()) {
          clearMessages();
        }
        
        // Add personalized greeting message if Ollama is available and no messages
        if (status.running && messages.length === 0) {
          const username = user?.username || "there";
          setMessages([{
            role: "assistant",
            content: `Ribbit! 🐸 Hi ${username}! I'm Fric, your trading coach. How can I help you in your trading journey today?`
          }], currentUserId);
        }
      } catch (error) {
        setIsOllamaAvailable(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    
    checkStatus();
  }, [isAuthenticated, user, isExpired, clearMessages, setMessages, messages.length, checkAndClearIfDifferentUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending || !user) return;

    const userMessage = inputValue.trim();
    const currentUserId = user.id?.toString() || user.username;
    setInputValue("");
    
    // Reset textarea height after sending
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }, 0);
    
    // Add user message to chat (store will persist it)
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    setMessages(newMessages, currentUserId);
    setIsSending(true);

    try {
      const response = await sendChatMessage(userMessage, messages);
      
      if (response.status === "ok") {
        // Store will persist the updated history
        setMessages(response.updated_history, currentUserId);
      } else {
        // Add error message
        setMessages([
          ...newMessages,
          { role: "assistant", content: response.reply }
        ], currentUserId);
      }
    } catch (error: any) {
      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: "Sorry, I encountered an error. Please try again." 
        }
      ], currentUserId);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't show if not authenticated
  if (!isAuthenticated) return null;

  // Don't show if Ollama is not available (after checking)
  if (!isCheckingStatus && !isOllamaAvailable) return null;

  return (
    <>
      {/* Floating Button - Fric the Frog */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 text-2xl cursor-pointer ${
            d
              ? "bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
              : "bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400"
          }`}
          aria-label="Open Fric chat"
          title="Chat with Fric 🐸"
        >
          🐸
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-96 h-[32rem] rounded-lg shadow-2xl flex flex-col ${
            d ? "bg-background border border-border" : "bg-white border border-slate-200"
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${d ? "border-border bg-gradient-to-r from-green-600/10 to-emerald-600/10" : "border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50"}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐸</span>
              <div>
                <h3 className="font-semibold text-foreground">Fric</h3>
                <p className="text-xs text-muted-foreground">Your Trading Coach</p>
              </div>
              <div className={`ml-2 w-2 h-2 rounded-full ${isOllamaAvailable ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isCheckingStatus ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : !isOllamaAvailable ? (
              <div className={`flex flex-col items-center justify-center h-full text-center p-4 ${d ? "text-muted-foreground" : "text-slate-600"}`}>
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="font-semibold mb-2">Ollama Not Available</p>
                <p className="text-sm">
                  Please install and run Ollama to chat with Fric.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <span className="text-xl mr-2 flex-shrink-0">🐸</span>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === "user"
                          ? d
                            ? "bg-green-600 text-white"
                            : "bg-green-500 text-white"
                          : d
                          ? "bg-muted text-foreground"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <span className="text-xl mr-2">🐸</span>
                    <div className={`rounded-lg px-4 py-2 ${d ? "bg-muted" : "bg-slate-100"}`}>
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {isOllamaAvailable && (
            <div className={`p-4 border-t ${d ? "border-border" : "border-slate-200"}`}>
              <div className="flex gap-2 items-end">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Fric about your trades..."
                  disabled={isSending}
                  rows={1}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors resize-none overflow-hidden ${
                    d
                      ? "bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  } border focus:outline-none focus:ring-2 focus:ring-green-500`}
                  style={{
                    minHeight: '40px',
                    maxHeight: '120px',
                    height: 'auto'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isSending}
                  className={`px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                    !inputValue.trim() || isSending
                      ? "bg-slate-300 cursor-not-allowed"
                      : d
                      ? "bg-green-600 hover:bg-green-500 text-white cursor-pointer"
                      : "bg-green-500 hover:bg-green-400 text-white cursor-pointer"
                  }`}
                  aria-label="Send message"
                  style={{ height: '40px' }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
