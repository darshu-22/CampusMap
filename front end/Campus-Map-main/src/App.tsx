import { useState, useEffect } from 'react';
import { Header, type TabType } from './components/Header';
import { Home } from './pages/Home';
import { View360Page } from './pages/View360Page';
import { NetworkMapPage } from './pages/NetworkMapPage';
import { AdminPage } from './pages/AdminPage';
import type { RouteStep } from './data/routes';

export interface ActiveRouteInfo {
  path: string[];
  fromId: string;
  toId: string;
  routeSteps: RouteStep[];
  selectedOptionId?: 'lift' | 'stairs';
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeRoute, setActiveRoute] = useState<ActiveRouteInfo | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const normalizedPath = currentPath.replace(/\/$/, '').toLowerCase();
  const isAdminRoute = normalizedPath === '/admin';

  if (isAdminRoute) {
    return <AdminPage />;
  }

  const handleRouteCalculated = (route: ActiveRouteInfo | null) => {
    setActiveRoute(route);
  };

  const handleClearRoute = () => {
    setActiveRoute(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 font-sans antialiased">
      {/* Top Header Navigation */}
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />
      
      {/* Active Tab View Container */}
      <main className="flex-grow pb-16">
        {activeTab === 'home' && (
          <Home
            activeRoute={activeRoute}
            onRouteCalculated={handleRouteCalculated}
            onClearRoute={handleClearRoute}
          />
        )}
        {activeTab === '360' && <View360Page />}
        {activeTab === 'map' && (
          <NetworkMapPage
            fromId={activeRoute?.fromId || ''}
            toId={activeRoute?.toId || ''}
            routePath={activeRoute?.path || []}
            initialPanoId={activeRoute?.fromId || 'maingate.jpeg'}
          />
        )}
      </main>
    </div>
  );
}

export default App;
