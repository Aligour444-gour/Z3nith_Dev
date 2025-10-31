
import React from 'react';
import { PERSONAS } from '../constants';
import { Persona } from '../types';

interface PersonaSelectorProps {
  onSelectPersona: (personaId: string) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelectPersona }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-200 mb-2">AI Developer Chatbot</h1>
        <p className="text-lg text-gray-400 mb-8">Choose a persona to start your conversation</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl w-full">
        {PERSONAS.map((persona: Persona) => {
          const Icon = persona.icon;
          return (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className="bg-gray-800 p-6 rounded-lg text-left hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center gap-4 mb-3">
                <Icon className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-200">{persona.name}</h3>
              </div>
              <p className="text-sm text-gray-400">{persona.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaSelector;
