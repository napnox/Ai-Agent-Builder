import React, { useState, useCallback, useEffect } from 'react';
import { Workflow, Filters, SingleFilterCategory } from './types';
import { FILTER_OPTIONS, EXAMPLE_PROMPTS, ICONS } from './constants';
import { generateWorkflow } from './services/workflowService';
import FilterDropdown from './components/FilterDropdown';
import WorkflowCard from './components/WorkflowCard';
import WorkflowModal from './components/WorkflowModal';
import MultiSelectDropdown from './components/MultiSelectDropdown';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [filters, setFilters] = useState<Filters>({
    platform: '', automationType: '', tools: []
  });
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    // In a real-world scenario, process.env.API_KEY would be set during the build process.
    // Since we are in a browser-only environment, this will likely be false, so we show the warning.
    if (!process.env.API_KEY) {
      setIsApiKeyMissing(true);
    }
  }, []);


  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSingleFilterChange = (category: SingleFilterCategory, value: string) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };
  
  const handleToolsChange = (selectedTools: string[]) => {
    setFilters(prev => ({ ...prev, tools: selectedTools }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setWorkflow(null);
    
    try {
      const result = await generateWorkflow(userInput, filters);
      setWorkflow(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExample = () => {
    const randomExample = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setUserInput(randomExample);
  };

  const handleCopyJson = useCallback((json: object) => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    showToast('JSON copied to clipboard!');
  }, []);

  const handleDownloadJson = useCallback((wf: Workflow) => {
    const jsonString = JSON.stringify(wf.json_workflow, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wf.title.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('JSON download started!');
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-semibold text-lg text-gray-800">Generating your AI workflow...</p>
            <p className="text-sm">The agent is thinking. This might take a moment.</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-600 p-8 bg-red-50 rounded-lg">{error}</p>;
    }
    if (workflow) {
      return (
        <WorkflowCard 
            workflow={workflow}
            onViewDetails={() => setSelectedWorkflow(workflow)}
        />
      );
    }
    return (
      <div className="text-center p-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-2xl">
        <ICONS.sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-800">Your AI Agent is ready</h3>
        <p>Describe your goal, and your generated workflow will appear here.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        
        <main className="w-full">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                    AI Agent Workflow Builder
                </h1>
                <p className="text-lg text-gray-600">Describe what you want to automate, and let AI build it for you.</p>
            </div>

          <div className="light-card rounded-2xl p-6 mb-8">
             {isApiKeyMissing && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
                  <p className="font-bold">Configuration Required</p>
                  <p>The Gemini API key is missing. To enable workflow generation, please set it up as an environment variable (e.g., in your Vercel project settings).</p>
                </div>
              )}
            <textarea
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="e.g., When a new order is created in Shopify, add a row to a Google Sheet..."
              className="w-full h-24 bg-gray-50 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none text-base placeholder-gray-500"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <FilterDropdown label="Automation Platform" category="platform" options={FILTER_OPTIONS.platform} value={filters.platform} onChange={handleSingleFilterChange} />
                <FilterDropdown label="Automation Type" category="automationType" options={FILTER_OPTIONS.automationType} value={filters.automationType} onChange={handleSingleFilterChange} />
                <MultiSelectDropdown label="Tools" options={FILTER_OPTIONS.tools} selectedOptions={filters.tools} onChange={handleToolsChange} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <button
                    onClick={handleExample}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition text-sm"
                >
                    Try an Example
                </button>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !userInput || isApiKeyMissing}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                    <ICONS.wand className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Generate Workflow'}
                </button>
            </div>
          </div>

          <div className="min-h-[200px] w-full">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg animate-fadeIn">
          {toastMessage}
        </div>
      )}

      <WorkflowModal 
        workflow={selectedWorkflow}
        onClose={() => setSelectedWorkflow(null)}
        onCopyJson={handleCopyJson}
        onDownloadJson={handleDownloadJson}
      />
    </div>
  );
};

export default App;