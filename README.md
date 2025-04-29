# @hieuhuynh93/node-spamassassin 📦

A lightweight TypeScript client for the Postmark SpamCheck API (SpamAssassin).  
Inspired by [riverline-spamassassin](https://github.com/rcambien/riverline-spamassassin).

## Features ✨
- Send raw email data to Postmark’s SpamCheck endpoint  
- Retrieve numeric spam score and optional detailed report  
- Written in TypeScript with full type definitions  
- ES Module-ready, works in modern Node.js and bundlers  

## Installation 🚀
```bash
npm install @hieuhuynh93/node-spamassassin
```

## Quick Start 📘
```ts
import { PostmarkWebservice } from '@hieuhuynh93/node-spamassassin';

async function checkSpam(rawEmail: string) {
  // Request detailed report (set to false for short report)
  const client = new PostmarkWebservice(true); 

  try {
    const score = await client.getScore(rawEmail);
    console.log('Spam score:', score);

    const report = client.getReport();
    if (report) {
      console.log('Detailed report:\n', report);
    }
  } catch (err: any) {
    console.error('Error fetching spam score:', err.message);
  }
}
```

## API Reference 📖

### Class: PostmarkWebservice

Constructor  
- `new PostmarkWebservice(wantLongReport = false)`  
  - `wantLongReport`: `boolean` — if `true`, requests a full SpamAssassin report; otherwise a short summary.

Methods  
- `getScore(rawEmail: string): Promise<number>`  
  Send the raw email (headers + body) to Postmark and return the spam score.  
  Throws an `Error` if the API call fails or no score is returned.

- `getReport(): string | null`  
  Retrieve the last detailed report (if `wantLongReport = true` and available). Returns `null` otherwise.
  

## Inspiration ❤️
This library was inspired by and designed to mirror the simplicity of **[riverline-spamassassin](https://github.com/rcambien/riverline-spamassassin)**, but targets the Postmark SpamCheck API and is fully typed in TypeScript.


## Contributing
This library was originally developed to meet my personal requirements. Contributions are welcome and appreciated!
Feel free to open issues, suggest enhancements, or submit pull requests.

## License 📄
MIT © Hieu Huynh