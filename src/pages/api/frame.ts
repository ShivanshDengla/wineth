import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow both GET and POST requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return frame metadata
  res.status(200).json({
    frames: {
      version: 'vNext',
      image: 'https://winwin-git-frames-shivansh-denglas-projects.vercel.app/images/embed.png',
      buttons: [
        {
          label: 'Open App',
          action: 'post_redirect'
        }
      ],
      postUrl: 'https://winwin-git-frames-shivansh-denglas-projects.vercel.app/frame'
    }
  });
} 