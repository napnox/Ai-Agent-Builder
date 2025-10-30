export interface Workflow {
  id: string;
  title: string;
  description: string;
  purpose: string;
  best_for: string;
  key_features: string[];
  tags: string[];
  runner: 'n8n' | 'Zapier' | 'Make' | 'Custom Code';
  json_workflow: object;
  implementation_steps: string[];
  ai_generated: boolean;
}

export type SingleFilterCategory = 'platform' | 'automationType';
export type FilterCategory = SingleFilterCategory | 'tools';

export interface Filters {
  platform: string;
  automationType: string;
  tools: string[];
}
