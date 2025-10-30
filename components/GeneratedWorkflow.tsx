import React, { useState } from 'react';
import { Workflow } from '../types';
import { ICONS } from '../constants';

interface GeneratedWorkflowProps {
  workflow: Workflow;
  onCopyJson: (json: object) => void;
  onDownloadJson: (workflow: Workflow) => void;
}

const GeneratedWorkflow: React.FC<GeneratedWorkflowProps> = ({ workflow, onCopyJson, onDownloadJson }) => {
  const [isStepsOpen, setIsStepsOpen] = useState(true);
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  return (
    <div className="glass-card rounded-2xl shadow-2xl shadow-black/20 overflow-hidden animate-fadeIn">
      <header className="p-6">
        <div className="flex items-center text-xs font-medium text-indigo-400 mb-2">
            <ICONS.sparkles className="w-4 h-4 mr-2" />
            <span>AI-Generated Workflow</span>
        </div>
        <h2 className="text-2xl font-bold text-white">{workflow.title}</h2>
        <p className="text-gray-300 mt-2">{workflow.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {workflow.tags.map(tag => (
            <span key={tag} className="bg-gray-700/50 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
          ))}
           <span className="bg-purple-900/50 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase">{workflow.runner}</span>
        </div>
      </header>
      
      <main className="px-6 pb-6 space-y-4">
        <CollapsibleSection title="Implementation Steps" isOpen={isStepsOpen} setIsOpen={setIsStepsOpen}>
            <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-300 text-sm">
                {workflow.implementation_steps.map((step, index) => <li key={index} dangerouslySetInnerHTML={{ __html: step.replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-indigo-300 rounded px-1 py-0.5 text-xs">\$1</code>') }}></li>)}
            </ol>
        </CollapsibleSection>

        <CollapsibleSection title="Workflow JSON" isOpen={isJsonOpen} setIsOpen={setIsJsonOpen}>
            <div className="bg-gray-900/70 rounded-lg mt-2 relative">
                <pre className="text-xs p-4 text-gray-200 overflow-x-auto max-h-80">
                    <code>{JSON.stringify(workflow.json_workflow, null, 2)}</code>
                </pre>
            </div>
        </CollapsibleSection>
      </main>
      
      <footer className="flex items-center justify-end gap-3 p-4 bg-black/20 border-t border-white/10">
        <button
          onClick={() => onCopyJson(workflow.json_workflow)}
          className="flex items-center gap-2 bg-gray-700/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600/80 transition-colors text-sm"
        >
          <ICONS.copy className="w-4 h-4"/> Copy JSON
        </button>
        <button
          onClick={() => onDownloadJson(workflow)}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors text-sm"
        >
          <ICONS.download className="w-4 h-4"/> Download JSON
        </button>
      </footer>
    </div>
  );
};

interface CollapsibleSectionProps {
    title: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isOpen, setIsOpen, children }) => {
    return (
        <div className="border border-white/10 rounded-lg overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="font-semibold text-base text-white w-full text-left p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
                aria-expanded={isOpen}
            >
                {title}
                <ICONS.chevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 border-t border-white/10">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default GeneratedWorkflow;
