import Anthropic from '@anthropic-ai/sdk';
import { GameState } from '@/types/game';

/**
 * Generate a comic book style image for the current turn
 * Uses OpenAI DALL-E for consistent graphic novel aesthetics
 */
export async function generateTurnImage(
  gameState: GameState,
  turnTitle: string,
  situation: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('No OPENAI_API_KEY found, skipping image generation');
    return null;
  }

  try {
    const prompt = buildImagePrompt(gameState, turnTitle, situation);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1792x1024', // Landscape for game scenes
        quality: 'standard',
        style: 'vivid',
      }),
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0]?.url || null;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}

/**
 * Build the DALL-E prompt for consistent comic book style
 */
function buildImagePrompt(
  gameState: GameState,
  turnTitle: string,
  situation: string
): string {
  const { worldState, actors } = gameState;

  // Determine scene type based on context
  let sceneDescription = '';

  if (worldState.threatLevel === 'critical' || worldState.iranEnrichmentLevel >= 95) {
    sceneDescription = 'Tense war room with military commanders around illuminated maps, red alert lights casting dramatic shadows';
  } else if (situation.toLowerCase().includes('diplomatic') || situation.toLowerCase().includes('summit')) {
    sceneDescription = 'High-stakes diplomatic meeting room with flags and serious officials across negotiating table';
  } else if (situation.toLowerCase().includes('strike') || situation.toLowerCase().includes('military')) {
    sceneDescription = 'Military command center with glowing screens showing satellite imagery of Middle East, commanders in uniform';
  } else if (actors.israel.attitude < 0 || actors.iran.attitude < -70) {
    sceneDescription = 'Dark situation room with world map projection showing Middle East in red, silhouettes of worried advisors';
  } else {
    sceneDescription = 'Presidential situation room with advisors presenting intelligence briefings, large screens showing data';
  }

  // Base style description (matching the Batman comic aesthetic)
  const stylePrompt = `
Comic book style illustration in the aesthetic of DC Comics graphic novels.
Dark, moody atmosphere with dramatic lighting and deep shadows.
Limited color palette: predominantly dark blues, slate grays, blacks, with amber/warm accent lighting.
Strong contrast and bold ink lines with crosshatching for shadows.
Cinematic composition with dramatic perspective.
Urban/government building setting with architectural details.
Serious, tense mood conveying high stakes and danger.
Professional illustration quality with clear details but stylized like a graphic novel panel.
  `.trim();

  return `${sceneDescription}. ${stylePrompt}

Scene context: ${turnTitle} - ${situation.substring(0, 200)}...

IMPORTANT:
- Graphic novel/comic book art style like Batman: The Dark Knight Returns
- Dark and moody with blue-gray-black color scheme
- Dramatic shadows and lighting
- No text or speech bubbles
- Professional illustration quality
- Convey tension and high stakes
- Geopolitical crisis atmosphere`;
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
