'use client';

import { useEffect, useState } from 'react';
import { submissionsApi } from '@/lib/admin-api';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface JoinApp {
  id: string;
  name: string;
  email: string;
  college: string | null;
  status: string;
  created_at: string;
}

export default function AdminSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'join'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [joinApps, setJoinApps] = useState<JoinApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    if (activeTab === 'contacts') {
      const response = await submissionsApi.contacts({ limit: 50 });
      if (response.success && response.data) setContacts(response.data.items);
    } else {
      const response = await submissionsApi.joinApplications({ limit: 50 });
      if (response.success && response.data) setJoinApps(response.data.items);
    }
    setLoading(false);
  }

  async function updateContactStatus(id: string, status: string) {
    await submissionsApi.updateContactStatus(id, status);
    loadData();
  }

  async function updateJoinStatus(id: string, status: string) {
    await submissionsApi.updateJoinStatus(id, status);
    loadData();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Submissions</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 rounded-lg transition ${activeTab === 'contacts' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Contact Forms
        </button>
        <button
          onClick={() => setActiveTab('join')}
          className={`px-4 py-2 rounded-lg transition ${activeTab === 'join' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Join Applications
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : activeTab === 'contacts' ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{contact.name}</td>
                  <td className="px-4 py-3 text-gray-400">{contact.email}</td>
                  <td className="px-4 py-3 text-gray-400">{contact.subject || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      contact.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                      contact.status === 'read' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={contact.status}
                      onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">College</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {joinApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{app.name}</td>
                  <td className="px-4 py-3 text-gray-400">{app.email}</td>
                  <td className="px-4 py-3 text-gray-400">{app.college || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      app.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                      app.status === 'reviewed' ? 'bg-yellow-500/20 text-yellow-400' :
                      app.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateJoinStatus(app.id, e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}