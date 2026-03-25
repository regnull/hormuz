import { GameState } from '@/types/game';

/**
 * Generate a comic book style image for the current turn
 * Uses server-side API route to securely call OpenAI DALL-E
 */
export async function generateTurnImage(
  gameState: GameState,
  turnTitle: string,
  situation: string
): Promise<string | null> {
  console.log('[Image Generator] Starting image generation...');

  try {
    console.log('[Image Generator] Calling server-side API route...');

    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameState,
        turnTitle,
        situation,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Image Generator] ❌ API Error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.imageUrl;

    if (imageUrl) {
      console.log('[Image Generator] ✅ Image generated successfully!');
      console.log('[Image Generator] URL:', imageUrl.substring(0, 50) + '...');
    } else {
      console.warn('[Image Generator] ⚠️ No image URL in response');
    }

    return imageUrl;
  } catch (error) {
    console.error('[Image Generator] ❌ Error:', error);
    return null;
  }
}


/**
 * Cache generated images to localStorage to avoid regenerating
 */
export function getCachedTurnImage(turnNumber: number): string | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(`hormuz-turn-${turnNumber}-image`);
  return cached;
}

export function cacheTurnImage(turnNumber: number, imageUrl: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(`hormuz-turn-${turnNumber}-image`, imageUrl);
}

/**
 * Clear cached images (for new game)
 */
export function clearCachedImages(): void {
  if (typeof window === 'undefined') return;

  Object.keys(localStorage)
    .filter(key => key.startsWith('hormuz-turn-') && key.endsWith('-image'))
    .forEach(key => localStorage.removeItem(key));
}
