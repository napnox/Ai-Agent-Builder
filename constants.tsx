
import React from 'react';
import { Filters, Workflow } from './types';

export const FILTER_OPTIONS: { [key in keyof Filters]: string[] } = {
  platform: ['Any', 'n8n', 'Zapier', 'Make', 'Custom Code'],
  automationType: [
    'Any', 
    'Social Media', 
    'Marketing', 
    'E-commerce', 
    'Productivity', 
    'Data Sync', 
    'Developer Tools', 
    'CRM', 
    'Email',
    'Customer Support',
    'Lead Generation',
    'Content Creation',
    'File Management',
    'Finance & Accounting',
    'HR & Onboarding',
    'Project Management',
    'Misc'
  ],
  tools: [
    'Instagram', 
    'Google Sheets', 
    'Notion', 
    'Gmail', 
    'Twitter/X', 
    'LinkedIn', 
    'Shopify', 
    'Mailchimp', 
    'YouTube', 
    'Slack', 
    'Discord', 
    'Airtable', 
    'Trello',
    'Salesforce',
    'HubSpot',
    'Stripe',
    'QuickBooks',
    'Asana',
    'Jira',
    'GitHub',
    'Google Drive',
    'Dropbox',
    'Zoom',
    'Microsoft Teams',
    'Calendly',
    'Typeform',
    'Webflow',
    'OpenAI',
    'Google Gemini',
    'Anthropic',
    'Midjourney',
    'Canva',
    'Figma'
  ],
};

export const EXAMPLE_PROMPTS = [
  "Automate my social media by posting new blog articles to Twitter/X and LinkedIn.",
  "Create a workflow to sync new Shopify customers to a Mailchimp audience.",
  "Generate a lead magnet summary from a YouTube video URL and email it to new subscribers.",
  "Build an agent that scrapes tech news daily and sends a summary to a Slack channel.",
];

export const SAMPLE_WORKFLOWS: Workflow[] = [
  {
    id: 'sample-1',
    title: 'Automated Blog Post Announcer',
    description: 'When a new article is published on your blog\'s RSS feed, this workflow automatically creates a summary and posts it to your Twitter/X and LinkedIn accounts.',
    purpose: 'To automate social media promotion for new content and increase its reach.',
    best_for: 'Content creators, bloggers, and marketers looking to save time on social media management.',
    key_features: [
      'Monitors any RSS feed for new entries.',
      'Connects to both Twitter/X and LinkedIn.',
      'Customizable post templates.',
      'Runs automatically in the background.',
    ],
    tags: ['Social Media', 'Content', 'RSS', 'Twitter', 'LinkedIn'],
    runner: 'n8n',
    json_workflow: {
      "nodes": [
        { "parameters": { "url": "https://your-blog.com/rss" }, "name": "Read RSS Feed", "type": "n8n-nodes-base.rssFeedRead", "position": [450, 300] },
        { "parameters": { "text": "New Blog Post: {{ $json.title }} - {{ $json.link }}" }, "name": "Post to Twitter", "type": "n8n-nodes-base.twitter", "position": [650, 200] },
        { "parameters": { "message": "Check out our latest article: {{ $json.title }}\\n\\n{{ $json.link }}" }, "name": "Post to LinkedIn", "type": "n8n-nodes-base.linkedIn", "position": [650, 400] }
      ],
      "connections": {
        "Read RSS Feed": { "main": [ [ { "node": "Post to Twitter", "type": "main" } ], [ { "node": "Post to LinkedIn", "type": "main" } ] ] }
      }
    },
    implementation_steps: [
      'In the "Read RSS Feed" node, replace `https://your-blog.com/rss` with your actual blog\'s RSS feed URL.',
      'Connect your Twitter/X and LinkedIn accounts in their respective nodes.',
      'Customize the message templates to match your brand\'s voice.',
      'Activate the workflow.'
    ],
    ai_generated: false,
  },
    {
    id: 'sample-2',
    title: 'Sync Shopify Customers to Mailchimp',
    description: 'This workflow automatically adds new customers from your Shopify store to a specific Mailchimp audience, helping you to grow your mailing list effortlessly.',
    purpose: 'To maintain a synchronized mailing list of customers for marketing campaigns.',
    best_for: 'E-commerce store owners using Shopify and Mailchimp for their marketing.',
    key_features: [
      'Real-time customer data synchronization.',
      'Assigns tags to new subscribers for segmentation.',
      'Reduces manual data entry and errors.',
    ],
    tags: ['E-commerce', 'Marketing', 'Shopify', 'Mailchimp'],
    runner: 'Zapier',
    json_workflow: {
      "name": "Shopify New Customer to Mailchimp",
      "trigger": {
        "app": "Shopify",
        "event": "New Customer"
      },
      "action": {
        "app": "Mailchimp",
        "event": "Add/Update Subscriber",
        "config": {
          "audience": "YOUR_AUDIENCE_ID",
          "email": "{{ trigger.email }}",
          "merge_fields": {
            "FNAME": "{{ trigger.first_name }}",
            "LNAME": "{{ trigger.last_name }}"
          }
        }
      }
    },
    implementation_steps: [
        'Connect your Shopify account to Zapier and authorize access.',
        'Connect your Mailchimp account.',
        'In the "Action" step, select your target Mailchimp audience ID.',
        'Map any additional fields you want to sync from Shopify to Mailchimp.',
        'Turn on the Zap.'
    ],
    ai_generated: false,
  }
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
  save: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
  ),
  login: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
  ),
};
