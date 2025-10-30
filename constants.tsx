
import React from 'react';
import { Filters } from './types';

export const FILTER_OPTIONS: { [key in keyof Filters]: string[] } = {
  platform: ['Any', 'n8n', 'Zapier', 'Make', 'Custom Code'],
  automationType: ['Any', 'Social Media', 'Marketing', 'E-commerce', 'Productivity', 'Data Sync', 'Developer Tools', 'CRM', 'Email', 'Misc'],
  tools: ['Instagram', 'Google Sheets', 'Notion', 'Gmail', 'Twitter/X', 'LinkedIn', 'Shopify', 'Mailchimp', 'YouTube', 'Slack', 'Discord', 'Airtable', 'Trello'],
};

export const EXAMPLE_PROMPTS = [
  "Automate my social media by posting new blog articles to Twitter/X and LinkedIn.",
  "Create a workflow to sync new Shopify customers to a Mailchimp audience.",
  "Generate a lead magnet summary from a YouTube video URL and email it to new subscribers.",
  "Build an agent that scrapes tech news daily and sends a summary to a Slack channel.",
];

export const ICONS = {
  copy: (props: React.SVGProps<SVGSVGElement>) => (
    // FIX: Corrected viewBox attribute from "0 0 24" to "0 0 24 24".
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
  ),
  download: (props: React.SVGProps<SVGSVGElement>) => (
    // FIX: Corrected malformed viewBox attribute from '0 0 24" 24"' to "0 0 24 24".
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
  ),
  sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z"></path></svg>
  ),
  chevronDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>
  ),
   check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  wand: (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 4V2m0 14v-2m-7.5-1.5L6 13m0-2l-1.5-1.5M12 6.5A5.5 5.5 0 0 0 6.5 12a5.5 5.5 0 0 0 5.5 5.5a5.5 5.5 0 0 0 5.5-5.5A5.5 5.5 0 0 0 12 6.5zm0 9.5V18m3.5-1.5l1.5 1.5M18 13l1.5 1.5m0-4L18 9m-4.5 7.5l-1 1l-1-1m1-13l-1 1l-1-1"/></svg>
  ),
  close: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
};
