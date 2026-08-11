import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const provider = () => process.env.AI_PROVIDER || "gemini";

let _chatModel = null;
let _embeddingsModel = null;

export const getChatModel = () => {
  if (_chatModel) return _chatModel;
  if (provider() === "openai") {
    _chatModel = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0.3,
    });
  } else {
    _chatModel = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.3,
    });
  }
  return _chatModel;
};

export const getEmbeddingsModel = () => {
  if (_embeddingsModel) return _embeddingsModel;
  if (provider() === "openai") {
    _embeddingsModel = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-small",
    });
  } else {
    _embeddingsModel = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-embedding-001",
    });
  }
  return _embeddingsModel;
};
