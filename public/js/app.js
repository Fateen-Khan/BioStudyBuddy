const app = document.getElementById('app');

function renderLandingPage() {
  app.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="#" class="brand">BioBridge AI</a>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </div>
        <button class="btn btn-primary" onclick="showDashboard()">Open Dashboard</button>
      </div>
    </nav>

    <main class="container">
      <section class="hero">
        <div class="hero-grid">
          <div class="hero-card">
            <p class="muted">AI-powered biotechnology learning</p>
            <h1>Learn complex biology faster with intelligent study support.</h1>
            <p>BioBridge AI brings together study assistance, note summarization, quizzes, flashcards, and paper simplification in one polished workspace.</p>
            <div class="hero-actions">
              <button class="btn btn-primary" onclick="showDashboard()">Get Started</button>
              <button class="btn btn-secondary" onclick="runSampleAssistant()">Try AI Assistant</button>
            </div>
            <div class="hero-stats">
              <div class="stat"><strong>24/7</strong><div class="muted">AI support</div></div>
              <div class="stat"><strong>5+</strong><div class="muted">Study tools</div></div>
              <div class="stat"><strong>100%</strong><div class="muted">Mobile ready</div></div>
            </div>
          </div>
          <div class="panel">
            <h3>What you can do</h3>
            <ul class="muted">
              <li>Ask biotechnology questions</li>
              <li>Summarize lecture notes</li>
              <li>Generate quizzes and flashcards</li>
              <li>Simplify research papers</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="features" class="section">
        <h2>Core features</h2>
        <div class="grid cards">
          <div class="card">
            <h3>Study Assistant</h3>
            <p>Ask follow-up questions and receive detailed, structured explanations.</p>
          </div>
          <div class="card">
            <h3>Summarizer</h3>
            <p>Turn long notes into concise summaries with key takeaways.</p>
          </div>
          <div class="card">
            <h3>Quiz Generator</h3>
            <p>Create MCQs, true/false questions, and short-answer prompts instantly.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Testimonials</h2>
        <div class="grid cards">
          <div class="card"><p>“The explanations are clear and actually help me study smarter.”</p></div>
          <div class="card"><p>“I use it to simplify papers before exams and group discussions.”</p></div>
          <div class="card"><p>“The flashcards and quiz generator save me hours every week.”</p></div>
        </div>
      </section>

      <section id="faq" class="section">
        <h2>FAQ</h2>
        <div class="grid">
          <div class="panel"><strong>Is the app beginner-friendly?</strong><p class="muted">Yes, the experience is designed for students who want less friction and faster learning.</p></div>
          <div class="panel"><strong>Can I use it for research papers?</strong><p class="muted">Absolutely. Paste any abstract and the app will break down the core ideas in simple language.</p></div>
        </div>
      </section>

      <section id="contact" class="section">
        <h2>Contact</h2>
        <div class="panel form-grid">
          <input placeholder="Your email" />
          <textarea placeholder="How can we help?"></textarea>
          <button class="btn btn-primary">Send Message</button>
        </div>
      </section>
    </main>

    <footer class="section">
      <div class="container" style="text-align:center; color:var(--muted);">© 2026 BioBridge AI. Built for biotech learners.</div>
    </footer>
  `;
}

async function runSampleAssistant() {
  const prompt = 'Explain CRISPR in simple terms for a biotechnology student.';
  const response = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  alert(data.answer || data.error || 'No response');
}

function showDashboard() {
  app.innerHTML = `
    <div class="container" style="padding:2rem 0;">
      <div class="dashboard">
        <aside class="sidebar">
          <h3>BioBridge AI</h3>
          <p class="muted">Student workspace</p>
          <div class="form-grid" style="margin-top:1rem;">
            <button class="btn btn-primary" onclick="showAssistant()">AI Assistant</button>
            <button class="btn btn-secondary" onclick="showSummarizer()">Summarizer</button>
            <button class="btn btn-secondary" onclick="showQuiz()">Quiz Generator</button>
            <button class="btn btn-secondary" onclick="showFlashcards()">Flashcards</button>
            <button class="btn btn-secondary" onclick="showPaper()">Paper Simplifier</button>
            <button class="btn btn-secondary" onclick="renderLandingPage()">Back Home</button>
          </div>
        </aside>
        <main class="content">
          <div class="panel">
            <h3>Welcome back</h3>
            <p class="muted">Use the tools to study faster and stay organized.</p>
          </div>
          <div class="panel">
            <h3>Recent activity</h3>
            <ul class="muted">
              <li>AI assistant used for biotechnology concept review</li>
              <li>Lecture notes summarized successfully</li>
              <li>Quiz generated for gene expression</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  `;
}

function showAssistant() {
  app.innerHTML = `
    <div class="container" style="padding:2rem 0;">
      <div class="panel form-grid">
        <h3>AI Study Assistant</h3>
        <textarea id="assistantPrompt" placeholder="Ask anything about biotechnology, molecular biology, or lab methods"></textarea>
        <button class="btn btn-primary" onclick="submitAssistant()">Ask AI</button>
        <div id="assistantOutput" class="muted"></div>
      </div>
    </div>
  `;
}

async function submitAssistant() {
  const prompt = document.getElementById('assistantPrompt').value;
  const output = document.getElementById('assistantOutput');
  output.textContent = 'Generating response...';
  const response = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  output.textContent = data.answer || data.error || 'No response';
}

function showSummarizer() {
  app.innerHTML = `
    <div class="container" style="padding:2rem 0;">
      <div class="panel form-grid">
        <h3>Lecture Note Summarizer</h3>
        <textarea id="notesInput" placeholder="Paste your lecture notes here"></textarea>
        <button class="btn btn-primary" onclick="submitSummary()">Generate Summary</button>
        <div id="summaryOutput" class="muted"></div>
      </div>
    </div>
  `;
}

async function submitSummary() {
  const notes = document.getElementById('notesInput').value;
  const output = document.getElementById('summaryOutput');
  output.textContent = 'Summarizing...';
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  });
  const data = await response.json();
  output.innerHTML = `<strong>Summary:</strong><br>${(data.summary || '').replace(/\n/g, '<br>')}`;
}

function showQuiz() {
  app.innerHTML = `
    <div class="container" style="padding:2rem 0;">
      <div class="panel form-grid">
        <h3>Quiz Generator</h3>
        <input id="quizTopic" placeholder="Topic, e.g. Gene Expression" />
        <button class="btn btn-primary" onclick="submitQuiz()">Generate Quiz</button>
        <div id="quizOutput" class="muted"></div>
      </div>
    </div>
  `;
}

async function submitQuiz() {
  const topic = document.getElementById('quizTopic').value;
  const output = document.getElementById('quizOutput');
  output.textContent = 'Generating quiz...';
  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  const data = await response.json();
  output.innerHTML = data.questions.map((q, index) => `
    <div style="margin-top: 0.8rem;">
      <strong>${index + 1}. ${q.question}</strong><br>
      ${q.options ? q.options.map(option => `<div>${option}</div>`).join('') : ''}
      <div class="muted">Answer: ${q.answer}</div>
    </div>
  `).join('');
}

function showFlashcards() {
  app.innerHTML = `
    <div class="container" style="padding:2rem 0;">
      <div class="panel form-grid">
        <h3>Flashcard Generator</h3>
        <textarea id="flashcardsInput" placeholder="Paste notes to build flashcards"></textarea>
        <button class="btn btn-primary" onclick="submitFlashcards()">Create Flashcards</button>
        <div id="flashcardsOutput" class="muted"></div>
      </div>
    </div>
  `;
}

async function submitFlashcards() {
  const notes = document.getElementById('flashcardsInput').value;
  const output = document.getElementById('flashcardsOutput');
  output.textContent = 'Creating flashcards...';
  const response = await fetch('/api/flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  });
  const data = await response.json();
  output.innerHTML = data.cards.map(card => `<div class="card" style="margin-top:0.7rem;"><strong>${card.front}</strong><p>${card.back}</p></div>`).join('');
}

function showPaper() {
  app.innerHTML = `
    <div class="container" style="padding:2rem 0;">
      <div class="panel form-grid">
        <h3>Research Paper Simplifier</h3>
        <textarea id="paperAbstract" placeholder="Paste the paper abstract here"></textarea>
        <button class="btn btn-primary" onclick="submitPaper()">Simplify Paper</button>
        <div id="paperOutput" class="muted"></div>
      </div>
    </div>
  `;
}

async function submitPaper() {
  const abstract = document.getElementById('paperAbstract').value;
  const output = document.getElementById('paperOutput');
  output.textContent = 'Simplifying research paper...';
  const response = await fetch('/api/paper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ abstract })
  });
  const data = await response.json();
  output.innerHTML = `
    <p><strong>Summary:</strong> ${data.summary}</p>
    <p><strong>Objective:</strong> ${data.sections.objective}</p>
    <p><strong>Methods:</strong> ${data.sections.methods}</p>
    <p><strong>Results:</strong> ${data.sections.results}</p>
    <p><strong>Conclusion:</strong> ${data.sections.conclusion}</p>
  `;
}

renderLandingPage();
