import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Bot, AlertTriangle, ListFilter, ClipboardList, Send, Loader2, Sparkles, Plus, Clock, HelpCircle } from 'lucide-react';
import { Student, Complaint, ChatMessage } from '../types';

interface StudentDashboardProps {
  student: Student;
  onLogout: () => void;
}

export default function StudentDashboard({ student, onLogout }: StudentDashboardProps) {
  // Navigation tabs: 'complaints' or 'ai-chat'
  const [activeTab, setActiveTab] = useState<'complaints' | 'ai-chat'>('complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  
  // Complaint form modal/state
  const [showForm, setShowForm] = useState(false);
  const [complaintType, setComplaintType] = useState('Maintenance');
  const [description, setDescription] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // AI Chat Bot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: `Hello ${student.name}! I am your Hostel Management Assistant. Feel free to ask me anything about hostel rules, mess timings, outpass/leave requests, maintenance policies, facilities, or general questions!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const SUGGESTED_QUESTIONS = [
    'Hostel rules',
    'How to submit a complaint?',
    'Mess timings',
    'Wi-Fi issue',
    'Leave or Outpass rules',
  ];

  // Fetch complaints
  const fetchMyComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const response = await fetch(`/complaints?studentEmail=${encodeURIComponent(student.email)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, [student.email]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Submit Complaint form
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setFormError('Please enter a description for your complaint.');
      return;
    }

    setSubmittingComplaint(true);
    setFormError('');
    setFormSuccess('');

    try {
      const response = await fetch('/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          registerNumber: student.registerNumber,
          hostelBlock: student.hostelBlock,
          complaintType,
          description,
          studentEmail: student.email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormSuccess('Complaint submitted successfully!');
        setDescription('');
        // Refresh complaints list
        fetchMyComplaints();
        setTimeout(() => {
          setShowForm(false);
          setFormSuccess('');
        }, 1500);
      } else {
        setFormError(result.message || 'Failed to submit complaint.');
      }
    } catch (err) {
      setFormError('Network error. Failed to submit complaint.');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  // Chat message sending
  const handleSendChat = async (textToSend?: string) => {
    const message = textToSend || userInput;
    if (!message.trim()) return;

    if (!textToSend) {
      setUserInput('');
    }

    // Add user message to chat list
    const userMsg: ChatMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Track message history for context
    const currentHistory = [...chatMessages];
    
    setChatMessages((prev) => [...prev, userMsg]);
    setSendingChat(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: currentHistory.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: result.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: result.message || 'Sorry, I am experiencing difficulties. Please configure your GEMINI_API_KEY.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Connection failed. Please ensure the server is running and the Gemini API is correctly integrated.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase mb-1">Student Portal</div>
          <h1 id="welcome-student-heading" className="font-display text-2xl font-bold text-slate-900">
            Welcome, {student.name}!
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 font-sans">
            <span>Reg No: <strong className="text-slate-700">{student.registerNumber}</strong></span>
            <span>Block: <strong className="text-slate-700">Block {student.hostelBlock}</strong></span>
            <span>Room No: <strong className="text-slate-700">{student.roomNumber}</strong></span>
            <span>Dept: <strong className="text-slate-700">{student.department} (Yr {student.year})</strong></span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-5 py-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'complaints'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Complaints & Maintenance</span>
        </button>
        <button
          onClick={() => setActiveTab('ai-chat')}
          className={`px-5 py-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'ai-chat'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="flex items-center gap-1">
            AI Chat Assistant
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </span>
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'complaints' ? (
          <motion.div
            key="complaints"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-indigo-500" />
                <span>My Logged Complaints</span>
              </h2>
              <button
                id="btn-new-complaint"
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Complaint</span>
              </button>
            </div>

            {/* Complaint Form Modal Dialog */}
            {showForm && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-lg w-full relative"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-lg font-bold text-slate-900">New Complaint Form</h3>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {formError && (
                    <div id="complaint-error" className="p-3 mb-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div id="complaint-success" className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
                      {formSuccess}
                    </div>
                  )}

                  <form id="complaint-form" onSubmit={handleComplaintSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Complaint Type *</label>
                      <select
                        id="form-complaint-type"
                        value={complaintType}
                        onChange={(e) => setComplaintType(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-800 bg-slate-50/50"
                      >
                        <option value="Maintenance">Maintenance (Plumbing / Carpenter / Electrical)</option>
                        <option value="Mess / Food">Mess / Food Quality</option>
                        <option value="Wi-Fi / Internet">Wi-Fi & Internet Connectivity</option>
                        <option value="Water Problem">Water Supply / Shortage</option>
                        <option value="Housekeeping">Housekeeping / Cleaning</option>
                        <option value="Security / General">Security / Code of Conduct / Noise</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Complaint Description *</label>
                      <textarea
                        id="form-complaint-desc"
                        rows={4}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setFormError('');
                        }}
                        required
                        placeholder="Provide details about the issue. Include location, specific problem, and urgency..."
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-800 bg-slate-50/50 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        id="btn-submit-complaint"
                        type="submit"
                        disabled={submittingComplaint}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-70"
                      >
                        {submittingComplaint ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Complaint</span>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Complaints list */}
            {loadingComplaints ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                <span className="text-sm font-medium">Loading your complaints...</span>
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl p-8">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-slate-800 text-lg mb-1">No Complaints Filed Yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  If you have issues with your room maintenance, electrical fittings, water supply, or internet, file a complaint to notify the warden.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 rounded-xl transition-all cursor-pointer"
                >
                  Create My First Complaint
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {complaints.map((c) => (
                  <motion.div
                    key={c.id}
                    layoutId={`complaint-${c.id}`}
                    className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {c.complaintType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 font-medium font-sans mb-1">{c.description}</p>
                      <span className="text-xs text-slate-400 font-medium">ID: <span className="font-mono">{c.id}</span></span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${
                          c.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : c.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'Pending' ? 'bg-amber-500' : c.status === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'
                        }`} />
                        {c.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="ai-chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Guide column (suggested prompts) */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                <h3 className="font-display font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  <span>Topic Prompts</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
                  The AI assistant is configured to answer hostel-related queries. Click a suggested question below to ask instantly:
                </p>

                <div className="flex flex-col gap-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!sendingChat) handleSendChat(q);
                      }}
                      className="text-left text-xs text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all font-medium font-sans cursor-pointer"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 flex flex-col h-[550px] bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              {/* Bot Header */}
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-100">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-800">Hostel AI Agent</h4>
                    <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Online & Guided by rules
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-md font-medium font-sans">
                  Gemini-3.5-Flash
                </span>
              </div>

              {/* Chat Bubbles */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-sans relative ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/60 shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1.5 ${
                          msg.sender === 'user' ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                {sendingChat && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-500 border border-slate-200/60 rounded-2xl rounded-bl-none px-4 py-3 text-xs font-sans flex items-center gap-2 shadow-sm">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                      <span>Gemini is composing a response...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                  <input
                    id="chat-user-input"
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendChat();
                    }}
                    disabled={sendingChat}
                    placeholder="Ask about curfew rules, mess timings, complaints, leave forms..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50/50"
                  />
                  <button
                    id="btn-send-chat"
                    onClick={() => handleSendChat()}
                    disabled={sendingChat || !userInput.trim()}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-sm shadow-indigo-100 flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
