const test = require('node:test');
const assert = require('node:assert/strict');
const { getModelCandidates, buildAssistantPrompt, extractTextFromResponse } = require('./server');

test('getModelCandidates prefers configured model and adds fallback options', () => {
  assert.deepEqual(getModelCandidates('gemini-2.5-flash'), [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ]);
});

test('buildAssistantPrompt includes the user question', () => {
  const prompt = buildAssistantPrompt('What is CRISPR?');
  assert.match(prompt, /What is CRISPR\?/);
  assert.match(prompt, /BioBridge AI/);
});

test('extractTextFromResponse reads text from parts when response.text is missing', () => {
  const response = {
    candidates: [{ content: { parts: [{ text: 'Hello world' }] } }]
  };

  assert.equal(extractTextFromResponse(response), 'Hello world');
});
