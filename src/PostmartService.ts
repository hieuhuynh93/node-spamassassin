import axios, { AxiosInstance } from 'axios';
import { SpamAssassinInterface } from './SpamAssassinInterface.js';

/**
 * Client for the Postmark SpamCheck API, implements SpamAssassinInterface.
 */
export class PostmarkWebservice implements SpamAssassinInterface {
  private static readonly WEBSERVICE_URL = 'http://spamcheck.postmarkapp.com/filter';
  private client: AxiosInstance;
  private wantLongReport: boolean;
  private report: string | null = null;

  /**
   * @param wantLongReport If true, request a detailed report; otherwise short.
   */
  constructor(wantLongReport = false) {
    this.client = axios.create({
      headers: { 'Content-Type': 'application/json' }
    });
    this.wantLongReport = wantLongReport;
  }

  /**
   * Send raw email to Postmark and return the SpamAssassin score.
   * @throws Error if the API returns an error or no score.
   */
  public async getScore(rawEmail: string): Promise<number> {
    this.report = null; // reset previous report
    try {
      const response = await this.client.post<{
        success: boolean;
        score?: number;
        report?: string;
        message?: string;
      }>(
        PostmarkWebservice.WEBSERVICE_URL,
        {
          email: rawEmail,
          options: this.wantLongReport ? 'long' : 'short'
        }
      );

      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || 'Unknown error from Postmark SpamCheck API');
      }
      if (typeof data.score !== 'number') {
        throw new Error('API did not return a score');
      }

      this.report = data.report ?? null;
      return data.score;
    } catch (err: any) {
      // Normalize error message
      throw new Error(err.message || 'Failed to fetch spam score');
    }
  }

  /**
   * Return the last detailed report, or null if none was requested/available.
   */
  public getReport(): string | null {
    return this.report;
  }
}
