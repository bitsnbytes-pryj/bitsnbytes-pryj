'use client';

import { useEffect, useState } from 'react';
import { projectsApi } from '@/lib/admin-api';

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  is_featured: boolean;
  technologies: string[];
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    is_featured: false,
    technologies: [] as string[],
    github_url: '',
    demo_url: '',
  });

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    setLoading(true);
    const response = await projectsApi.list({ limit: 50 });
    if (response.success && response.data) setProjects(response.data.items);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingProject) await projectsApi.update(editingProject.id, formData);
    else await projectsApi.create(formData);
    setShowForm(false);
    setEditingProject(null);
    setFormData({ title: '', description: '', status: 'draft', is_featured: false, technologies: [], github_url: '', demo_url: '' });
    loadProjects();
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this project?')) {
      await projectsApi.delete(id);
      loadProjects();
    }
  }

  function startEdit(project: Project) {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      status: project.status,
      is_featured: project.is_featured,
      technologies: project.technologies || [],
      github_url: '',
      demo_url: '',
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button onClick={() => { setEditingProject(null); setFormData({ title: '', description: '', status: 'draft', is_featured: false, technologies: [], github_url: '', demo_url: '' }); setShowForm(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">+ New Project</button>
      </div>

      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingProject ? 'Edit Project' : 'Create Project'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="rounded" />
              <label htmlFor="is_featured" className="text-gray-300">Featured Project</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{editingProject ? 'Update' : 'Create'}</button>
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{project.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${project.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{project.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(project)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-sm">Delete</button>
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