# Visla Video Generation API

A simple API for generating videos from scripts using the Visla service.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with your Visla API credentials:
   ```
   PORT=3000
   VISLA_API_KEY=your_api_key_here
   VISLA_API_SECRET=your_api_secret_here
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Generate Video
`POST /api/generate-video`

Generates a video from a script using Visla's service.

**Request Body:**
```json
{
  "script": "Your video script text here",
  "webhookUrl": "https://your-server.com/webhook-endpoint",
  "apiKey": "optional_if_set_in_env",
  "apiSecret": "optional_if_set_in_env"
}
```

**Response:**
```json
{
  "message": "Video generation request submitted successfully",
  "data": {
    // Visla API response data
  }
}
```

### Health Check
`GET /health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "ok"
}
```

## Security Notes

- For production, never expose your API credentials in client-side code
- Consider implementing proper authentication for your API
- The webhookUrl should be a secure endpoint that can receive notifications about video generation status 