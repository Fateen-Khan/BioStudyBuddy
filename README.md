# BioBridge AI

BioBridge AI is an AI-powered study platform for biotechnology students. It combines an AI study assistant, note summarizer, quiz generator, flashcard generator, and research paper simplifier into a single modern web app.

## Features
- Landing page with hero, features, testimonials, FAQ, and contact
- Dashboard for key study tools
- AI study assistant with follow-up-style question support
- Note summarization
- Quiz generation
- Flashcard generation
- Research paper simplification
- Responsive layout and polished UI

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- AI: OpenAI API

## Installation
1. Install dependencies: `npm install`
2. Create a `.env` file with:
   - `PORT=3000`
   - `OPENAI_API_KEY=your_openai_api_key`
3. Start the app: `npm start`

## Development
- Run locally with `npm run dev`

## Project Structure
- `public/` - Frontend assets and single-page app
- `server.js` - Express server and API routes

## Notes
- The app uses a fallback local response system when the OpenAI API key is not configured.
