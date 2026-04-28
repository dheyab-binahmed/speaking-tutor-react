# System Architecture - Frontend to Backend Integration

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser (React App)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Pages (DashboardPage, PracticePage, etc)               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Context (useAuth)                                │   │
│  │  - user, login, logout, register                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Service Layer (src/services/)                          │   │
│  │  - authService, sessionService, audioService, etc       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Axios (api.js) with Interceptors                       │   │
│  │  - Request: Add JWT token to headers                    │   │
│  │  - Response: Handle 401, refresh token                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  localStorage                                           │   │
│  │  - polylingo_access_token                              │   │
│  │  - polylingo_refresh_token                             │   │
│  │  - polylingo_auth_user                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                   HTTP/HTTPS │ with JWT
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Flask Backend                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Routes (app/api/v1/)                               │   │
│  │  - auth_routes, session_routes, audio_routes, etc      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Business Logic (app/modules/)                          │   │
│  │  - AuthService, SessionService, etc                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SQLAlchemy ORM                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Database (SQLite / PostgreSQL)                         │   │
│  │  - Users, Sessions, Prompts, Achievements, etc         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User enters email & password
   ↓
2. Frontend calls authService.login()
   ↓
3. API POST /api/v1/auth/login
   ↓
4. Backend validates credentials
   ↓
5. Backend returns { access_token, refresh_token, user }
   ↓
6. Frontend stores tokens in localStorage
   ↓
7. User logged in ✓


Token Refresh Flow (Automatic):

1. API call made → axios adds access_token to header
   ↓
2. Response is 401 (token expired)
   ↓
3. Axios interceptor catches error
   ↓
4. Calls POST /api/v1/auth/refresh with refresh_token
   ↓
5. Backend returns new access_token
   ↓
6. Axios retries original request with new token
   ↓
7. Request succeeds ✓

