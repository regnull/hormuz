/**
 * Detailed logging utility that writes to both console and file
 */

import { writeFile, appendFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const LOG_DIR = join(process.cwd(), 'logs');
const LOG_FILE = join(LOG_DIR, `game-${new Date().toISOString().split('T')[0]}.log`);

let isInitialized = false;

async function ensureLogDir() {
  if (!isInitialized) {
    if (!existsSync(LOG_DIR)) {
      await mkdir(LOG_DIR, { recursive: true });
    }
    isInitialized = true;
  }
}

function formatLogEntry(level: string, category: string, message: string, data?: any): string {
  const timestamp = new Date().toISOString();
  const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
  return `[${timestamp}] [${level}] [${category}] ${message}${dataStr}\n`;
}

/**
 * Log to both console and file
 */
export async function log(category: string, message: string, data?: any) {
  const entry = formatLogEntry('INFO', category, message, data);

  // Console
  console.log(`[${category}] ${message}`, data || '');

  // File (server-side only)
  if (typeof window === 'undefined') {
    try {
      await ensureLogDir();
      await appendFile(LOG_FILE, entry);
    } catch (error) {
      console.error('[Logger] Failed to write to file:', error);
    }
  }
}

/**
 * Log error to both console and file
 */
export async function logError(category: string, message: string, error?: any) {
  const entry = formatLogEntry('ERROR', category, message, error);

  // Console
  console.error(`[${category}] ❌ ${message}`, error || '');

  // File (server-side only)
  if (typeof window === 'undefined') {
    try {
      await ensureLogDir();
      await appendFile(LOG_FILE, entry);
    } catch (err) {
      console.error('[Logger] Failed to write error to file:', err);
    }
  }
}

/**
 * Log important events to file
 */
export async function logEvent(category: string, event: string, details?: any) {
  const entry = formatLogEntry('EVENT', category, event, details);

  // Console
  console.log(`[${category}] 🔔 ${event}`, details || '');

  // File (server-side only)
  if (typeof window === 'undefined') {
    try {
      await ensureLogDir();
      await appendFile(LOG_FILE, entry);
    } catch (error) {
      console.error('[Logger] Failed to write event to file:', error);
    }
  }
}

/**
 * Start a new log session
 */
export async function startLogSession(sessionName: string) {
  const separator = '\n' + '='.repeat(80) + '\n';
  const header = `${separator}NEW SESSION: ${sessionName}\nStarted at: ${new Date().toISOString()}${separator}\n`;

  console.log(`\n${'='.repeat(80)}\nNEW SESSION: ${sessionName}\n${'='.repeat(80)}\n`);

  if (typeof window === 'undefined') {
    try {
      await ensureLogDir();
      await appendFile(LOG_FILE, header);
    } catch (error) {
      console.error('[Logger] Failed to write session start:', error);
    }
  }
}

console.log(`[Logger] Log file: ${LOG_FILE}`);
