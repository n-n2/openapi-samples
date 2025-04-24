require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { makeVideoFromScript, checkVideoStatus, exportVideoToClip, getClipDownloadUrl } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hello World route for testing
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Hello, World!',
    status: 'API is running correctly' 
  });
});

// Helpful message for GET requests to the POST endpoint
app.get('/api/generate-video', (req, res) => {
  res.status(405).json({
    error: 'Method not allowed',
    message: 'This endpoint requires a POST request. Please make sure you are sending a POST request with the required parameters.',
    requiredParameters: ['script', 'webhookUrl', 'apiKey', 'apiSecret']
  });
});

// Routes
app.post('/api/generate-video', async (req, res) => {
  console.log('Received request body:', req.body);
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
    
    console.log('Processing request with script length:', script.length);
    
    // Call the function to make a video
    const result = await makeVideoFromScript(
      script, 
      webhookUrl, 
      apiKey, 
      apiSecret
    );
    
    console.log('API response:', result);
    
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

// Video status endpoint
app.get('/api/video/:videoId/status', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    // Get API credentials from environment variables or query params
    const apiKey = req.query.apiKey || process.env.VISLA_API_KEY;
    const apiSecret = req.query.apiSecret || process.env.VISLA_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      return res.status(400).json({ 
        error: 'API credentials are required. Either provide them as query parameters or set VISLA_API_KEY and VISLA_API_SECRET environment variables.' 
      });
    }
    
    console.log(`Checking status for video ID: ${videoId}`);
    
    // Call the function to check video status
    const result = await checkVideoStatus(
      videoId, 
      apiKey, 
      apiSecret
    );
    
    console.log('API status response:', result);
    
    return res.status(200).json({ 
      message: 'Video status retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error checking video status:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve video status',
      message: error.message 
    });
  }
});

// Export video to clip endpoint
app.post('/api/video/:videoId/export', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    // Get API credentials from environment variables or request body
    const apiKey = req.body.apiKey || process.env.VISLA_API_KEY;
    const apiSecret = req.body.apiSecret || process.env.VISLA_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      return res.status(400).json({ 
        error: 'API credentials are required. Either provide them in the request body or set VISLA_API_KEY and VISLA_API_SECRET environment variables.' 
      });
    }
    
    console.log(`Exporting video ID: ${videoId} to clip`);
    
    // Call the function to export video to clip
    const result = await exportVideoToClip(
      videoId, 
      apiKey, 
      apiSecret
    );
    
    console.log('API export response:', result);
    
    return res.status(200).json({ 
      message: 'Video exported to clip successfully',
      data: result
    });
  } catch (error) {
    console.error('Error exporting video to clip:', error);
    return res.status(500).json({ 
      error: 'Failed to export video to clip',
      message: error.message 
    });
  }
});

// Get clip download URL endpoint
app.get('/api/clip/:clipId/download-url', async (req, res) => {
  try {
    const { clipId } = req.params;
    
    // Get API credentials from environment variables or query params
    const apiKey = req.query.apiKey || process.env.VISLA_API_KEY;
    const apiSecret = req.query.apiSecret || process.env.VISLA_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      return res.status(400).json({ 
        error: 'API credentials are required. Either provide them as query parameters or set VISLA_API_KEY and VISLA_API_SECRET environment variables.' 
      });
    }
    
    console.log(`Getting download URL for clip ID: ${clipId}`);
    
    // Call the function to get clip download URL
    const result = await getClipDownloadUrl(
      clipId, 
      apiKey, 
      apiSecret
    );
    
    console.log('API download URL response:', result);
    
    return res.status(200).json({ 
      message: 'Clip download URL retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error getting clip download URL:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve clip download URL',
      message: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the API with http://localhost:${PORT}/`);
  console.log(`Generate videos with POST http://localhost:${PORT}/api/generate-video`);
}); 