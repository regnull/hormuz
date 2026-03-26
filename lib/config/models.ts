/**
 * Central model configuration
 * Change MODEL_NAME here to switch models globally
 */

// Available models:
// - 'claude-opus-4-6' (most capable, slowest, most expensive)
// - 'claude-sonnet-4-5-20250929' (balanced)
// - 'claude-haiku-4-5-20251001' (fastest, cheapest)

export const MODEL_NAME = 'claude-haiku-4-5-20251001'; // Fast model for testing

export const MODEL_CONFIG = {
  name: MODEL_NAME,
  maxTokens: 3500,
  temperature: 0.8,
};

console.log(`[Model Config] Using model: ${MODEL_NAME}`);
