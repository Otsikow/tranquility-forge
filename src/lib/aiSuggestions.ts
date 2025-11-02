
import { ChatMessage } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/lib/env";

const genAI = new GoogleGenerativeAI(env.googleAiApiKey);

const suggestionPrompt = `
You are a helpful assistant for a mental wellness chat application. Your role is to provide empathetic, supportive, and relevant suggestions to the user based on the conversation history.

Analyze the last message from the user and the overall context of the conversation. Based on this, generate 3-4 short, actionable suggestions (5 words or less) that the user can click on.

These suggestions should be one of the following types:
1.  **Exploratory prompts:** Encourage the user to elaborate on their feelings or situation (e.g., "Tell me more," "How did that feel?").
2.  **Coping strategies:** Offer relevant techniques for managing their emotions (e.g., "Try a breathing exercise," "Let's reframe that thought").
3.  **Educational resources:** Suggest learning more about a topic if relevant (e.g., "Learn about CBT," "What is mindfulness?").
4.  **Goal-setting prompts:** Help the user move toward a positive outcome (e.g., "Set a small goal," "What's one thing you can do?").

**Conversation History:**
---
{{CHAT_HISTORY}}
---

**Tone:** Empathetic, non-judgmental, and encouraging.
**Format:** Return a JSON array of strings. For example: ["Suggestion 1", "Suggestion 2", "Suggestion 3"]

**Important:** Do NOT return anything other than the JSON array of suggestions.
`;

export async function getAiSuggestions(messages: ChatMessage[]): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chatHistory = messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join("\n");

    const promptWithHistory = suggestionPrompt.replace("{{CHAT_HISTORY}}", chatHistory);

    const result = await model.generateContent(promptWithHistory);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json|```/g, "").trim();

    const suggestions = JSON.parse(jsonString);
    return suggestions.slice(0, 4); // Ensure max 4 suggestions
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    // Fallback to generic suggestions
    return [
      "Tell me more about that",
      "How did that make you feel?",
      "Is there anything else on your mind?",
    ];
  }
}
