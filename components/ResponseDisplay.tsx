
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResponseDisplayProps {
  response: string;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mt-6 animate-fade-in">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline"
      >
        {response}
      </ReactMarkdown>
    </div>
  );
};
