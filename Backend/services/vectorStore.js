import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ROLE_KNOWLEDGE_DOCS } from "./knowledgeBase.js";
import { getEmbeddingsModel } from "./modelProvider.js";

let vectorStorePromise = null;

/**
 * Builds (once, lazily) an in-memory vector store from the role knowledge base.
 * Swap MemoryVectorStore for a Chroma/Pinecone client in production - the
 * retrieval interface (similaritySearch) stays the same, so the rest of the
 * app doesn't need to change.
 */
const buildVectorStore = async () => {
  try {
    const embeddings = getEmbeddingsModel();
    const docs = ROLE_KNOWLEDGE_DOCS.map(
      (d) => new Document({ pageContent: d.text, metadata: { role: d.role } })
    );
    return await MemoryVectorStore.fromDocuments(docs, embeddings);
  } catch (error) {
    console.error("Vector store build error:", error);
    // Return empty store if embeddings fail
    return MemoryVectorStore.fromDocuments([]);
  }
};

export const getVectorStore = () => {
  if (!vectorStorePromise) {
    vectorStorePromise = buildVectorStore();
  }
  return vectorStorePromise;
};

/**
 * Retrieves the top-k most relevant role/skill documents for the given
 * query (target role + a slice of the resume) - this is the "R" in RAG.
 */
export const retrieveRoleContext = async (query, k = 2) => {
  try {
    const store = await getVectorStore();
    const results = await store.similaritySearch(query, k);
    return results.map((r) => r.pageContent).join("\n\n");
  } catch (err) {
    console.warn("RAG retrieval skipped:", err.message);
    return "";
  }
};
