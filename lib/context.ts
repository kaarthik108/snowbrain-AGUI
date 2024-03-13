import { getEmbeddings } from "./openai";
import { supabase } from "./supabase";

export async function getMatchesFromEmbeddings(embeddings: number[]) {
  try {
    const result = await supabase
      .rpc("v_match_documents", {
        query_embedding: embeddings,
      })
      .select("content, similarity")
      .limit(5);
    return result;
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string): Promise<string | null> {
  const queryEmbeddings = await getEmbeddings(query);
  const matchesResponse = await getMatchesFromEmbeddings(queryEmbeddings);
  console.log("matchesResponse:", matchesResponse);
  if (matchesResponse.data && Array.isArray(matchesResponse.data)) {
    const highScoreMatches = matchesResponse.data.filter(
      (match) => match.similarity > 0.7,
    );
    const contextMessage =
      highScoreMatches.length > 0
        ? "\n" +
          highScoreMatches.map((match) => `- ${match.content}`).join("\n")
        : "";
    return contextMessage;
  } else {
    return null;
  }
}
