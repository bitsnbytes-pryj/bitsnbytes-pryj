'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/admin-api';

interface Stats {
  events: { total: number; upcoming: number; published: number };
  team: { total: number; active: number };
  projects: { total: number; published: number; featured: number };
  roles: { total: number; open: number };
  submissions: {
    contacts: { total: number; new: number };
    joinApplications: { total: number; new: number };
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const response = await dashboardApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Events', value: stats?.events.total || 0, icon: '📅', color: 'from-blue-500 to-cyan-500' },
    { label: 'Upcoming Events', value: stats?.events.upcoming || 0, icon: '🗓️', color: 'from-green-500 to-emerald-500' },
    { label: 'Team Members', value: stats?.team.total || 0, icon: '👥', color: 'from-purple-500 to-pink-500' },
    { label: 'Active Members', value: stats?.team.active || 0, icon: '✅', color: 'from-orange-500 to-amber-500' },
    { label: 'Projects', value: stats?.projects.total || 0, icon: '🚀', color: 'from-indigo-500 to-violet-500' },
    { label: 'Open Roles', value: stats?.roles.open || 0, icon: '💼', color: 'from-rose-500 to-red-500' },
    { label: 'New Contacts', value: stats?.submissions.contacts.new || 0, icon: '📩', color: 'from-teal-500 to-cyan-500' },
    { label: 'New Applications', value: stats?.submissions.joinApplications.new || 0, icon: '📝', color: 'from-amber-500 to-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} opacity-20`}></div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/admin/events" className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition">
              <span>📅</span>
              <span className="text-gray-300">Create New Event</span>
            </a>
            <a href="/admin/team" className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition">
              <span>👥</span>
              <span className="text-gray-300">Add Team Member</span>
            </a>
            <a href="/admin/projects" className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition">
              <span>🚀</span>
              <span className="text-gray-300">Add Project</span>
            </a>
            <a href="/admin/submissions" className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition">
              <span>📥</span>
              <span className="text-gray-300">View Submissions</span>
            </a>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <span className="text-gray-300">API Status</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <span className="text-gray-300">Database</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <span className="text-gray-300">Admin Backend</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}