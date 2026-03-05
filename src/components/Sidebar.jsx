import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingCart, Monitor,
  PieChart, Settings, LogOut, X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/solicitudes', icon: ShoppingCart, label: 'Solicitudes' },
  { to: '/activos', icon: Monitor, label: 'Activos TI' },
  { to: '/areas', icon: PieChart, label: 'Áreas y Presupuesto' },
  { to: '/configuracion', icon: Settings, label: 'Configuración' },
];

export default function Sidebar({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col fixed left-0 top-0">
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
        {/* Botón cerrar en móvil */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
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

      {/* Logout + versión */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-1">
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