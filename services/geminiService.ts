import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are Gemini, a large language model trained by Google.
Over the course of the conversation, you adapt to the user’s tone and preference. Try to match the user’s vibe, tone, and generally how they are speaking. Your goal is to have a natural conversation and provide helpful, accurate answers.

- For general questions, provide a clear and concise answer in Markdown.
- If the user asks for directions, you MUST provide step-by-step directions.
- When you provide directions, you MUST identify the start and end locations. You must then embed this information in a special HTML comment at the VERY END of your response, like this: <!-- ROUTE: {"start": "START_LOCATION", "end": "END_LOCATION"} -->.
- For example: if the user asks for directions from LAX to Santa Monica Pier, your entire response should be the directions in Markdown, followed by: <!-- ROUTE: {"start": "LAX", "end": "Santa Monica Pier"} -->
- If you cannot determine a clear start or end location from the query, do not include the ROUTE comment.`;


export const getAiSearchResult = async (query: string) => {
    const modelName = 'gemini-2.5-flash';
    const config = {
        systemInstruction,
        tools: [{ googleSearch: {} }],
    };

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: query,
            config: config,
        });

        const responseText = response.text;
        let text = responseText;
        let route = null;

        const routeRegex = /<!-- ROUTE: (.*) -->/s;
        const match = responseText.match(routeRegex);
        
        if (match && match[1]) {
            try {
                // Remove the route comment from the displayed text
                text = responseText.replace(routeRegex, '').trim();
                const routeJson = JSON.parse(match[1]);
                if (routeJson.start && routeJson.end) {
                    route = routeJson;
                }
            } catch (e) {
                console.error("Failed to parse route JSON from comment:", match[1]);
                // Fail silently if parsing fails; the route will just not be displayed.
            }
        }
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        const sources = groundingChunks.filter(
            (chunk: any): chunk is GroundingChunk =>
                (chunk?.web?.uri && chunk?.web?.title)
        );

        return { text, sources, route };
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get a response from the AI. Please try again.");
    }
};