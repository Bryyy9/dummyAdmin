# Environment Variables Setup Guide

This document explains how to configure environment variables for the Brillance SaaS application.

## Required Environment Variables

### NEXT_PUBLIC_API_URL
- **Description**: The base URL for the backend API
- **Type**: Public (accessible in browser)
- **Default**: `http://localhost:8000/api/v1` (fallback only)
- **Production Value**: `https://be-corpora.vercel.app/api/v1`
- **Example**: `https://be-corpora.vercel.app/api/v1`

## Setup Instructions

### For v0 Preview Environment
1. Click the **Vars** section in the in-chat sidebar
2. Add a new environment variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://be-corpora.vercel.app/api/v1`
3. Save the changes
4. Refresh the preview to apply the new environment variable

### For Local Development
1. Create a `.env.local` file in the project root (copy from `.env.example`)
2. Set the environment variables:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   \`\`\`
3. Restart your development server for changes to take effect

### For Vercel Deployment
1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://be-corpora.vercel.app/api/v1`
   - **Environments**: Select all (Production, Preview, Development)
4. Redeploy your project

## API Services Using NEXT_PUBLIC_API_URL

The following API services automatically use the `NEXT_PUBLIC_API_URL` environment variable:

- `lib/api/cultures.ts` - Cultural items management
- `lib/api/subcultures.ts` - Subculture management
- `lib/api/leksikons.ts` - Lexicon management
- `lib/api/contributors.ts` - Contributors management
- `lib/api/references.ts` - References management
- `lib/api/assets.ts` - Assets management
- `lib/api/domain-kodifikasi.ts` - Domain codification management

## Error Handling

If the API is unavailable or the environment variable is not set:
- The application will fall back to mock data
- Console logs will indicate which API URL is being used
- Error messages will guide you to set the environment variable correctly

## Troubleshooting

### API calls still using localhost:8000
- **Cause**: Environment variable not set in v0 preview
- **Solution**: Set `NEXT_PUBLIC_API_URL` in the Vars section of the in-chat sidebar

### "Failed to fetch" errors
- **Cause**: API server is unreachable or environment variable is incorrect
- **Solution**: Verify the API URL is correct and the server is running

### Environment variable not updating
- **Cause**: Preview cache or development server not restarted
- **Solution**: Refresh the preview or restart your development server

## Best Practices

1. **Never commit `.env.local`** - Add it to `.gitignore` (already done)
2. **Use `.env.example`** - Keep this file updated with all required variables
3. **Document changes** - Update this file when adding new environment variables
4. **Test after changes** - Always verify the API connection after updating environment variables
