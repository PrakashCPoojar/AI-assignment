const express = require('express');
const path = require('path');
const axios = require('axios');
const { OpenAIAPIKey } = require('./config');
const pdfProcessor = require('./pdfProcessor');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'my-web-app-client/build')));

// Parse JSON requests
app.use(express.json());

// Handle chat API endpoint
app.post('/api/chat', async (req, res) => {
  const { userInput } = req.body;

  try {
    // Extract text from the PDF
    const pdfText = await pdfProcessor.extractTextFromPDF('sample.pdf');
    const sentences = pdfText.split('. ');

    // Make a request to the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: userInput,
        max_tokens: 50, // Adjust as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OpenAIAPIKey}`,
        },
      }
    );

    const botResponse = response.data.choices[0].text.trim();

    // Set the title dynamically based on the bot response
    const pageTitle = `My Web App - ${botResponse}`;

    res.json({ message: botResponse, title: pageTitle });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve the main HTML file for any other routes
app.get('*', (req, res) => {
  // You can retrieve the title from the response sent in the '/api/chat' route
  const pageTitle = res.locals.title || 'My Web App';

  res.sendFile(path.join(__dirname, 'my-web-app-client/build', 'index.html'), {
    title: pageTitle,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
