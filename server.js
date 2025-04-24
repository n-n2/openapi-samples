require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { makeVideoFromScript } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Hello World route for testing
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Hello, World!',
    status: 'API is running correctly' 
  });
});

// Routes
app.post('/api/generate-video', async (req, res) => {
  try {
    const { script, webhookUrl, apiKey, apiSecret } = req.body;
    
    // Validate required inputs
    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }
    
    if (!apiKey || !apiSecret) {
      return res.status(400).json({ 
        error: 'API credentials are required. Either provide them in the request or set VISLA_API_KEY and VISLA_API_SECRET environment variables.' 
      });
    }
    
    // Call the function to make a video
    const result = await makeVideoFromScript(
      script, 
      webhookUrl, 
      apiKey, 
      apiSecret
    );
    
    return res.status(200).json({ 
      message: 'Video generation request submitted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return res.status(500).json({ 
      error: 'Failed to process video generation request',
      message: error.message 
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 