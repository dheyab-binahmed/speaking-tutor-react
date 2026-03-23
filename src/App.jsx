import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import LessonsPage from './pages/LessonsPage'
import PracticePage from './pages/PracticePage'
import CommunityPage from './pages/CommunityPage'
import ProfilePage from './pages/ProfilePage'
import AssessmentPage from './pages/Assessment/AssessmentPage'
import LanguageStep from './pages/Assessment/LanguageStep'
import PronunciationStep from './pages/Assessment/PronunciationStep'
import SpeakingStep from './pages/Assessment/SpeakingStep'
import GrammarStep from './pages/Assessment/GrammarStep'
import ReadingStep from './pages/Assessment/ReadingStep'
import ResultsStep from './pages/Assessment/ResultsStep'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/assessment" element={<AssessmentPage />}>
          {/* ✅ FIXED HERE */}
          <Route index element={<Navigate to="/assessment/language" replace />} />

          <Route path="language" element={<LanguageStep />} />
          <Route path="pronunciation" element={<PronunciationStep />} />
          <Route path="speaking" element={<SpeakingStep />} />
          <Route path="grammar" element={<GrammarStep />} />
          <Route path="reading" element={<ReadingStep />} />
          <Route path="results" element={<ResultsStep />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}