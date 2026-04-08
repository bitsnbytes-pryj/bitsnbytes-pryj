'use client';

import { useEffect, useState } from 'react';
import { teamApi } from '@/lib/admin-api';

interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  department: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    bio: '',
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    const response = await teamApi.list({ limit: 50 });
    if (response.success && response.data) {
      setMembers(response.data.items);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (editingMember) {
      await teamApi.update(editingMember.id, formData);
    } else {
      await teamApi.create(formData);
    }
    
    setShowForm(false);
    setEditingMember(null);
    setFormData({ name: '', email: '', role: '', department: '', bio: '', image_url: '', is_active: true });
    loadMembers();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this team member?')) {
      await teamApi.delete(id);
      loadMembers();
    }
  }

  function startEdit(member: TeamMember) {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email || '',
      role: member.role,
      department: member.department || '',
      bio: '',
      image_url: member.image_url || '',
      is_active: member.is_active,
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Team Members</h1>
        <button
          onClick={() => {
            setEditingMember(null);
            setFormData({ name: '', email: '', role: '', department: '', bio: '', image_url: '', is_active: true });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingMember ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="e.g., Tech, Design, Marketing"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-gray-300">Active Member</label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                {editingMember ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{member.name}</h3>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                  {member.department && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {member.department}
                    </span>
                  )}
                </div>
                <span className={`w-2 h-2 rounded-full ${member.is_active ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => startEdit(member)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400">
              No team members found. Add your first team member!
            </div>
          )}
        </div>
      )}
    </div>
  );
}