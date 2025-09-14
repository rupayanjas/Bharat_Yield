# Google Gemini API Setup

## Getting Your Free API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Setting Up Environment Variables

1. Create a `.env` file in your project root
2. Add your API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

## Gemini Free Tier Limits

- **Free Tier**: 15 requests per minute, 1 million tokens per day
- **Model**: gemini-1.5-flash (fast and efficient)
- **Perfect for**: Text analysis, summarization, and structured data extraction

## Usage in the App

The app will automatically:
1. Extract text from uploaded PDF soil health cards
2. Send the text to Gemini for analysis
3. Get structured soil health data back
4. Display AI-generated recommendations

## Troubleshooting

If you get API errors:
- Check your API key is correct
- Ensure you haven't exceeded free tier limits
- Verify the PDF contains readable text (not just images)

The app includes fallback functionality if the API is unavailable.
