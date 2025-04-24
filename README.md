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

### Hello World
`GET /`

Simple test endpoint to verify the API is running.

**Response:**
```json
{
  "message": "Hello, World!",
  "status": "API is running correctly"
}
```

### Generate Video
`POST /api/generate-video`

Generates a video from a script using Visla's service.

#### Supported Request Formats
This endpoint supports both JSON and form-data formats:

**JSON Request:**
```
Content-Type: application/json

{
  "script": "Your video script text here",
  "webhookUrl": "https://your-server.com/webhook-endpoint",
  "apiKey": "your_api_key",
  "apiSecret": "your_api_secret"
}
```

**Form Data Request:**
You can also send the request as form-data with the same field names:
- script
- webhookUrl
- apiKey
- apiSecret

#### Response:
```json
{
  "message": "Video generation request submitted successfully",
  "data": {
    // Visla API response data
  }
}
```

### Check Video Status
`GET /api/video/:videoId/status`

Retrieves the status of a video generation request.

**URL Parameters:**
- `videoId`: The ID of the video to check (received from the generate-video response)

**Query Parameters:**
- `apiKey`: Your Visla API key (optional if set in environment variables)
- `apiSecret`: Your Visla API secret (optional if set in environment variables)

**Example Request:**
```
GET /api/video/123456789/status?apiKey=your_api_key&apiSecret=your_api_secret
```

**Response:**
```json
{
  "message": "Video status retrieved successfully",
  "data": {
    // Visla API status response data
  }
}
```

### Export Video to Clip
`POST /api/video/:videoId/export`

Exports a video to a clip that can be downloaded.

**URL Parameters:**
- `videoId`: The ID of the video to export (received from the generate-video response)

**Request Body:**
```json
{
  "apiKey": "your_api_key",
  "apiSecret": "your_api_secret"
}
```

**Response:**
```json
{
  "message": "Video exported to clip successfully",
  "data": {
    // Visla API export response data
  }
}
```

### Get Clip Download URL
`GET /api/clip/:clipId/download-url`

Retrieves the download URL for a previously exported clip.

**URL Parameters:**
- `clipId`: The ID of the clip to download (received from the export-video response)

**Query Parameters:**
- `apiKey`: Your Visla API key (optional if set in environment variables)
- `apiSecret`: Your Visla API secret (optional if set in environment variables)

**Example Request:**
```
GET /api/clip/123456789/download-url?apiKey=your_api_key&apiSecret=your_api_secret
```

**Response:**
```json
{
  "message": "Clip download URL retrieved successfully",
  "data": {
    // Visla API response with download URL
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

## Troubleshooting

### 404 Not Found
If you're getting a "Cannot GET /api/generate-video" error, make sure:
1. You're sending a POST request, not a GET request
2. You're using the correct URL
3. Your server is running

### Request Format Issues
If you're having trouble with the request format:
1. Check that you're using either JSON (Content-Type: application/json) or form-data format
2. Ensure all required fields are included in the request
3. Check the console logs for any specific errors

## Security Notes

- For production, never expose your API credentials in client-side code
- Consider implementing proper authentication for your API
- The webhookUrl should be a secure endpoint that can receive notifications about video generation status 