(User doesn't notice this at all!)
```

## Request/Response Lifecycle

```
Frontend Component
    ↓
    │ import authService
    │ const user = await authService.getProfile()
    ↓
authService (src/services/authService.js)
    ↓
    │ apiClient.get('/auth/profile')
    ↓
Axios Instance (src/services/api.js)
    ↓
    ├─ Request Interceptor
    │  └─ Adds: Authorization: Bearer {access_token}
    │
    ├─ HTTP GET http://localhost:5000/api/v1/auth/profile
    │
    ├─ Response Interceptor
    │  ├─ If 401 → refresh token
    │  ├─ If error → format error message
    │  └─ If success → return response.data
    │
    └─ Return formatted data to authService
    ↓
Backend (Flask)
    ├─ Verify JWT token
    ├─ Find user in database
    ├─ Return user data as JSON
    └─ 200 OK
    ↓
Browser returns to Frontend Component
    ↓
Component state updated, UI re-renders ✓
```

## Service Layer Architecture

```
src/services/
├── api.js
│   ├─ Axios instance
│   ├─ Request interceptors (add token)
│   └─ Response interceptors (handle errors, refresh)
│
├── tokenService.js
│   ├─ setTokens()
│   ├─ getAccessToken()
│   ├─ getRefreshToken()
│   ├─ setUser()
│   ├─ getUser()
│   ├─ isAuthenticated()
│   └─ clearTokens()
│
├── authService.js
│   ├─ register()
│   ├─ login()
│   ├─ logout()
│   ├─ getProfile()
│   ├─ updateProfile()
│   ├─ changePassword()
│   └─ ... (more auth methods)
│
├── sessionService.js
│   ├─ startAssessment()
│   ├─ getSession()
│   ├─ getSessionResults()
│   ├─ cancelSession()
│   ├─ getProgressHistory()
│   └─ ... (more session methods)
│
├── audioService.js
│   ├─ uploadAudio()
│   └─ getAudioQualityReport()
│
├── onboardingService.js
│   ├─ getStatus()
│   └─ setLevel()
│
├── promptService.js
│   ├─ getPrompts()
│   ├─ getPrompt()
│   ├─ createPrompt()
│   └─ updatePrompt()
│
├── achievementService.js
│   ├─ getAchievements()
│   ├─ getUserAchievements()
│   └─ awardAchievement()
│
└── adminService.js
    ├─ getUsers()
    ├─ getUser()
    ├─ getSettings()
    └─ updateSetting()
```

## Data Flow Example: Login

```
┌─────────────────────────────────────────────────────┐
│ User clicks "Sign In" button                        │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ LoginPage.jsx handleSubmit()                        │
│ - Gets email & password from form                   │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ useAuth().login(email, password)                    │
│ - Calls AuthContext login method                    │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ authService.login(email, password)                  │
│ - Makes API call: POST /api/v1/auth/login           │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ apiClient.post('/auth/login', data)                 │
│ - Axios adds headers & processes request            │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ HTTP POST http://localhost:5000/api/v1/auth/login   │
│ Body: { email: "...", password: "..." }             │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Backend auth_routes.py login()                      │
│ - Validates credentials                             │
│ - Generates JWT tokens                              │
│ - Returns user data                                 │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Response: {                                         │
│   access_token: "eyJ...",                           │
│   refresh_token: "eyJ...",                          │
│   user: { id, email, full_name, ... }              │
│ }                                                   │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ authService receives response                       │
│ - Saves tokens: TokenService.setTokens()            │
│ - Saves user: TokenService.setUser()                │
│ - Updates AuthContext state                         │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ LoginPage navigates to /dashboard                   │
│ User sees "Welcome back, John!"                     │
│ ✓ Login successful                                  │
└─────────────────────────────────────────────────────┘
```

## Token Flow with Expiry

```
User logs in
    ↓
access_token issued (15 min expiry)
refresh_token issued (7 day expiry)
    ↓
5 minutes pass... User makes request
    ↓
Request made with access_token ✓
Response 200 OK
    ↓
10 more minutes pass... access_token near expiry
    ↓
User makes another request
    ↓
Request made with expired access_token ✗
    ↓
Response 401 Unauthorized
    ↓
Axios Interceptor catches 401
    ↓
POST /api/v1/auth/refresh with refresh_token
    ↓
Backend returns new access_token
    ↓
Axios retries original request with new token ✓
    ↓
Response 200 OK
    ↓
User never notices! Token refresh was automatic.
```

## Component Integration Pattern

```
MyComponent.jsx
    │
    ├─ import { useAuth } from '../context/AuthContext'
    ├─ import SessionService from '../services/sessionService'
    │
    ├─ const { user } = useAuth() ← Get current user
    │
    ├─ useEffect(() => {
    │     const fetchData = async () => {
    │       const sessions = await SessionService.getProgressHistory()
    │       setData(sessions)
    │     }
    │   }, [])
    │
    └─ return <div>{data.map(...)}</div>
```

## Error Handling Flow

```
API Call
    ↓
    ├─ Success (200) → Return data
    │
    ├─ 401 (Unauthorized)
    │   ├─ Is refresh token valid?
    │   │  ├─ Yes → Refresh access token
    │   │  └─ No → Redirect to login
    │   └─ Retry request
    │
    ├─ 400 (Bad Request)
    │   └─ Show validation error: "Invalid email"
    │
    ├─ 404 (Not Found)
    │   └─ Show error: "Resource not found"
    │
    ├─ 500 (Server Error)
    │   └─ Show error: "Server error, try again"
    │
    └─ Network Error
        └─ Show error: "Connection failed"
```

## State Management Hierarchy

```
Browser LocalStorage
├─ polylingo_access_token
├─ polylingo_refresh_token
└─ polylingo_auth_user
        ↓ (synced to)
React Context (AuthContext)
    ├─ user
    ├─ loading
    ├─ error
    ├─ login()
    ├─ logout()
    ├─ register()
    └─ updateUser()
        ↓ (used by)
Component State
    ├─ local form data
    ├─ UI states
    └─ loading/error indicators
```

This architecture ensures:

- ✅ Clean separation of concerns
- ✅ Reusable services
- ✅ Automatic token management
- ✅ Proper error handling
- ✅ Easy testing
- ✅ Scalable structure
