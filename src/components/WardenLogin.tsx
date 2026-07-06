import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Warden } from '../types';

interface WardenLoginProps {
  onBack: () => void;
  onLoginSuccess: (warden: Warden) => void;
  onNavigateToRegister: () => void;
}

export default function WardenLogin({ onBack, onLoginSuccess, onNavigateToRegister }: WardenLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter both your email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/warden/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-md mx-auto my-12 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden p-8 relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors mb-6 font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Warden Login</h2>
        <p className="text-sm text-slate-500">Sign in to manage and resolve complaints.</p>
      </div>

      {error && (
        <div id="warden-login-error" className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form id="warden-login-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Email</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="warden-login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
              placeholder="warden@college.edu"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="warden-login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          id="btn-warden-sign-in"
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-emerald-100 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
        <span>Don't have an administrator account? </span>
        <button
          onClick={onNavigateToRegister}
          className="text-emerald-600 hover:underline font-semibold cursor-pointer"
        >
          Register here
        </button>
      </div>
    </motion.div>
  );
}
