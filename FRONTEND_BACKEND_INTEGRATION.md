# Frontend-Backend Integration Guide

## Overview

The frontend has been updated to connect to the Flask backend API. All authentication now uses JWT tokens, and the application communicates with the real backend APIs.

## What's Been Added

### 1. **Service Layer** (`src/services/`)

A complete service layer has been created to handle all API communications:

- **`api.js`** - Axios instance with request/response interceptors for token management
- **`tokenService.js`** - JWT token storage and retrieval
- **`authService.js`** - User authentication (login, register, profile updates, password management)
- **`sessionService.js`** - Assessment session management
- **`audioService.js`** - Audio file uploads
- **`onboardingService.js`** - User onboarding flow
- **`promptService.js`** - Question/prompt management
- **`achievementService.js`** - User achievements
- **`adminService.js`** - Admin operations

### 2. **Updated Components**

- **`AuthContext.jsx`** - Replaced mock authentication with real API calls
- **`LoginPage.jsx`** - Works with real backend (no changes needed)
- **`RegisterPage.jsx`** - Works with real backend (no changes needed)

### 3. **Environment Configuration**

- **`.env`** - Development environment variables
- **`.env.example`** - Template for environment setup

## How to Use

### Setup

1. **Copy `.env` file** (already created, but ensure these values match your backend):

   ```
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_ENV=development
   ```

2. **Ensure backend is running** at `http://localhost:5000`

3. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

4. **Run frontend**:
   ```bash
   npm run dev
   ```

### Using Services in Components

All services are singletons and can be imported and used directly:

```javascript
import sessionService from "../services/sessionService";
import audioService from "../services/audioService";
import authService from "../services/authService";

// Start a session
const session = await sessionService.startAssessment({ level: "A1" });

// Upload audio
const result = await audioService.uploadAudio(sessionId, audioBlob);

// Get user profile
const user = await authService.getProfile();
```

## API Endpoints Supported

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/profile` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/request-verification-email` - Request verification

### Sessions/Assessments

- `POST /api/v1/assessments/start` - Start new assessment
- `GET /api/v1/sessions/{id}` - Get session details
- `POST /api/v1/sessions/{id}/cancel` - Cancel session
- `POST /api/v1/sessions/{id}/retry` - Retry session
- `GET /api/v1/sessions/{id}/results` - Get session results
- `GET /api/v1/sessions/{id}/transcript` - Get transcript
- `POST /api/v1/sessions/{id}/start-recording` - Start recording
- `GET /api/v1/progress/history` - Get progress history
- `GET /api/v1/progress/stats` - Get stats

### Audio

- `POST /api/v1/sessions/{id}/audio` - Upload audio
- `GET /api/v1/sessions/{id}/audio-quality` - Get quality report

### Onboarding

- `GET /api/v1/onboarding/status` - Get onboarding status
- `POST /api/v1/onboarding/level` - Set proficiency level

### Prompts

- `GET /api/v1/prompts` - Get prompts
- `GET /api/v1/prompts/{id}` - Get specific prompt
- `POST /api/v1/admin/prompts` - Create prompt (admin)
- `PUT /api/v1/admin/prompts/{id}` - Update prompt (admin)

### Achievements

- `GET /api/v1/achievements` - Get all achievements
- `GET /api/v1/users/me/achievements` - Get user achievements

### Admin

- `GET /api/v1/admin/users` - Get all users (admin)
- `GET /api/v1/admin/users/{id}` - Get user details (admin)
- `GET /api/v1/admin/settings` - Get settings (admin)
- `PUT /api/v1/admin/settings/{key}` - Update setting (admin)

## Token Management

Tokens are automatically managed:

1. **Access token** stored in localStorage after login
2. **Refresh token** stored in localStorage after login
3. **Automatic refresh** - If access token expires, the interceptor automatically refreshes it using the refresh token
4. **Logout** - All tokens and user data cleared from localStorage

## Error Handling

All services include error handling that:

- Extracts meaningful error messages from API responses
- Handles authentication errors (401) with token refresh
- Redirects to login on auth failure
- Throws errors with helpful messages

## Next Steps - Components to Update

The following components should be updated to use the new services (these still use mock data):

1. **`PracticePage.jsx`** - Add real content via SessionService and PromptService
2. **`DashboardPage.jsx`** - Fetch real stats via SessionService
3. **`ProfilePage.jsx`** - Use AuthService for profile updates
4. **`CommunityPage.jsx`** - Implement community API (if available in backend)
5. **Assessment Components** - Connect to SessionService for assessment flow

## Testing

### Test Login

```
Email: student@speakingtutor.local
Password: student123456
```

### Test Admin

```
Email: admin@speakingtutor.local
Password: admin123456
```

(These are created by the seed script in the backend)

## Troubleshooting

### API Connection Issues

- Ensure backend is running: `python run.py` from `backend/` directory
- Check CORS_ORIGINS in backend `.env` includes frontend URL
- Verify VITE_API_URL in frontend `.env`

### Token Issues

- Check browser localStorage for `polylingo_access_token`
- If stuck in login loop, clear localStorage manually
- Ensure refresh token exists in localStorage

### Audio Upload Issues

- Supported formats: WAV, MP3, WEBM, M4A
- Max size: 10MB (configurable in backend)
- Check browser console for detailed errors

## Security Notes

- Never commit `.env` files with real secrets to version control
- JWT tokens stored in localStorage (consider using secure cookies for production)
- All API calls include authentication token automatically
- Tokens are refreshed automatically without user intervention
