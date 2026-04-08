/**
 * Simple keyword-based frustration detector.
 * Returns true if the user's message indicates frustration or confusion.
 */

const FRUSTRATION_PATTERNS = [
  // Direct frustration
  /\b(doesn'?t|does not|don'?t|do not)\s+(work|load|show|open|respond)/i,
  /\b(broken|bugged|buggy|glitch|crash)/i,
  /\b(can'?t|cannot|unable)\s+(find|see|access|open|use|get|load)/i,
  /\b(not\s+working|not\s+loading|not\s+showing|not\s+responding)/i,
  /\b(nothing\s+happens|nothing\s+works)/i,
  // Confusion
  /\b(confused|confusing|makes?\s+no\s+sense|i\s+don'?t\s+understand)/i,
  /\bwhat\s+is\s+(wrong|happening|going\s+on)/i,
  /\bhelp\s+me\b/i,
  // Anger / impatience
  /\b(useless|terrible|awful|horrible|worst|stupid|dumb|waste)/i,
  /\b(frustrated|annoyed|angry|pissed|sick\s+of)/i,
  /\b(ugh|omg|wtf|ffs|smh)\b/i,
  // Repeated attempts
  /\b(again|already\s+tried|tried\s+everything|still\s+not)/i,
]

export function detectFrustration(message: string): boolean {
  if (!message || message.length < 5) return false
  return FRUSTRATION_PATTERNS.some((pattern) => pattern.test(message))
}
