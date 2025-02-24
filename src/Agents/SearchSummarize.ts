import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const prompt = `Create a search summary for the given search results:`;


export async function summarizeSearchResults(searchResults: any): Promise<string> {
    const { text } = await generateText({
        model: google("gemini-2.0-flash-exp"),
        prompt: prompt + JSON.stringify(searchResults["results"]),
    });

    return text;
}

export async function summarizePage(page: any): Promise<string> {
    const { text } = await generateText({
        model: google("gemini-2.0-flash-exp"),
        prompt: "Structure and minimize the given content: " + JSON.stringify(page),
    });

    return text;
}