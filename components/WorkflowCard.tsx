import React from 'react';
import { Workflow } from '../types';
import { ICONS } from '../constants';

interface WorkflowCardProps {
  workflow: Workflow;
  onViewDetails: (workflow: Workflow) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onViewDetails }) => {
  return (
    <div className="light-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fadeIn">
      <div>
        {workflow.ai_generated && (
          <div className="flex items-center text-xs font-medium text-indigo-600 mb-2">
            <ICONS.sparkles className="w-4 h-4 mr-1.5" />
            <span>AI-Generated</span>
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{workflow.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{workflow.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">{workflow.runner}</span>
          {workflow.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => onViewDetails(workflow)}
          className="w-full text-center bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm shadow-sm"
        >
          View Workflow
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard;