import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Wrench,
  ClipboardList,
  Users,
  Settings,
  Mountain,
  Package,
  Clock,
  AlertTriangle, 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['Admin', 'Supervisor', 'Technician', 'FieldOperator', 'Auditor'],
    },
    {
      path: '/production',
      icon: ClipboardList,
      label: 'Production',
      roles: ['Admin', 'Supervisor', 'FieldOperator'],
    },
    {
      path: '/equipment',
      icon: Wrench,
      label: 'Equipment',
      roles: ['Admin', 'Supervisor', 'Technician', 'FieldOperator'],  // ADDED FieldOperator
    },
    {
      path: '/incidents',  // ADD THIS ENTIRE BLOCK
      icon: AlertTriangle,
      label: 'Incidents',
      roles: ['Admin', 'Supervisor', 'Technician', 'FieldOperator', 'Auditor'],
    },
    {
      path: '/reports',
      icon: FileText,
      label: 'Reports',
      roles: ['Admin', 'Supervisor', 'Auditor'],
    },
    {
      path: '/minerals',
      icon: Package,
      label: 'Minerals',
      roles: ['Admin', 'Supervisor'],
    },
    {
      path: '/shifts',
      icon: Clock,
      label: 'Shifts',
      roles: ['Admin', 'Supervisor'],
    },
    {
      path: '/users',
      icon: Users,
      label: 'Users',
      roles: ['Admin', 'Technician'],  // CHANGED: Added Technician
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      roles: ['Admin', 'Supervisor', 'Technician', 'FieldOperator', 'Auditor'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen bg-gray-900 text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Mountain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Mining System</h1>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              {user?.userName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.userName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;