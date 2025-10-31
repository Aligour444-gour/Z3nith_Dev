
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from '../types';
import ChatMessage from './ChatMessage';
import PersonaSelector from './PersonaSelector';
import SendIcon from './icons/SendIcon';
import { PERSONAS } from '../constants';
// Fix: Import BotIcon to be used in the component.
import BotIcon from './icons/BotIcon';

interface ChatViewProps {
  session: ChatSession | null;
  isResponding: boolean;
  onSendMessage: (prompt: string) => void;
  onNewChat: (personaId: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ session, isResponding, onSendMessage, onNewChat }) => {
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activePersona = session ? PERSONAS.find(p => p.id === session.personaId) : null;
  const Icon = activePersona?.icon;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages.length]);
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isResponding) {
      onSendMessage(prompt);
      setPrompt('');
    }
  };

  if (!session) {
    return <PersonaSelector onSelectPersona={onNewChat} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <header className="flex items-center gap-3 p-4 border-b border-gray-700 flex-shrink-0">
        {Icon && <Icon className="w-6 h-6 text-blue-400" />}
        <h2 className="text-lg font-semibold">{activePersona?.name} Session</h2>
      </header>

      <div className="flex-grow overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
            {session.messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))}
             {isResponding && session.messages[session.messages.length - 1].role === 'user' && (
                <div className="flex gap-4 p-4">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-gray-700">
                        <BotIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                    </div>
                    <div className="pt-1.5 text-gray-400 italic">Thinking...</div>
                </div>
             )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 flex-shrink-0 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask a question or type a command..."
              className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-48 overflow-y-auto"
              rows={1}
              disabled={isResponding}
            />
            <button
              type="submit"
              disabled={isResponding || !prompt.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:bg-blue-500 hover:text-white disabled:hover:bg-transparent disabled:text-gray-600 transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
