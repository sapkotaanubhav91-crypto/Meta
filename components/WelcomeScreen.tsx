import React from 'react';

interface WelcomeScreenProps {
  onSampleQueryClick: (query: string) => void;
}

const sampleQueries = [
  "What were the key highlights of the latest UN climate change conference?",
  "Explain the basics of quantum computing in simple terms.",
  "Get me directions from the Eiffel Tower to the Louvre Museum.",
  "Who won the most recent FIFA World Cup and what was the final score?"
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSampleQueryClick }) => {
  return (
    <div className="text-center mt-8 animate-fade-in">
        <p className="text-gray-400 mb-6">Get started by asking a question or try one of these examples:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleQueries.map((query, index) => (
                <button
                    key={index}
                    onClick={() => onSampleQueryClick(query)}
                    className="p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700/60 transition-colors duration-200 border border-gray-700 hover:border-purple-500"
                >
                    <p className="text-gray-300">{query}</p>
                </button>
            ))}
        </div>
    </div>
  );
};
