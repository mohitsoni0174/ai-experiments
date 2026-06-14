'use client'

import { useState, useRef, useEffect } from 'react'
import { useChatStore, type Message } from '@/lib/store/chat'
import { Button } from '@/components/ui/button'



export function ChatWidget() {
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {
    messages,
    isOpen,
    isLoading,
    addMessage,
    toggleChat,
    setIsLoading,
    setMessages,
  } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto greeting on first open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const greeted = localStorage.getItem('leadpilot_greeted');
      if (!greeted && messages.length === 0) {
        addMessage({
          id: 'greeting',
          role: 'assistant',
          content: 'Hi 👋 Welcome to LeadPilot AI! How can I help today?',
          timestamp: new Date(),
        });
        localStorage.setItem('leadpilot_greeted', 'true');
      }
    }
  }, [isOpen]);

  // Prevent double-submit with a ref
  const isSendingRef = useRef(false)
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading || isSendingRef.current) return;
    isSendingRef.current = true;
    setIsLoading(true);

    // Create conversation if doesn't exist
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      try {
        const response = await fetch('/api/chat/start', { method: 'POST' });
        const data = await response.json();
        setConversationId(data.conversationId);
        currentConversationId = data.conversationId;
      } catch (error) {
        console.error('Failed to create conversation:', error);
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInput('');

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationId: currentConversationId,
        }),
      });
      let reply = '';
      if (!response.ok) {
        console.error('API /api/chat/message failed:', response.status, response.statusText);
        reply = 'Sorry, something went wrong. Please try again.';
      } else {
        try {
          const data = await response.json();
          // If reply is a JSON string, parse it and extract the reply field
          let rawReply = data?.reply || '';
          if (typeof rawReply === 'string') {
            rawReply = rawReply.trim();
            try {
              const parsed = JSON.parse(rawReply);
              if (parsed && typeof parsed.reply === 'string') {
                reply = parsed.reply;
              } else {
                reply = rawReply;
              }
            } catch {
              reply = rawReply;
            }
          } else {
            reply = '' + rawReply;
          }
        } catch (err) {
          console.error('Failed to parse response JSON:', err);
          reply = 'Sorry, something went wrong. Please try again.';
        }
        if (!reply) reply = 'Sorry, something went wrong. Please try again.';
      }
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
      scrollToBottom();
    }
  };

  // Unified send handler to prevent double submit
  const handleSend = () => {
    if (!isLoading && !isSendingRef.current && input.trim()) {
      handleSendMessage(input);
    }
  };

  const handleSendForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-2 rounded-full shadow-lg transition-all transform z-40 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 scale-100'
            : 'bg-blue-600 hover:bg-blue-700 scale-100'
        }`}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-2xl flex flex-col z-40 h-[600px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg">Chat with AI</span>
              <span className="flex items-center gap-1 text-green-300 text-sm font-semibold">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-1" />
                Online
              </span>
            </div>
            <div className="text-xs text-white/80 mb-1">Typically replies in a few seconds</div>
            <p className="text-sm opacity-90">Ask anything about our services</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">Start a conversation</p>
                </div>
              </div>
            ) : (
              <>

                {messages.map((msg, idx) => {
                  // Try to parse assistant reply as JSON with headline/bullets/cta
                  let parsed = null;
                  if (msg.role === 'assistant') {
                    try {
                      parsed = JSON.parse(msg.content);
                    } catch {}
                  }
                  // Greeting logic: if previous user message is 'hi', 'hello', etc., prepend greeting
                  let greeting = '';
                  if (
                    msg.role === 'assistant' &&
                    idx > 0 &&
                    messages[idx - 1].role === 'user' &&
                    /^(hi|hello|hey|greetings)[!. ]*$/i.test(messages[idx - 1].content.trim())
                  ) {
                    greeting = '👋 Hi there!';
                  }
                  if (
                    msg.role === 'assistant' &&
                    parsed &&
                    typeof parsed === 'object' &&
                    typeof parsed.headline === 'string' &&
                    Array.isArray(parsed.bullets) &&
                    parsed.bullets.length > 0
                  ) {
                    return (
                      <div key={msg.id} className="flex justify-start">
                        <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-900 rounded-bl-none">
                          {greeting && <div className="mb-1 text-base font-semibold">{greeting}</div>}
                          <div className="font-bold mb-1">{parsed.headline}</div>
                          <ul className="list-disc pl-5 mb-1">
                            {parsed.bullets.map((b: string, i: number) => (
                              <li key={i} className="text-sm">{b}</li>
                            ))}
                          </ul>
                          {parsed.cta && <div className="mt-1 text-sm font-medium">{parsed.cta}</div>}
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  // Fallback: render as plain text (user or non-structured assistant)
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{greeting ? greeting + ' ' : ''}{msg.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-900 rounded-bl-none flex items-center gap-2">
                      <span className="text-sm font-medium">AI is typing</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <form
            onSubmit={handleSendForm}
            className="border-t border-gray-200 p-4 w-full"
          >
            <div className="flex gap-2 w-full items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                  // Shift+Enter allows new line
                }}
                disabled={isLoading}
                placeholder="Type your message..."
                rows={3}
                className="w-full flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-black placeholder:text-gray-400 bg-white resize-none shadow-sm"
                style={{ minHeight: '56px', maxHeight: '140px', fontSize: '1rem', fontWeight: 500 }}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow"
              >
                Send
              </Button>
            </div>
            <div className="flex w-full justify-between mt-1">
              <span className="text-xs text-gray-400">Enter to Send &nbsp;|&nbsp; Shift+Enter for new line</span>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
