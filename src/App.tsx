import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Shield, GraduationCap, Building2 } from 'lucide-react';

import Home from './components/Home';
import StudentRegister from './components/StudentRegister';
import StudentLogin from './components/StudentLogin';
import WardenRegister from './components/WardenRegister';
import WardenLogin from './components/WardenLogin';
import StudentDashboard from './components/StudentDashboard';
import WardenDashboard from './components/WardenDashboard';

import { Student, Warden } from './types';

type ActiveView =
  | 'home'
  | 'student-register'
  | 'student-login'
  | 'student-dashboard'
  | 'warden-register'
  | 'warden-login'
  | 'warden-dashboard';

export default function App() {
  const [view, setView] = useState<ActiveView>('home');
  const [studentSession, setStudentSession] = useState<Student | null>(null);
  const [wardenSession, setWardenSession] = useState<Warden | null>(null);

  // Restore session from localStorage if available (making persistence durable and user-friendly)
  useEffect(() => {
    const student = localStorage.getItem('hostel_student_session');
    const warden = localStorage.getItem('hostel_warden_session');

    if (student) {
      try {
        setStudentSession(JSON.parse(student));
        setView('student-dashboard');
      } catch (e) {
        localStorage.removeItem('hostel_student_session');
      }
    } else if (warden) {
      try {
        setWardenSession(JSON.parse(warden));
        setView('warden-dashboard');
      } catch (e) {
        localStorage.removeItem('hostel_warden_session');
      }
    }
  }, []);

  const handleStudentLoginSuccess = (student: Student) => {
    localStorage.setItem('hostel_student_session', JSON.stringify(student));
    setStudentSession(student);
    setView('student-dashboard');
  };

  const handleWardenLoginSuccess = (warden: Warden) => {
    localStorage.setItem('hostel_warden_session', JSON.stringify(warden));
    setWardenSession(warden);
    setView('warden-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('hostel_student_session');
    localStorage.removeItem('hostel_warden_session');
    setStudentSession(null);
    setWardenSession(null);
    setView('home');
  };

  const navigateTo = (newView: ActiveView) => {
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Universal Header Navbar */}
      <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (studentSession) setView('student-dashboard');
                  else if (wardenSession) setView('warden-dashboard');
                  else setView('home');
                }}
                className="flex items-center gap-2.5 hover:opacity-95 cursor-pointer text-left focus:outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display text-base font-extrabold text-slate-900 tracking-tight leading-none block">
                    Hostel Management
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1 mt-0.5 font-sans uppercase">
                    AI Resident Agent <Bot className="w-3 h-3 text-indigo-500" />
                  </span>
                </div>
              </button>
            </div>

            {/* Current session info on right of navbar */}
            <div className="flex items-center gap-3">
              {studentSession && (
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 font-sans">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student Session</span>
                </div>
              )}
              {wardenSession && (
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-700 font-sans">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Warden Session</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Home onNavigate={(target) => navigateTo(target)} />
            </motion.div>
          )}

          {view === 'student-register' && (
            <motion.div
              key="student-register"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <StudentRegister
                onBack={() => navigateTo('home')}
                onSuccess={() => navigateTo('student-login')}
              />
            </motion.div>
          )}

          {view === 'student-login' && (
            <motion.div
              key="student-login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <StudentLogin
                onBack={() => navigateTo('home')}
                onLoginSuccess={handleStudentLoginSuccess}
                onNavigateToRegister={() => navigateTo('student-register')}
              />
            </motion.div>
          )}

          {view === 'warden-register' && (
            <motion.div
              key="warden-register"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <WardenRegister
                onBack={() => navigateTo('home')}
                onSuccess={() => navigateTo('warden-login')}
              />
            </motion.div>
          )}

          {view === 'warden-login' && (
            <motion.div
              key="warden-login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <WardenLogin
                onBack={() => navigateTo('home')}
                onLoginSuccess={handleWardenLoginSuccess}
                onNavigateToRegister={() => navigateTo('warden-register')}
              />
            </motion.div>
          )}

          {view === 'student-dashboard' && studentSession && (
            <motion.div
              key="student-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StudentDashboard student={studentSession} onLogout={handleLogout} />
            </motion.div>
          )}

          {view === 'warden-dashboard' && wardenSession && (
            <motion.div
              key="warden-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WardenDashboard warden={wardenSession} onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 font-sans">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Hostel Management Agent. All rights reserved.</span>
          <span className="flex items-center gap-1">
            College Mini Project • Powered by <Bot className="w-3.5 h-3.5 text-indigo-500" /> Google Gemini AI
          </span>
        </div>
      </footer>
    </div>
  );
}
