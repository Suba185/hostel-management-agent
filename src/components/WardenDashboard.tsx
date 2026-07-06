import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogOut, ClipboardList, Clock, CheckCircle2, AlertCircle, RefreshCw, Search, Filter, ShieldCheck } from 'lucide-react';
import { Warden, Complaint } from '../types';

interface WardenDashboardProps {
  warden: Warden;
  onLogout: () => void;
}

export default function WardenDashboard({ warden, onLogout }: WardenDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [blockFilter, setBlockFilter] = useState('All');

  const fetchAllComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch('/complaints');
      const data = await response.json();
      if (response.ok && data.success) {
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  // Update complaint status
  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'In Progress' | 'Resolved') => {
    setUpdatingId(id);
    try {
      const response = await fetch('/complaint/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local state smoothly
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      } else {
        alert(result.message || 'Failed to update complaint status.');
      }
    } catch (err) {
      alert('Network error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats calculation
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesBlock = blockFilter === 'All' || c.hostelBlock === blockFilter;

    return matchesSearch && matchesStatus && matchesBlock;
  });

  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <div className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">Warden Control Panel</div>
          <h1 id="welcome-warden-heading" className="font-display text-2xl font-bold text-slate-900">
            Welcome, Warden {warden.name}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 font-sans">
            <span>Staff ID: <strong className="text-slate-700">{warden.wardenId}</strong></span>
            <span>Block Jurisdiction: <strong className="text-slate-700">Block {warden.hostelBlock}</strong></span>
            <span>Email: <strong className="text-slate-700">{warden.email}</strong></span>
          </div>
        </div>

        <div className="flex gap-2 self-start md:self-auto">
          <button
            onClick={fetchAllComplaints}
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Refresh Complaints"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total complaints */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-1">Total Complaints</span>
            <span id="stat-total-complaints" className="text-3xl font-extrabold text-slate-800">{totalCount}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <ClipboardList className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Pending complaints */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-1">Pending</span>
            <span id="stat-pending-complaints" className="text-3xl font-extrabold text-amber-600">{pendingCount}</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </motion.div>

        {/* In Progress complaints */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-1">In Progress</span>
            <span id="stat-inprogress-complaints" className="text-3xl font-extrabold text-blue-600">{inProgressCount}</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
            <AlertCircle className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Resolved complaints */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-1">Resolved</span>
            <span id="stat-resolved-complaints" className="text-3xl font-extrabold text-emerald-600">{resolvedCount}</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Main Complaints Table Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls (Search & Filters) */}
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="font-display text-base font-bold text-slate-800 flex items-center gap-2 mr-auto">
            <ClipboardList className="w-5 h-5 text-emerald-500" />
            <span>Complaint Submissions</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student, reg, desc..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Block Filter */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value)}
                className="bg-transparent border-none text-slate-700 focus:outline-none font-medium"
              >
                <option value="All">All Blocks</option>
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
                <option value="D">Block D</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-slate-700 focus:outline-none font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white">
            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
            <span className="text-sm font-medium">Retrieving student complaint list...</span>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-white">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="text-sm">No student complaints found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-6 py-4">Student Name / Reg</th>
                  <th className="px-6 py-4">Block / Room</th>
                  <th className="px-6 py-4">Complaint Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/55 transition-colors">
                    {/* Student Name */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{c.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.registerNumber}</div>
                    </td>

                    {/* Hostel Block / Room */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">Block {c.hostelBlock}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Room {c.roomNumber || '305'}</div>
                    </td>

                    {/* Complaint Type */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 text-[10px]">
                        {c.complaintType}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-600" title={c.description}>
                        {c.description}
                      </p>
                    </td>

                    {/* Status & Change Dropdown */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {updatingId === c.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                        ) : (
                          <span className={`w-2 h-2 rounded-full ${
                            c.status === 'Pending' ? 'bg-amber-500' : c.status === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`} />
                        )}

                        <select
                          value={c.status}
                          disabled={updatingId === c.id}
                          onChange={(e) => handleStatusChange(c.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold focus:outline-none border border-slate-200 cursor-pointer ${
                            c.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : c.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
