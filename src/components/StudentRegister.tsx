import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Building, Layers, Hash, BookOpen, ArrowLeft, Calendar, Loader2 } from 'lucide-react';

interface StudentRegisterProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function StudentRegister({ onBack, onSuccess }: StudentRegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: '',
    year: '1',
    hostelBlock: 'A',
    roomNumber: '',
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

    // Quick client validations
    if (!formData.name || !formData.registerNumber || !formData.department || !formData.roomNumber || !formData.email || !formData.password) {
      setError('Please fill in all the required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMsg(result.message || 'Registration successful!');
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
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Student Registration</h2>
        <p className="text-sm text-slate-500">Create your account to submit requests and use the AI Chat Assistant.</p>
      </div>

      {error && (
        <div id="register-error" className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {successMsg && (
        <div id="register-success" className="p-3.5 mb-5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
          {successMsg}
        </div>
      )}

      <form id="student-register-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="reg-student-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Register Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Register Number *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </span>
              <input
                id="reg-student-reg-num"
                type="text"
                name="registerNumber"
                value={formData.registerNumber}
                onChange={handleChange}
                required
                placeholder="312221104001"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <BookOpen className="w-4 h-4" />
              </span>
              <input
                id="reg-student-dept"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="CSE / IT / ECE"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Year of Study *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </span>
              <select
                id="reg-student-year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hostel Block */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hostel Block *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </span>
              <select
                id="reg-student-block"
                name="hostelBlock"
                value={formData.hostelBlock}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
              >
                <option value="A">Block A (Kavery)</option>
                <option value="B">Block B (Yamuna)</option>
                <option value="C">Block C (Ganga)</option>
                <option value="D">Block D (Narmada)</option>
              </select>
            </div>
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Room Number *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Layers className="w-4 h-4" />
              </span>
              <input
                id="reg-student-room"
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                required
                placeholder="305"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="reg-student-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john.doe@college.edu"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
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
              id="reg-student-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          id="btn-submit-student-register"
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-indigo-100 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Account...</span>
            </>
          ) : (
            <span>Create Student Account</span>
          )}
        </button>
      </form>
    </motion.div>
  );
}
