
import React from 'react';
import { ChatSession } from '../types';
import PlusIcon from './icons/PlusIcon';
import { PERSONAS } from '../constants';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChatClick: () => void;
  onSelectSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChatClick, onSelectSession }) => {
  return (
    <div className="w-full md:w-64 lg:w-72 bg-gray-900 p-2 flex flex-col h-full border-r border-gray-700">
      <button
        onClick={onNewChatClick}
        className="w-full flex items-center justify-between p-3 rounded-lg text-left text-gray-200 hover:bg-gray-700 transition-colors mb-4"
      >
        <span>New Chat</span>
        <PlusIcon className="w-5 h-5" />
      </button>
      <div className="flex-grow overflow-y-auto pr-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">History</h3>
        <nav className="flex flex-col gap-1">
          {sessions.map((session) => {
            const persona = PERSONAS.find(p => p.id === session.personaId);
            const Icon = persona?.icon;
            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`flex items-center gap-3 p-3 rounded-lg text-left text-sm truncate ${
                  activeSessionId === session.id
                    ? 'bg-blue-600/30 text-white'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                <span className="flex-grow truncate">{session.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
