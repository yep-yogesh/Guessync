import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export const getAIHint = async (songName) => {
  try {
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-flash",
      temperature: 0.7,
    });

    const promptTemplate = PromptTemplate.fromTemplate(
      `Give me a fun, short, and helpful hint for the song '{songName}'.
Avoid mentioning the title or giving it away directly. The hint should make it much easier to guess`
    );

    const formattedPrompt = await promptTemplate.format({ songName: songName });
    const result = await model.invoke(formattedPrompt);

    const hint = result.content;

    return hint.trim();
  } catch (err) {
    console.error("Error generating AI hint:", err.message);
    return "Couldn't fetch a hint right now. Try again later.";
  }
};