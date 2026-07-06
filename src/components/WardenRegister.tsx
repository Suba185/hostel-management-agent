import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Building, ArrowLeft, Loader2, ShieldCheck, Key } from 'lucide-react';

interface WardenRegisterProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function WardenRegister({ onBack, onSuccess }: WardenRegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    wardenId: '',
    hostelBlock: 'A',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.wardenId || !formData.email || !formData.password) {
      setError('Please fill in all the required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/warden/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMsg(result.message || 'Warden registration successful!');
        setTimeout(() => {
          onSuccess(); // Redirect to login
        }, 1500);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
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
      className="max-w-xl mx-auto my-8 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden p-8 relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      
      {/* Back link */}
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
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Warden Registration</h2>
        <p className="text-sm text-slate-500">Register as a hostel administrator to resolve resident issues.</p>
      </div>

      {error && (
        <div id="warden-register-error" className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {successMsg && (
        <div id="warden-register-success" className="p-3.5 mb-5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
          {successMsg}
        </div>
      )}

      <form id="warden-register-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Warden Name *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </span>
            <input
              id="reg-warden-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Dr. Robert Smith"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Warden ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Warden Staff ID *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </span>
              <input
                id="reg-warden-id"
                type="text"
                name="wardenId"
                value={formData.wardenId}
                onChange={handleChange}
                required
                placeholder="W-40912"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Hostel Block */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assigned Hostel Block *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </span>
              <select
                id="reg-warden-block"
                name="hostelBlock"
                value={formData.hostelBlock}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
              >
                <option value="A">Block A (Kavery)</option>
                <option value="B">Block B (Yamuna)</option>
                <option value="C">Block C (Ganga)</option>
                <option value="D">Block D (Narmada)</option>
                <option value="All">All Blocks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Email *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="reg-warden-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="robert.smith@college.edu"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="reg-warden-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          id="btn-submit-warden-register"
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-emerald-100 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Administrator Account...</span>
            </>
          ) : (
            <span>Register Warden Account</span>
          )}
        </button>
      </form>
    </motion.div>
  );
}
