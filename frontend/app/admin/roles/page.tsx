'use client';

import { useEffect, useState } from 'react';
import { rolesApi } from '@/lib/admin-api';

interface Role {
  id: string;
  title: string;
  type: string;
  status: string;
  vacancies: number | null;
  is_featured: boolean;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'volunteer',
    status: 'draft',
    description: '',
    requirements: [] as string[],
    responsibilities: [] as string[],
    is_featured: false,
  });

  useEffect(() => { loadRoles(); }, []);

  async function loadRoles() {
    setLoading(true);
    const response = await rolesApi.list({ limit: 50 });
    if (response.success && response.data) setRoles(response.data.items);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingRole) await rolesApi.update(editingRole.id, formData);
    else await rolesApi.create(formData);
    setShowForm(false);
    setEditingRole(null);
    setFormData({ title: '', type: 'volunteer', status: 'draft', description: '', requirements: [], responsibilities: [], is_featured: false });
    loadRoles();
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this role?')) {
      await rolesApi.delete(id);
      loadRoles();
    }
  }

  function startEdit(role: Role) {
    setEditingRole(role);
    setFormData({
      title: role.title,
      type: role.type,
      status: role.status,
      description: '',
      requirements: [],
      responsibilities: [],
      is_featured: role.is_featured,
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Roles</h1>
        <button onClick={() => { setEditingRole(null); setFormData({ title: '', type: 'volunteer', status: 'draft', description: '', requirements: [], responsibilities: [], is_featured: false }); setShowForm(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">+ New Role</button>
      </div>

      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingRole ? 'Edit Role' : 'Create Role'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="e.g., Frontend Developer" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option value="volunteer">Volunteer</option>
                  <option value="internship">Internship</option>
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="rounded" />
              <label htmlFor="is_featured" className="text-gray-300">Featured Role</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{editingRole ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div> : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{role.title}</td>
                  <td className="px-4 py-3 text-gray-400">{role.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${role.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{role.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(role)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(role.id)} className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-sm">Delete</button>
                    </div>
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