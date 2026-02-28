import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';
import './App.css';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Login } from './pages/Login';
import { VerifyEmail } from './pages/VerifyEmail';
import { SetupProfile } from './pages/SetupProfile';
import { Dashboard } from './pages/Dashboard';
import { CompetitionsPage } from './pages/CompetitionsPage';
import { CompetitionDetails } from './pages/CompetitionDetails';
import { RegistrationPage } from './pages/RegistrationPage';
import { RequestsPage } from './pages/RequestsPage';
import { CreatePost } from './pages/CreatePost';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { UserProfile } from './pages/UserProfile';
import { EditProfile } from './pages/EditProfile';
import { Notifications } from './pages/Notifications';
import { Leaderboard } from './pages/Leaderboard';
import { TeamEvaluation } from './pages/TeamEvaluation';
import { MyTeams } from './pages/MyTeams';
// --- إضافة استيراد صفحة تفاصيل الفريق ---
import { TeamDetails } from './pages/TeamDetails'; 

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; 
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-vh-100 d-flex flex-column bg-light shadow-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
        <Navbar />

        <main className="flex-grow-1">
          <Suspense fallback={<div className="text-center py-5"><div className="spinner-border text-success"></div></div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/competitions" element={<CompetitionsPage />} />
              <Route path="/competition/:id" element={<CompetitionDetails />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/profile/:userId" element={<UserProfile />} />

              <Route path="/setup-profile" element={<ProtectedRoute><SetupProfile /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

              <Route path="/my-teams" element={<ProtectedRoute><MyTeams /></ProtectedRoute>} />
              
              {/* --- مسار تفاصيل الفريق الجديد --- */}
              <Route path="/team-details/:teamId" element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />
              
              <Route path="/registration/:id" element={<RegistrationPage />} />
              <Route path="/manage-requests/:id" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
              <Route path="/evaluate/:teamId" element={<ProtectedRoute><TeamEvaluation /></ProtectedRoute>} />

              <Route path="/404" element={<div className="text-center py-5"><h1>404</h1><p>الصفحة غير موجودة</p></div>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;