import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingCart, Monitor,
  PieChart, Settings, LogOut, X
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const { logout, isAdmin, isAprobador, usuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navegación con control de roles
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio', visible: true },
    { to: '/solicitudes', icon: ShoppingCart, label: 'Solicitudes', visible: true },
    { to: '/activos', icon: Monitor, label: 'Activos TI', visible: true },
    // Solo ADMIN y APROBADOR ven Áreas y Presupuesto
    { to: '/areas', icon: PieChart, label: 'Áreas y Presupuesto', visible: isAprobador },
    // Solo ADMIN ve Configuración
    { to: '/configuracion', icon: Settings, label: 'Configuración', visible: isAdmin },
  ];

  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">DUX</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">DUX</p>
            <p className="text-slate-400 text-xs">Outsourcing</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navegación — solo muestra items visibles según rol */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems
          .filter(item => item.visible)
          .map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
      </nav>

      {/* Usuario actual + Logout */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-1">
        <div className="px-3 py-2 mb-1">
          <p className="text-white text-xs font-medium">{usuario?.username}</p>
          <p className="text-slate-500 text-xs">{usuario?.rol}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
        <p className="text-slate-600 text-xs text-center pt-2">SICP v1.0.0</p>
      </div>
    </aside>
  );
}