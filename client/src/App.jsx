import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RoomProvider } from './context/RoomContext';
import Home from './pages/Home';
import Room from './pages/Room';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Team from './pages/Team';
import HowItWorks from './pages/HowItWorks';
import MoreFeatures from './pages/MoreFeatures';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MSITGPT from './pages/MSITGPT';
import SubjectRoadmap from './pages/SubjectRoadmap';
import PanicOverlay from './components/PanicOverlay';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <PanicOverlay />
      <RoomProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/room/:roomCode" element={<Room />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/more-features" element={<MoreFeatures />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/team" element={<Team />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/msit-gpt" element={<MSITGPT />} />
          <Route path="/roadmap/:branch/:semester/:subjectId" element={<SubjectRoadmap />} />
        </Routes>
      </RoomProvider>
    </Router>
  );
}

export default App;
