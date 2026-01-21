
import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

export const geminiService = {
  analyzeWorkload: async (tasks: Task[]) => {
    try {
      // Fix: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
      // Fix: Always use named parameter { apiKey: process.env.API_KEY }.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const taskSummary = tasks.map(t => `- ${t.title} (${t.status}, ${t.timeSpentMinutes} mins, Priority: ${t.priority})`).join('\n');
      
      const prompt = `
        You are Werkaholic AI, a productivity expert. 
        Analyze the following tasks and give me:
        1. A summary of current workload.
        2. Top 3 time wasters or focus areas.
        3. Actionable advice to improve efficiency.
        
        Tasks:
        ${taskSummary}
        
        Please reply in German as this is a German productivity app.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Fix: Access the .text property directly (not a method).
      return response.text;
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return "Entschuldigung, ich konnte die Analyse gerade nicht durchführen. Bitte überprüfe deinen API-Schlüssel.";
    }
  }
};
