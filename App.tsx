
import React, { useState, useCallback, useEffect } from 'react';
import { Workflow, Filters, SingleFilterCategory } from './types';
import { FILTER_OPTIONS, EXAMPLE_PROMPTS, ICONS } from './constants';
import { generateWorkflow } from './services/workflowService';
import FilterDropdown from './components/FilterDropdown';
import WorkflowCard from './components/WorkflowCard';
import WorkflowModal from './components/WorkflowModal';
import MultiSelectDropdown from './components/MultiSelectDropdown';

const MAX_GENERATIONS = 3;

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
  
  const [napNoxUser, setNapNoxUser] = useState<{ id: string; token: string | null } | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");
    const token = params.get("token");
    if (userId) {
      const user = { id: userId, token };
      setNapNoxUser(user);
      const savedCount = parseInt(localStorage.getItem(`generationCount_${user.id}`) || '0', 10);
      setGenerationCount(savedCount);
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
    if (napNoxUser && generationCount >= MAX_GENERATIONS) {
        setError(`You have reached your limit of ${MAX_GENERATIONS} free generations.`);
        return;
    }
    setIsLoading(true);
    setError(null);
    setWorkflow(null);
    
    try {
      const result = await generateWorkflow(userInput, filters);
      setWorkflow(result);
       if (result && napNoxUser) {
        const newCount = generationCount + 1;
        setGenerationCount(newCount);
        localStorage.setItem(`generationCount_${napNoxUser.id}`, newCount.toString());
      }
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
  
  const handleSaveToNapNox = useCallback(async (workflowToSave: Workflow) => {
    if (!napNoxUser) {
      showToast("Please log in to NapNox first.");
      return;
    }

    const workflowData = {
      title: workflowToSave.title,
      short_description: workflowToSave.description,
      category: filters.automationType || workflowToSave.tags[0] || 'Uncategorized',
      tags: workflowToSave.tags.join(', '),
      tool_used: workflowToSave.runner,
      difficulty: "Easy", // Default value from instructions
      json_workflow: workflowToSave.json_workflow,
      user_id: napNoxUser.id
    };
    
    showToast("Saving to NapNox...");

    try {
      const res = await fetch("https://napnox.com/wp-json/napnox/v1/save-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData)
      });
      const result = await res.json();
      if (res.ok) {
        showToast("✅ Workflow saved successfully to NapNox!");
      } else {
        console.error("NapNox API Error:", result);
        showToast(`❌ Error: ${result.message || 'Could not save workflow.'}`);
      }
    } catch (error) {
      console.error("Network error when saving to NapNox:", error);
      showToast("⚠️ Network error, please try again later.");
    }
  }, [napNoxUser, filters.automationType]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <svg className="animate-spin h-8 w-8 text-[#2b9e91] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

  if (!napNoxUser) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600">Please log in to your account on NapNox.com to use the AI Workflow Builder.</p>
            </div>
        </div>
    )
  }

  const generationsLeft = MAX_GENERATIONS - generationCount;
  const canGenerate = generationsLeft > 0;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        
        <main className="w-full">
            
          <div className="light-card animated-border-box shadow-2xl rounded-2xl p-6 mb-16">
            <textarea
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="e.g., When a new order is created in Shopify, add a row to a Google Sheet..."
              className="w-full h-28 bg-white border border-gray-300 rounded-lg p-4 focus-custom transition resize-none text-lg placeholder-gray-500"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <FilterDropdown label="Automation Platform" category="platform" options={FILTER_OPTIONS.platform} value={filters.platform} onChange={handleSingleFilterChange} />
                <FilterDropdown label="Automation Type" category="automationType" options={FILTER_OPTIONS.automationType} value={filters.automationType} onChange={handleSingleFilterChange} />
                <MultiSelectDropdown label="Tools" options={FILTER_OPTIONS.tools} selectedOptions={filters.tools} onChange={handleToolsChange} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExample}
                        className="custom-text-link font-medium transition text-sm"
                    >
                        Try an Example
                    </button>
                    <p className="text-sm text-gray-500">
                        {canGenerate ? `${generationsLeft} generation${generationsLeft !== 1 ? 's' : ''} left` : 'No generations left'}
                    </p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !userInput || !canGenerate}
                    className="w-full sm:w-auto custom-button text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
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
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg animate-fadeIn z-50">
          {toastMessage}
        </div>
      )}

      <WorkflowModal 
        workflow={selectedWorkflow}
        onClose={() => setSelectedWorkflow(null)}
        onCopyJson={handleCopyJson}
        onDownloadJson={handleDownloadJson}
        onSaveToNapNox={handleSaveToNapNox}
        isNapNoxUser={!!napNoxUser}
      />
    </div>
  );
};

export default App;
