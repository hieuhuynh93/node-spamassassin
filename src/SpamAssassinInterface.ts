/**
 * Defines the interface for a SpamAssassin scoring service.
 */
export interface SpamAssassinInterface {
    /**
     * Calculate and return the spam score for a raw email.
     * @param rawEmail The full raw email content (headers + body).
     * @returns A Promise that resolves to the numeric spam score.
     */
    getScore(rawEmail: string): Promise<number>;
  
    /**
     * After calling getScore, retrieve the detailed report (if any).
     * @returns The detailed spam report or null if none was requested or available.
     */
    getReport(): string | null;
  }
  