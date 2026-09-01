import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const onToggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gusto-bg font-sans overflow-hidden relative">
      {showSidebar && (
        <div
          onClick={onToggleSidebar}
          className="fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity"
        />
      )}


      <Sidebar showSidebar={showSidebar} />

      {/* Right Section: Header + Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header onToggleSidebar={onToggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
           <Dashboard />
        </main>
      </div>
    </div>
  );
}