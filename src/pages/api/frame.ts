import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return frame metadata
  res.status(200).json({
    frames: {
      version: 'vNext',
      image: 'https://wineth.org/images/embed.png',
      buttons: [
        {
          label: 'Open App',
          action: 'post_redirect'
        }
      ],
      postUrl: 'https://wineth.org/frame'
    }
  });
} 