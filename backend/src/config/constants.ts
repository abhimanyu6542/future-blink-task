export const PORT = process.env.PORT || 5000;
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

export const FREE_MODELS = [
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-4b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
];

export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
