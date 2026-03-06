import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Planner from './pages/Planner'
import EasyA from './pages/EasyA'
import Professors from './pages/Professors'
import Settings from './pages/Settings'
import PrivateRoute from './components/shared/PrivateRoute'
import { useAuth } from './hooks/useAuth'

function AppRoutes() {
  const { profile } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected routes */}
      <Route path="/onboarding" element={
        <PrivateRoute>
          <Onboarding />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          {profile?.major_primary ? <Dashboard /> : <Navigate to="/onboarding" replace />}
        </PrivateRoute>
      } />
      <Route path="/planner" element={
        <PrivateRoute>
          {profile?.major_primary ? <Planner /> : <Navigate to="/onboarding" replace />}
        </PrivateRoute>
      } />
      <Route path="/easyA" element={
        <PrivateRoute>
          {profile?.major_primary ? <EasyA /> : <Navigate to="/onboarding" replace />}
        </PrivateRoute>
      } />
      <Route path="/professors" element={
        <PrivateRoute>
          {profile?.major_primary ? <Professors /> : <Navigate to="/onboarding" replace />}
        </PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute>
          {profile?.major_primary ? <Settings /> : <Navigate to="/onboarding" replace />}
        </PrivateRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App