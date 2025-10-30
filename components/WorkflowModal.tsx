import React, { useState, useEffect, useCallback } from 'react';
import { Workflow } from '../types';
import { ICONS } from '../constants';

interface WorkflowModalProps {
  workflow: Workflow | null;
  onClose: () => void;
  onCopyJson: (json: object) => void;
  onDownloadJson: (workflow: Workflow) => void;
}

const WorkflowModal: React.FC<WorkflowModalProps> = ({ workflow, onClose, onCopyJson, onDownloadJson }) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (workflow) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [workflow, handleKeyDown]);

  if (!workflow) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{workflow.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">{workflow.runner}</span>
              {workflow.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 -mt-1 -mr-1">
            <ICONS.close className="w-6 h-6" />
          </button>
        </header>
        
        <main className="overflow-y-auto p-6 space-y-6 text-gray-700">
            <p className="text-gray-600">{workflow.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Purpose</h4>
                <p className="text-sm">{workflow.purpose}</p>
              </div>
               <div>
                <h4 className="font-semibold text-gray-800 mb-1">Best For</h4>
                <p className="text-sm">{workflow.best_for}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Key Features</h4>
              <ul className="space-y-2">
                {workflow.key_features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                        <ICONS.check className="w-4 h-4 mr-2 mt-0.5 text-indigo-500 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
              </ul>
            </div>

            <CollapsibleSection title="Implementation Guide">
              <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600 text-sm">
                {workflow.implementation_steps.map((step, index) => <li key={index} dangerouslySetInnerHTML={{ __html: step.replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-gray-800 font-mono rounded px-1 py-0.5 text-xs">\$1</code>') }}></li>)}
              </ol>
            </CollapsibleSection>

            <CollapsibleSection title="Workflow JSON">
               <div className="bg-gray-50 rounded-lg mt-2 relative border border-gray-200">
                  <pre className="text-xs p-4 text-gray-800 overflow-x-auto max-h-60">
                    <code>{JSON.stringify(workflow.json_workflow, null, 2)}</code>
                  </pre>
               </div>
            </CollapsibleSection>
        </main>
        
        <footer className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={() => onCopyJson(workflow.json_workflow)}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <ICONS.copy className="w-4 h-4"/> Copy JSON
          </button>
          <button
            onClick={() => onDownloadJson(workflow)}
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <ICONS.download className="w-4 h-4"/> Download JSON
          </button>
        </footer>
      </div>
    </div>
  );
};


interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="font-semibold text-lg text-gray-800 w-full text-left flex justify-between items-center"
                aria-expanded={isOpen}
            >
                {title}
                <ICONS.chevronDown className={`w-5 h-5 transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
}

export default WorkflowModal;