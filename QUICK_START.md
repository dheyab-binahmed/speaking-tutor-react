# Quick Start Guide - Frontend Backend Integration

## 🚀 Get Started in 3 Steps

### Step 1: Start Backend

```bash
# From speaking-tutor-flask/backend directory
python run.py
```

✅ Backend runs at: `http://localhost:5000`

### Step 2: Start Frontend

```bash
# From speaking-tutor-react directory
npm install    # First time only
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

### Step 3: Test Login

Navigate to `http://localhost:5173/login` and use:

- Email: `student@speakingtutor.local`
- Password: `student123456`

## ✨ What's Different from Before

### Before (Mock)

```javascript
// Old way - fake data, localStorage only
const [user, setUser] = useState(mockUser);
```

### After (Real API)

```javascript
// New way - real backend, JWT tokens, proper auth
const { user, login, logout } = useAuth();
await login(email, password); // Calls real API
```

## 📦 What Was Added

### Services (Real API Calls)

Located in `src/services/`:

- `authService.js` - Login, register, profile
- `sessionService.js` - Start/manage assessments
- `audioService.js` - Upload audio
- `promptService.js` - Get questions
- `achievementService.js` - Get badges
- `onboardingService.js` - Setup flow
- `adminService.js` - Admin functions

### No New Dependencies!

Everything uses existing packages:

- ✅ React
- ✅ React Router
- ✅ Axios (already there)

## 🔌 Using Services in Components

### Simple Usage

```javascript
import AuthService from "../services/authService";

// In your component:
const user = await AuthService.getProfile();
```

### With Auth Context (Recommended)

```javascript
import { useAuth } from "../context/AuthContext";

export default function MyComponent() {
  const { user, login, logout } = useAuth();

  // user, login, logout are ready to use!
}
```

### Start an Assessment

```javascript
import SessionService from "../services/sessionService";

const session = await SessionService.startAssessment();
console.log("Session ID:", session.id);
```

### Upload Audio

```javascript
import AudioService from "../services/audioService";

const result = await AudioService.uploadAudio(sessionId, audioBlob);
console.log("Upload successful:", result);
```

## 🔑 How Authentication Works

1. **Login** → Get JWT tokens
2. **Tokens stored** → Automatically in localStorage
3. **API calls** → Token added to every request
4. **Token expires?** → Automatically refreshed
5. **All handled** → No code needed from you!

## 📝 Configuration

### Environment Variables (`.env`)

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_ENV=development
```

### Change Backend URL

Edit `.env` if backend is on different port:

```
VITE_API_URL=http://localhost:3000/api/v1
```

## 🧪 Test Features

### Test Users (Created by Backend Seed)

- **Student**: `student@speakingtutor.local` / `student123456`
- **Admin**: `admin@speakingtutor.local` / `admin123456`

### API Endpoints Available

All these endpoints are now ready:

- Authentication (login, register, refresh)
- Sessions (start, get, results)
- Audio (upload, quality check)
- Prompts (list, get)
- Progress (history, stats)
- Achievements (list, get)

## 🐛 Troubleshooting

### "Can't connect to backend"

```bash
# Check backend is running:
curl http://localhost:5000/api/v1/health
# Should show: {"status": "ok"}
```

### "Login not working"

1. Check `.env` has correct `VITE_API_URL`
2. Check backend is actually running
3. Try the test credentials: `student@speakingtutor.local`
4. Check browser console for errors (F12)

### "Tokens not working"

1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. Look for `polylingo_access_token`
4. If missing, try login again

### "CORS errors"

- Backend needs CORS configured
- Check `.env` in backend includes: `CORS_ORIGINS=http://localhost:5173`

## 📚 Documentation

Read for more details:

- `INTEGRATION_SUMMARY.md` - What was done
- `FRONTEND_BACKEND_INTEGRATION.md` - Complete reference
- `SERVICE_USAGE_EXAMPLES.md` - Code examples

## 🎯 Quick Win: Display User in Dashboard

Replace mock user in `DashboardPage.jsx`:

```javascript
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Before: <h1>Welcome back, mock user!</h1> */}
      <h1>Welcome back, {user?.full_name}! 👋</h1>
    </div>
  );
}
```

Done! You're now using real user data from the backend.

## 🚀 Next Task: Connect Assessment

Update `AssessmentPage.jsx`:

```javascript
import { useNavigate } from "react-router-dom";
import SessionService from "../services/sessionService";

export default function AssessmentPage() {
  const navigate = useNavigate();

  const startAssessment = async () => {
    try {
      const { session } = await SessionService.startAssessment({
        level: "A1",
      });
      navigate(`/session/${session.id}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return <button onClick={startAssessment}>Start Assessment</button>;
}
```

## ✅ Checklist

- [ ] Backend running at `http://localhost:5000`
- [ ] Frontend running at `http://localhost:5173`
- [ ] Can login with test credentials
- [ ] User profile displays correctly
- [ ] Can see user in dashboard
- [ ] Ready to build more features!

## 💡 Tips

1. **Use useAuth()** for authentication anywhere
2. **Import services** to make API calls
3. **Check browser console** for error details
4. **Use Network tab** to debug API issues
5. **Read SERVICE_USAGE_EXAMPLES.md** before coding

## Need Help?

1. Check the example files in `SERVICE_USAGE_EXAMPLES.md`
2. Look at the service files - they're well documented
3. Check browser console (F12) for error messages
4. Ensure backend is running and accessible

You're all set! Start building! 🎉
