import { GoogleGenAI, Type } from "@google/genai";
import { Workflow, Filters } from '../types';

export const generateWorkflow = async (userInput: string, filters: Filters): Promise<Workflow | null> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("Configuration Error: API Key not found. Please set the API_KEY environment variable.");
  }
  if (!userInput.trim()) {
    return null;
  }

  const ai = new GoogleGenAI({apiKey: apiKey});

  const filtersDescription = Object.entries(filters)
    .filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value !== 'Any';
    })
    .map(([key, value]) => {
        const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        if (Array.isArray(value)) {
          return ` - ${readableKey}: ${value.join(', ')}`;
        }
        return ` - ${readableKey}: ${value}`;
    })
    .join('\n');

  const prompt = `
You are a world-class AI Agent specializing in creating production-ready automation workflows for platforms like n8n, Zapier, Make.com, or custom code solutions. Your primary goal is to generate a single, highly specific, custom, and fully functional workflow based on the user's request, NOT a generic template.

**User's Goal:**
"${userInput}"

**Constraints and Preferences:**
${filtersDescription || 'None specified. You have the freedom to choose the best approach.'}

**CRITICAL INSTRUCTIONS:**
1.  **Deep Analysis:** Meticulously analyze the user's goal. Infer intent and fill in logical gaps to create a complete, end-to-end solution.
2.  **No Templates:** The generated workflow must be tailored specifically to the user's request. Avoid generic placeholders. If a user-specific value is required (like a channel ID or API key), use a realistic-looking example (e.g., \`"channel": "#general"\` or \`"sheet_id": "1a2b3c-eFGHIjklmnOPqrst_uvwx_yz"\`) and explicitly state in the implementation steps how the user can find and replace this example value.
3.  **Runner Selection:** If a preferred runner is not specified, select the best platform for the job. Your runner choice must be one of 'n8n', 'Zapier', 'Make', or 'Custom Code'.
4.  **Valid & Complete JSON:** The 'json_workflow_string' field MUST contain a stringified, complete, valid, and runnable JSON configuration for the selected runner. Double-check for syntax errors. This is the most important part of your task.
5.  **Actionable Content:** Provide a clear 'purpose', define who the workflow is 'best_for', and list 3-5 compelling 'key_features'. The 'implementation_steps' must be a clear, concise, and easy-to-follow guide for a non-technical user to get the workflow running.
6.  **Schema Adherence:** Your entire output must be a JSON array containing EXACTLY ONE workflow object that strictly conforms to the provided schema.
`;

  // We ask for the workflow JSON as a string to avoid schema complexity for the nested, dynamic JSON.
  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
          id: { type: Type.STRING, description: "A unique identifier, e.g., 'ai-generated-123'." },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          purpose: { type: Type.STRING, description: "A concise sentence explaining what this workflow achieves." },
          best_for: { type: Type.STRING, description: "A brief description of the ideal user or scenario for this workflow." },
          key_features: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 3-5 key benefits or features." },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          runner: { type: Type.STRING, description: "One of: 'n8n', 'Zapier', 'Make', 'Custom Code'." },
          json_workflow_string: {
              type: Type.STRING,
              description: "A string containing the valid JSON workflow definition. The structure depends on the 'runner' field."
          },
          implementation_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          ai_generated: { type: Type.BOOLEAN, description: "Always set to true." }
      },
      required: ['id', 'title', 'description', 'purpose', 'best_for', 'key_features', 'tags', 'runner', 'json_workflow_string', 'implementation_steps', 'ai_generated']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const resultsFromAI = JSON.parse(response.text);

    if (Array.isArray(resultsFromAI) && resultsFromAI.length > 0) {
      const item = resultsFromAI[0];
      try {
        const json_workflow = JSON.parse(item.json_workflow_string);
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          purpose: item.purpose,
          best_for: item.best_for,
          key_features: item.key_features,
          tags: item.tags,
          runner: item.runner,
          json_workflow: json_workflow,
          implementation_steps: item.implementation_steps,
          ai_generated: item.ai_generated,
        };
      } catch (e) {
        console.error("Failed to parse json_workflow_string from AI response:", item.json_workflow_string, e);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating workflows with Gemini:", error);
    throw new Error('Failed to generate workflow from AI. Please check your prompt or try again.');
  }
};
