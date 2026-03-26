/**
 * Central configuration for models and features
 * Change settings here to control behavior globally
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

// Image generation configuration
export const IMAGE_GENERATION_ENABLED = false; // Set to true to enable DALL-E image generation

console.log(`[Config] Model: ${MODEL_NAME}`);
console.log(`[Config] Image generation: ${IMAGE_GENERATION_ENABLED ? 'ENABLED' : 'DISABLED'}`);
