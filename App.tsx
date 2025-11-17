import React, { useState, useCallback } from 'react';
import { getAiSearchResult } from './services/geminiService';
import type { GroundingChunk } from './types';
import { SearchForm } from './components/SearchForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResponseDisplay } from './components/ResponseDisplay';
import { Sources } from './components/Sources';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ErrorDisplay } from './components/ErrorDisplay';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [mapUrl, setMapUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearResults = () => {
    setQuery('');
    setAiResponse('');
    setSources([]);
    setError(null);
    setMapUrl('');
  };

  const handleSearchSubmit = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || isLoading) return;

    setIsLoading(true);
    clearResults();
    setQuery(searchQuery);

    try {
      const result = await getAiSearchResult(searchQuery);
      setAiResponse(result.text);
      setSources(result.sources);

      if (result.route && result.route.start && result.route.end) {
        const url = `https://www.google.com/maps?saddr=${encodeURIComponent(result.route.start)}&daddr=${encodeURIComponent(result.route.end)}&output=embed`;
        setMapUrl(url);
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  const hasResult = aiResponse || sources.length > 0 || error || mapUrl;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-col items-center">
          {!hasResult && !isLoading && (
              <div className="flex items-center text-4xl md:text-5xl font-bold mb-4 text-white">
                <SparklesIcon className="h-10 w-10 md:h-12 md:w-12 mr-3 text-purple-400" />
                <h1>Gemini Search</h1>
              </div>
          )}
          
          <div className={`w-full transition-all duration-500 ${hasResult || isLoading ? 'mb-8' : ''}`}>
            <SearchForm
              initialQuery={query}
              isLoading={isLoading}
              onSubmit={handleSearchSubmit}
            />
          </div>

          <div className="w-full">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            
            {!isLoading && !hasResult && <WelcomeScreen onSampleQueryClick={handleSearchSubmit} />}

            {aiResponse && <ResponseDisplay response={aiResponse} />}
            {mapUrl && (
                <div className="mt-6 animate-fade-in w-full aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={mapUrl}>
                    </iframe>
                </div>
            )}
            {sources.length > 0 && <Sources sources={sources} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
