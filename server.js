const express = require('express');
const path = require('path');
const axios = require('axios');
const { OpenAIAPIKey } = require('./config');
const pdfProcessor = require('./pdfProcessor');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'my-web-app-client/build')));

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { userInput } = req.body;

  try {
    const pdfText = await pdfProcessor.extractTextFromPDF('sample.pdf');
    const sentences = pdfText.split('. ');

    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: userInput,
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OpenAIAPIKey}`,
        },
      }
    );

    const botResponse = response.data.choices[0].text.trim();

    const pageTitle = `My Web App - ${botResponse}`;

    res.json({ message: botResponse, title: pageTitle });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('*', (req, res) => {
  const pageTitle = res.locals.title || 'My Web App';

  res.sendFile(path.join(__dirname, 'my-web-app-client/build', 'index.html'), {
    title: pageTitle,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
