import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const language = className?.replace(/language-/, '') || 'text';

  const handleCopy = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gray-900 rounded-lg my-4 overflow-hidden border border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-700 text-gray-400 text-xs">
        <span>{language}</span>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs hover:text-gray-200 transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <ClipboardIcon className="w-4 h-4" />
                <span>Copy code</span>
              </>
            )}
          </button>
          <button
            onClick={toggleExpand}
            className="hover:text-gray-200 transition-colors"
            aria-label={isExpanded ? 'Collapse code block' : 'Expand code block'}
          >
            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <pre className="p-4 overflow-x-auto text-sm">
            <code className={`hljs ${className}`}>{children}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
