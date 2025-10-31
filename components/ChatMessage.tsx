import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';
import CodeBlock from './CodeBlock';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content } = message;
  const isUser = role === 'user';

  return (
    <div className={`flex gap-4 p-4 ${isUser ? '' : 'bg-gray-800/50'}`}>
      <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-gray-700">
        {isUser ? <UserIcon className="w-5 h-5" /> : <BotIcon className="w-5 h-5 text-blue-400" />}
      </div>
      <div className="flex-grow pt-1.5 prose prose-sm prose-invert max-w-none 
          prose-p:my-2 
          prose-headings:my-3 
          prose-a:text-blue-400 hover:prose-a:text-blue-300 
          prose-code:before:content-[''] prose-code:after:content-[''] 
          prose-hr:border-gray-700 
          prose-blockquote:border-l-blue-400 
          prose-table:w-full prose-table:border-collapse 
          prose-th:border-b prose-th:border-gray-600 prose-th:p-2 prose-th:text-left prose-th:font-semibold 
          prose-td:border-b prose-td:border-gray-700 prose-td:p-2"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <CodeBlock className={className}>{String(children).replace(/\n$/, '')}</CodeBlock>
              ) : (
                <code className="bg-gray-700 text-blue-300 rounded px-1.5 py-1 text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
