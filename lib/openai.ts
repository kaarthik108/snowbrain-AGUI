// import { Configuration, OpenAIApi } from "openai-edge";

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY as string,
//   basePath: `https://gateway.ai.cloudflare.com/v1/${process.env.ACCOUNT_TAG}/k-1-gpt/openai`,
// });
// const openai = new OpenAIApi(config);

import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}
const openai = new OpenAI({
  apiKey,
  // baseURL: `https://gateway.ai.cloudflare.com/v1/${process.env.ACCOUNT_TAG}/k-1-gpt/openai`,
});

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = response.data[0].embedding as number[];
    return result;
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}
