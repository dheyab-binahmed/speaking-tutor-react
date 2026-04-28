# Frontend Service Usage Examples

This document shows how to use the new API services in React components.

## Authentication Examples

### Login

```javascript
import { useAuth } from "../context/AuthContext";

export default function LoginComponent() {
  const { login, error, loading } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const user = await login(email, password);
      // User is now logged in, redirected automatically
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Form JSX */}
    </div>
  );
}
```

### Register

```javascript
import { useAuth } from "../context/AuthContext";

export default function RegisterComponent() {
  const { register, error, loading } = useAuth();

  const handleRegister = async (userData) => {
    try {
      const user = await register({
        name: "John Doe",
        email: "john@example.com",
        age: 25,
        password: "securePassword123",
        preferredLanguage: "Spanish",
      });
      // User registered and logged in automatically
    } catch (err) {
      console.error("Registration failed:", err.message);
    }
  };
}
```

### Get Current User

```javascript
import { useAuth } from "../context/AuthContext";

export default function ProfileComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>{user.full_name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## Session/Assessment Examples

### Start an Assessment

```javascript
import SessionService from "../services/sessionService";
import { useState, useEffect } from "react";

export default function AssessmentComponent() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startAssessment = async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionData = await SessionService.startAssessment({
        level: "A1",
        test_type: "reading_aloud",
      });
      setSession(sessionData.session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {session ? (
        <div>
          <p>Session ID: {session.id}</p>
          <p>Status: {session.status}</p>
        </div>
      ) : (
        <button onClick={startAssessment} disabled={loading}>
          {loading ? "Starting..." : "Start Assessment"}
        </button>
      )}
    </div>
  );
}
```

### Get Session Details

```javascript
import SessionService from "../services/sessionService";
import { useEffect, useState } from "react";

export default function SessionDetailsComponent({ sessionId }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await SessionService.getSession(sessionId);
        setSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Session: {session.prompt.title}</h2>
      <p>Reference Text: {session.prompt.reference_text}</p>
      <p>Status: {session.status}</p>
    </div>
  );
}
```

### Get Session Results

```javascript
import SessionService from "../services/sessionService";
import { useEffect, useState } from "react";

export default function ResultsComponent({ sessionId }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await SessionService.getSessionResults(sessionId);
        setResults(data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [sessionId]);

  if (loading) return <div>Loading results...</div>;
  if (!results) return <div>No results available</div>;

  return (
    <div>
      <h2>Results</h2>
      <p>Accuracy: {results.accuracy}%</p>
      <p>Fluency: {results.fluency}</p>
      <p>Pronunciation: {results.pronunciation}</p>
    </div>
  );
}
```

## Audio Upload Examples

### Upload Audio File

```javascript
import AudioService from "../services/audioService";
import { useState, useRef } from "react";

export default function AudioUploadComponent({ sessionId }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const result = await AudioService.uploadAudio(sessionId, file);
      console.log("Upload successful:", result);
      // Handle successful upload
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

### Get Audio Quality Report

```javascript
import AudioService from "../services/audioService";
import { useEffect, useState } from "react";

export default function AudioQualityComponent({ sessionId }) {
  const [quality, setQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuality = async () => {
      try {
        const data = await AudioService.getAudioQualityReport(sessionId);
        setQuality(data);
      } catch (err) {
        console.error("Error fetching quality:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuality();
  }, [sessionId]);

  if (loading) return <div>Loading quality report...</div>;
  if (!quality) return <div>No quality data available</div>;

  return (
    <div>
      <h3>Audio Quality</h3>
      <p>Signal to Noise Ratio: {quality.snr}</p>
      <p>Overall Quality: {quality.overall_quality}</p>
    </div>
  );
}
```

## Prompts/Questions Examples

### Get All Prompts

```javascript
import PromptService from "../services/promptService";
import { useEffect, useState } from "react";

export default function PromptsListComponent() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ difficulty_level: "A1" });

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await PromptService.getPrompts(filter);
        setPrompts(data);
      } catch (err) {
        console.error("Error fetching prompts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, [filter]);

  return (
    <div>
      <label>
        Difficulty:
        <select
          value={filter.difficulty_level}
          onChange={(e) => setFilter({ difficulty_level: e.target.value })}
        >
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
        </select>
      </label>

      {loading && <p>Loading prompts...</p>}

      {prompts.map((prompt) => (
        <div key={prompt.id}>
          <h4>{prompt.title}</h4>
          <p>{prompt.reference_text}</p>
          <small>Difficulty: {prompt.difficulty_level}</small>
        </div>
      ))}
    </div>
  );
}
```

## Achievements Examples

### Get User Achievements

```javascript
import AchievementService from "../services/achievementService";
import { useEffect, useState } from "react";

export default function AchievementsComponent() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await AchievementService.getUserAchievements();
        setAchievements(data);
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) return <div>Loading achievements...</div>;

  return (
    <div>
      <h2>Your Achievements</h2>
      {achievements.map((achievement) => (
        <div key={achievement.id}>
          <h4>{achievement.name}</h4>
          <p>{achievement.description}</p>
          <p>
            Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

## Progress Examples

### Get Progress History

```javascript
import SessionService from "../services/sessionService";
import { useEffect, useState } from "react";

export default function ProgressHistoryComponent() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await SessionService.getProgressHistory({ limit: 10 });
        setSessions(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div>Loading history...</div>;

  return (
    <div>
      <h2>Recent Sessions</h2>
      {sessions.map((session) => (
        <div key={session.id}>
          <p>{session.prompt.title}</p>
          <small>{new Date(session.created_at).toLocaleDateString()}</small>
          <p>Status: {session.status}</p>
        </div>
      ))}
    </div>
  );
}
```

## Onboarding Examples

### Set Proficiency Level

```javascript
import OnboardingService from "../services/onboardingService";
import { useState } from "react";

export default function ProficiencyLevelComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSetLevel = async (level) => {
    setLoading(true);
    setError(null);
    try {
      const result = await OnboardingService.setLevel(level);
      console.log("Level set successfully:", result);
      // Navigate to next step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={() => handleSetLevel("A1")} disabled={loading}>
        A1 - Beginner
      </button>
      <button onClick={() => handleSetLevel("A2")} disabled={loading}>
        A2 - Elementary
      </button>
      <button onClick={() => handleSetLevel("B1")} disabled={loading}>
        B1 - Intermediate
      </button>
      <button onClick={() => handleSetLevel("B2")} disabled={loading}>
        B2 - Upper Intermediate
      </button>
    </div>
  );
}
```

## Error Handling Pattern

All services include error handling. Here's the recommended pattern:

```javascript
import SomeService from "../services/someService";
import { useState } from "react";

export default function Component() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await SomeService.someMethod();
      setData(result);
    } catch (err) {
      setError(err.message);
      // Optional: show notification/toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div
          style={{
            padding: "1rem",
            background: "#fee",
            color: "#c00",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          Error: {error}
        </div>
      )}
      {loading && <p>Loading...</p>}
      {data && <div>{/* Render data */}</div>}
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Data"}
      </button>
    </div>
  );
}
```

## Custom Hooks Pattern (Optional)

For cleaner code, create custom hooks:

```javascript
// hooks/useSessionData.js
import { useState, useEffect } from "react";
import SessionService from "../services/sessionService";

export function useSessionData(sessionId) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const data = await SessionService.getSession(sessionId);
        setSession(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  return { session, loading, error };
}

// Usage in component:
const { session, loading, error } = useSessionData(sessionId);
```
