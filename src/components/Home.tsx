import React from 'react';
import { motion } from 'motion/react';
import { Shield, GraduationCap, Users, Bot, KeyRound, Building2 } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: 'student-register' | 'student-login' | 'warden-register' | 'warden-login') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div id="home-page" className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
          <Bot className="w-4 h-4" />
          <span>Next-Gen AI Resident Assistant</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Hostel Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">Agent</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-sans font-normal leading-relaxed">
          A smart, full-featured digital assistant designed for modern colleges. Seamlessly register, report room complaints, track maintenance, and talk with our smart Gemini-powered warden bot.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Student Panel card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 mb-5 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">Student Portal</h3>
            <p className="text-sm text-slate-500 mb-6 font-sans">
              Register, file room maintenance complaints, track solutions, and chat with the AI Assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
              <button
                id="btn-student-login"
                onClick={() => onNavigate('student-login')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-sm shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Student Login</span>
              </button>
              <button
                id="btn-student-register"
                onClick={() => onNavigate('student-register')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register</span>
              </button>
            </div>
          </motion.div>

          {/* Warden Panel card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 mb-5 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">Warden Portal</h3>
            <p className="text-sm text-slate-500 mb-6 font-sans">
              Manage hostel blocks, view and resolve room complaints, and monitor resident stats.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
              <button
                id="btn-warden-login"
                onClick={() => onNavigate('warden-login')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-sm shadow-emerald-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Warden Login</span>
              </button>
              <button
                id="btn-warden-register"
                onClick={() => onNavigate('warden-register')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features / Badges Grid */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200/60 pt-10 text-slate-500">
          <div className="flex items-center justify-center gap-2.5">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-medium text-slate-700">Block Allocations</span>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <Bot className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-medium text-slate-700">Gemini 3.5 Assistant</span>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-medium text-slate-700">Resident Directory</span>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <Shield className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-medium text-slate-700">Real-time Resolution</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
