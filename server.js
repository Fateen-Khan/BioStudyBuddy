const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DEFAULT_MODEL =
process.env.GEMINI_MODEL || "gemini-3.6-flash";

const FALLBACK_MODELS = [
"gemini-3.6-flash",
"gemini-3.5-flash",
"gemini-3.5-flash-lite",
"gemini-3.1-flash-lite",
"gemini-flash-latest"
];
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;


function buildFallbackAnswer(prompt) {
  const topic = String(prompt || '').trim() || 'your biotechnology question';
  const lowerTopic = topic.toLowerCase();

  let answer = `I’m using a fallback explanation because the AI service is temporarily unavailable. For your question about "${topic}", here is a polished study-focused overview:\n\n`;

  if (lowerTopic.includes('crispr')) {
    answer += 'CRISPR is a powerful gene-editing technology that uses a guide RNA and the Cas9 enzyme to target a specific DNA sequence. In biotechnology, it is important because it enables researchers to modify genes with remarkable precision for applications such as genetic research, disease studies, and agriculture.';
  } else if (lowerTopic.includes('pcr')) {
    answer += 'PCR, or polymerase chain reaction, is a laboratory method used to amplify tiny amounts of DNA into millions of copies. It is a cornerstone of biotechnology because it allows scientists to study genes, diagnose disease, and analyze samples with high sensitivity.';
  } else if (lowerTopic.includes('dna') || lowerTopic.includes('rna')) {
    answer += 'DNA stores hereditary information, while RNA helps translate and carry that information for protein production. In biotechnology, understanding DNA and RNA is essential because they form the foundation of genetics, molecular diagnostics, and gene expression studies.';
  } else if (lowerTopic.includes('protein')) {
    answer += 'Proteins are essential biomolecules that carry out many functions inside cells, including structure, signaling, transport, and catalysis. They are central to biotechnology because they influence health, enzyme activity, drug development, and industrial processes.';
  } else if (lowerTopic.includes('cell') || lowerTopic.includes('cells')) {
    answer += 'Cells are the basic units of life, and understanding them is crucial in biotechnology. Scientists study cell structure, function, and behavior to develop treatments, improve crops, and design new biological products.';
  } else if (lowerTopic.includes('enzyme')) {
    answer += 'Enzymes are biological catalysts that speed up chemical reactions in living systems. They are highly valuable in biotechnology because they make processes faster, more specific, and more efficient in research and industry.';
  } else if (lowerTopic.includes('genome') || lowerTopic.includes('genomics')) {
    answer += 'Genomics is the study of an organism’s complete set of genes and their functions. It helps researchers understand disease, evolution, and biological complexity, making it a major area of modern biotechnology.';
  } else if (lowerTopic.includes('stem') || lowerTopic.includes('stem cell')) {
    answer += 'Stem cells are unique cells with the ability to develop into different specialized cell types. They are important in biotechnology and medicine because they may support regenerative therapies and deeper understanding of development.';
  } else {
    answer += 'Biotechnology applies biological knowledge to solve practical problems in medicine, agriculture, industry, and environmental science. A strong study approach is to focus on the core concept, the mechanism, the main applications, and the limitations of the topic.';
  }

  answer += '\n\nSmart study mode:\n- First, define the topic in one sentence.\n- Next, explain the mechanism or process behind it.\n- Then connect it to a real-world example.\n- Finally, note one advantage and one limitation.';

  answer += '\n\nStudy tip: if you want to remember this well, turn the idea into a simple example you can explain out loud to yourself.';
  return answer;
}

function getModelCandidates(configuredModel = DEFAULT_MODEL) {
  const preferredModel = String(configuredModel || '').trim();
  const candidates = [];

  if (preferredModel) {
    candidates.push(preferredModel);
  }

  for (const model of FALLBACK_MODELS) {
    if (!candidates.includes(model)) {
      candidates.push(model);
    }
  }

  return candidates;
}

function buildAssistantPrompt(prompt) {
  return [
    'You are BioBridge AI, a biotechnology study assistant.',
    'Provide a clear, accurate, and beginner-friendly explanation.',
    'Keep the response concise, structured, and study-focused.',
    '',
    `User Question: ${prompt}`
  ].join('\n');
}

function extractTextFromResponse(response) {
  if (typeof response?.text === 'string' && response.text.trim()) {
    return response.text.trim();
  }

  const parts = response?.candidates?.[0]?.content?.parts || [];
  const textFromParts = parts
    .map((part) => (part && typeof part.text === 'string' ? part.text : ''))
    .join('')
    .trim();

  if (textFromParts) {
    return textFromParts;
  }

  return '';
}

async function generateAssistantAnswer(prompt, fallbackAnswer) {
  if (!apiKey || !ai) {
    return {
      answer: fallbackAnswer,
      fallback: true,
      error: 'GEMINI_API_KEY is not configured.'
    };
  }

  const modelsToTry = getModelCandidates(process.env.GEMINI_MODEL);
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: buildAssistantPrompt(prompt) }] }]
      });

      const answer = extractTextFromResponse(response);
      if (answer) {
        return { answer, fallback: false, model };
      }

      lastError = new Error('The model returned an empty response.');
    } catch (error) {
      lastError = error;
      console.warn(`Gemini model ${model} failed:`, error?.message || error);
    }
  }

  return {
    answer: fallbackAnswer,
    fallback: true,
    error: lastError?.message || 'All Gemini models failed.'
  };
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BioBridge AI API is running' });
});

app.post('/api/assistant', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !String(prompt).trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const fallbackAnswer = buildFallbackAnswer(prompt);

  try {
    const result = await generateAssistantAnswer(prompt, fallbackAnswer);
    return res.json({
      success: true,
      answer: result.answer,
      fallback: result.fallback,
      model: result.model || null,
      error: result.error || null
    });
  } catch (error) {
    console.error('--- GEMINI API ERROR LOG ---');
    console.error(error);
    return res.json({ success: true, answer: fallbackAnswer, fallback: true, error: error?.message || 'Unknown error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = {
  app,
  buildFallbackAnswer,
  buildAssistantPrompt,
  extractTextFromResponse,
  generateAssistantAnswer,
  getModelCandidates
};

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BioBridge AI server running on http://localhost:${PORT}`);
  });
}