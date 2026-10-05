import React, { useState } from 'react';
import { PanoramaAdminList } from '../components/PanoramaAdminList';
import { PhotoViewer } from '../components/PhotoViewer';
import { getPanoramaNode } from '../utils/panorama';
import { LogOut, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

const SESSION_KEY = 'atria_admin_authenticated';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [previewPanoId, setPreviewPanoId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      setError('Admin authentication is not configured.');
      return;
    }

    if (username.trim() === expectedUsername && password === expectedPassword) {
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch (err) {
        console.warn('Failed to save admin session:', err);
      }
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (err) {
      console.warn('Failed to clear admin session:', err);
    }
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setError(null);
    setPreviewPanoId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="inline-block bg-white p-3 rounded-2xl shadow-md border border-slate-700">
              <img
                src="/atria-logo.png"
                alt="ATRIA Institute of Technology"
                className="h-12 w-auto object-contain mx-auto"
              />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h2>
            <p className="text-xs text-slate-400">
              Sign in to manage panorama names and location aliases.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-950/80 border border-rose-800/80 text-rose-200 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 cursor-pointer mt-2"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <a
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Campus Map</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const selectedNode = previewPanoId ? getPanoramaNode(previewPanoId) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Admin Top Header Bar */}
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-xl border border-slate-700">
            <img src="/atria-logo.png" alt="ATRIA Logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              Atria Campus Map Admin
              <span className="text-[10px] uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                Authenticated Session
              </span>
            </h1>
            <p className="text-xs text-slate-400">Panorama Location Naming & Alias Management Interface</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Admin Naming Interface Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        <PanoramaAdminList
          onSelectPano={(panoId: string) => {
            setPreviewPanoId(panoId);
          }}
        />

        {/* 360° Preview Modal inside Admin if selected */}
        {previewPanoId && selectedNode && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>360° Preview:</span>
                <span className="text-blue-400 font-mono">{previewPanoId}</span>
                <span className="text-slate-400 font-normal">({selectedNode.displayName})</span>
              </h3>
              <button
                onClick={() => setPreviewPanoId(null)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold"
              >
                Close Preview
              </button>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden border border-slate-800">
              <PhotoViewer
                step={{
                  location: selectedNode.displayName,
                  image: selectedNode.imagePath,
                  instruction: `Viewing 360° panorama for ${selectedNode.displayName}`,
                  direction: 'none',
                }}
                stepNumber={1}
                totalSteps={1}
                locationName={selectedNode.displayName}
                onHotspotNavigate={() => {}}
                allowedTargetPanoId={null}
                isRouteGuided={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
