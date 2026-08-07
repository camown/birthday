import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Birthday Wish Generator API route
  app.post('/api/generate-wish', async (req, res) => {
    try {
      const { name } = req.body || { name: 'Friend' };
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          wish: `✨ "May your birthday shine as radiantly as your smile, ${name}! Here is to 365 new days of unconditional laughter, sparkling victories, and unforgettable adventures!"`
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a short, heartwarming 2-sentence birthday wish and poem for ${name}. Make it uplifting, sweet, and intimate with emojis.`,
      });

      const wish = response.text || `Happy Birthday ${name}! May your day be filled with endless joy and magic!`;
      res.json({ wish });
    } catch (err) {
      console.error('Error generating AI wish:', err);
      res.json({
        wish: `✨ "May your birthday shine as radiantly as your smile! Here is to 365 new days of unconditional laughter, sparkling victories, and unforgettable adventures!"`
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Birthday Surprise server running on http://localhost:${PORT}`);
  });
}

startServer();
