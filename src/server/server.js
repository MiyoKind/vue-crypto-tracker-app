import express from 'express';
import axios from 'axios';
import { fetchMonthlyPriceChangeHistoryForCoin } from '@/api/api'

/**
 * ChatGPT proxy server
 */

const app = express();
const port = 3000; // Choose the desired port number

app.get('/chatgpt', async (req, res) => {
    try {
      const { data } = await axios.post('https://api.openai.com/v1/chat/completions', {
        prompt: req.query.prompt, // Pass the prompt from the client as a query parameter
        max_tokens: 50, // Adjust the desired max tokens as needed
        // Include any other required parameters for the ChatGPT API request
      }, {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
      });
  
      res.json(data.choices[0]); // Send the response from ChatGPT back to the client
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });  