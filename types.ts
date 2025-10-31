
// Fix: Import React to resolve the 'React' namespace for ComponentType.
import React from 'react';

export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  content: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  personaId: string;
}
