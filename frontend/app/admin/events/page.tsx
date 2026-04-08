'use client';

import { useEffect, useState } from 'react';
import { eventsApi } from '@/lib/admin-api';

interface Event {
  id: string;
  title: string;
  description: string | null;
  venue: string | null;
  event_date: string;
  status: string;
  is_featured: boolean;
  created_at: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    event_date: '',
    status: 'draft',
    is_featured: false,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    const response = await eventsApi.list({ limit: 50 });
    if (response.success && response.data) {
      setEvents(response.data.items);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (editingEvent) {
      await eventsApi.update(editingEvent.id, formData);
    } else {
      await eventsApi.create(formData);
    }
    
    setShowForm(false);
    setEditingEvent(null);
    setFormData({ title: '', description: '', venue: '', event_date: '', status: 'draft', is_featured: false });
    loadEvents();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      await eventsApi.delete(id);
      loadEvents();
    }
  }

  function startEdit(event: Event) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      venue: event.venue || '',
      event_date: event.event_date ? event.event_date.split('T')[0] : '',
      status: event.status,
      is_featured: event.is_featured,
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <button
          onClick={() => {
            setEditingEvent(null);
            setFormData({ title: '', description: '', venue: '', event_date: '', status: 'draft', is_featured: false });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + New Event
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingEvent ? 'Edit Event' : 'Create Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Event Date</label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="is_featured" className="text-gray-300">Featured Event</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                {editingEvent ? 'Update' : 'Create'}
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
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Venue</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{event.title}</td>
                  <td className="px-4 py-3 text-gray-400">{event.venue || '-'}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      event.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(event)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No events found. Create your first event!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}