import React from 'react';
import type { GroundingChunk } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface SourcesProps {
  sources: GroundingChunk[];
}

export const Sources: React.FC<SourcesProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
        <LinkIcon className="w-5 h-5 mr-2" />
        Sources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map((source, index) => {
          const sourceData = source.web;
          if (!sourceData) return null;

          return (
            <a
              key={index}
              href={sourceData.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-purple-500 transition-all duration-200"
            >
              <p className="text-sm font-medium text-purple-400 truncate">{sourceData.title}</p>
              <p className="text-xs text-gray-500 truncate mt-1">{sourceData.uri}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
};
