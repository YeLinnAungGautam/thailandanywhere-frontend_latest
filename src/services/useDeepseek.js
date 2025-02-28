// 1. Optimized useDeepseek.js with performance improvements
import { ref, computed } from "vue";
import { OpenAI } from "openai";

export function useDeepseek(apiKey) {
  const client = ref(null);
  const isInitialized = ref(false);
  const error = ref(null);
  const balanceError = ref(false);
  const pendingResponse = ref("");
  const isStreaming = ref(false);
  const streamBuffer = ref("");

  // Initialize the DeepSeek client
  const initialize = () => {
    try {
      client.value = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: apiKey, // Using the passed parameter
        dangerouslyAllowBrowser: true,
      });
      isInitialized.value = true;
      error.value = null;
      balanceError.value = false;
    } catch (err) {
      error.value = err.message;
      isInitialized.value = false;
    }
  };

  // Get chat completion from DeepSeek with streaming
  const getChatCompletion = async (messages, model = "deepseek-chat") => {
    if (!isInitialized.value) {
      throw new Error(
        "DeepSeek client not initialized. Call initialize() first."
      );
    }

    // Reset streaming state
    isStreaming.value = true;
    streamBuffer.value = "";
    pendingResponse.value = "";

    try {
      // Use streaming for faster perceived response
      const stream = await client.value.chat.completions.create({
        messages,
        model,
        stream: true,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          streamBuffer.value = fullResponse;
          pendingResponse.value = fullResponse;
        }
      }

      // Reset any previous errors on successful call
      error.value = null;
      balanceError.value = false;
      isStreaming.value = false;

      return fullResponse;
    } catch (err) {
      console.error("API Error:", err);
      isStreaming.value = false;

      // Check if it's a balance error
      if (err.status === 402) {
        balanceError.value = true;
        error.value =
          "Your DeepSeek account has insufficient balance. Please top up your account or use a different API key.";
      } else {
        error.value = `Error ${err.status || ""}: ${err.message}`;
      }

      throw err;
    }
  };

  // Provide smaller message payload by trimming conversation history
  const getOptimizedMessages = (messages, maxMessages = 10) => {
    // Keep system message and last N messages for context
    const systemMessages = messages.filter((msg) => msg.role === "system");
    const nonSystemMessages = messages.filter((msg) => msg.role !== "system");

    // Get the most recent messages
    const recentMessages = nonSystemMessages.slice(-maxMessages);

    // Combine system messages with recent messages
    return [...systemMessages, ...recentMessages];
  };

  return {
    initialize,
    getChatCompletion,
    getOptimizedMessages,
    isInitialized,
    error,
    balanceError,
    pendingResponse,
    isStreaming,
    streamBuffer,
  };
}
