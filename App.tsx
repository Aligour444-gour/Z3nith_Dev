
import React, { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message } from './types';
import { streamChatResponse, generateChatTitle } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import { PERSONAS } from './constants';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Load sessions and check for API key on mount
  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      return;
    }
    
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
      const savedActiveId = localStorage.getItem('activeSessionId');
      if (savedActiveId) {
        setActiveSessionId(savedActiveId);
      }
    } catch (error) {
      console.error("Failed to load sessions from local storage:", error);
    }
  }, []);

  // Save sessions to local storage whenever they change
  useEffect(() => {
    if (apiKeyMissing) return;
    try {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
      if (activeSessionId) {
        localStorage.setItem('activeSessionId', activeSessionId);
      }
    } catch (error) {
      console.error("Failed to save sessions to local storage:", error);
    }
  }, [sessions, activeSessionId, apiKeyMissing]);

  const handleNewChat = (personaId: string) => {
    const persona = PERSONAS.find(p => p.id === personaId);
    if (!persona) return;

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      personaId: personaId,
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false); // Close sidebar on mobile after starting a chat
  };

  const handleClearAndNewChat = () => {
    setActiveSessionId(null);
  }

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!activeSessionId) return;

    const userMessage: Message = { role: 'user', content: prompt };
    
    // Immediately add user message
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, userMessage] }
          : s
      )
    );

    setIsResponding(true);

    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (!activeSession) return;
    
    const persona = PERSONAS.find(p => p.id === activeSession.personaId);
    if (!persona) return;

    const updatedHistory = [...activeSession.messages, userMessage];

    // Add empty model message for streaming
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { ...s, messages: [...updatedHistory, { role: 'model', content: '' }] }
          : s
      )
    );

    // Generate title if it's the first message
    if (activeSession.messages.length === 0) {
      generateChatTitle(prompt).then(title => {
        setSessions(prev =>
          prev.map(s =>
            s.id === activeSessionId ? { ...s, title } : s
          )
        );
      });
    }

    const stream = streamChatResponse(updatedHistory, persona.systemInstruction);
    for await (const chunk of stream) {
      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            const newMessages = [...s.messages];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.content += chunk;
            return { ...s, messages: newMessages };
          }
          return s;
        })
      );
    }
    
    setIsResponding(false);

  }, [activeSessionId, sessions]);
  
  const activeSession = sessions.find(session => session.id === activeSessionId) || null;
  
  if (apiKeyMissing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-200">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400 mb-4">Configuration Required</h1>
          <p className="text-gray-300">
            Welcome to the AI Developer Chatbot!
          </p>
          <p className="text-gray-400 mt-2">
            To get started, the application needs an API key for Google's AI services.
          </p>
          <div className="text-left bg-gray-900 p-4 rounded-md mt-6">
             <p className="text-gray-500 text-sm">
                This application is designed to automatically use an API key provided through an environment variable (<code>API_KEY</code>). Please ensure it is set up in your hosting environment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans">
       <div className={`fixed inset-y-0 left-0 z-30 w-full transform transition-transform duration-300 md:relative md:translate-x-0 md:w-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onNewChatClick={handleClearAndNewChat}
              onSelectSession={(id) => {
                setActiveSessionId(id);
                setIsSidebarOpen(false); // Close sidebar on selection in mobile
              }}
            />
        </div>

      <main className="flex-1 flex flex-col h-full">
         <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden absolute top-4 left-4 z-40 p-2 bg-gray-800 rounded-md"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <ChatView
          session={activeSession}
          isResponding={isResponding}
          onSendMessage={handleSendMessage}
          onNewChat={handleNewChat}
        />
      </main>
    </div>
  );
};

export default App;
