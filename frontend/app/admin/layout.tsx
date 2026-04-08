'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authApi, isTokenExpired } from '@/lib/admin-api';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/events', label: 'Events', icon: '📅' },
  { href: '/admin/team', label: 'Team', icon: '👥' },
  { href: '/admin/projects', label: 'Projects', icon: '🚀' },
  { href: '/admin/roles', label: 'Roles', icon: '💼' },
  { href: '/admin/submissions', label: 'Submissions', icon: '📥' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (!token || isTokenExpired()) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } else if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, [router, pathname]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/admin/login');
  };

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Bits&Bytes</h1>
          <p className="text-sm text-gray-400">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-gray-400 text-xs">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-gray-800/80 backdrop-blur border-b border-gray-700">
          <div className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-white">
              {navItems.find((item) => item.href === pathname)?.label || 'Admin'}
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}