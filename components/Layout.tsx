import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  History, 
  Siren, 
  LogOut, 
  GraduationCap,
  Settings
} from 'lucide-react';

export const Layout = ({ children }: React.PropsWithChildren) => {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <>{children}</>;

  const isActive = (path: string) => location.pathname === path ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600';

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col fixed h-full shadow-xl z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-indigo-700">
          <GraduationCap className="w-8 h-8 text-indigo-300" />
          <h1 className="text-xl font-bold tracking-tight">BORO</h1>
        </div>
        
        <div className="p-4">
          <div className="mb-6 px-2">
            <p className="text-xs text-indigo-300 uppercase tracking-wider font-semibold">Logged in as</p>
            <p className="font-medium truncate">{user.name}</p>
            <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
              user.role === 'admin' ? 'bg-pink-600' : 
              user.role === 'dosen' ? 'bg-emerald-600' : 'bg-blue-600'
            }`}>
              {user.role.toUpperCase()}
            </span>
          </div>

          <nav className="space-y-1">
            <Link to="/home" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/home')}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link to="/rooms" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/rooms')}`}>
              <CalendarDays size={20} />
              <span>{user.role === 'admin' ? 'Manage Rooms' : 'Book Room'}</span>
            </Link>

            {user.role === 'dosen' && (
              <Link to="/emergency" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/emergency')}`}>
                <Siren size={20} className="text-red-400" />
                <span>Emergency Booking</span>
              </Link>
            )}

            <Link to="/history" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/history')}`}>
              <History size={20} />
              <span>{user.role === 'admin' ? 'Approvals' : 'History'}</span>
            </Link>

            {user.role === 'admin' && (
              <Link to="/admin" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin')}`}>
                <Settings size={20} />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-indigo-800">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};