import Sidebar from './Sidebar';
import { Bell, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { usuario } = useAuth();

  return (
    <div className="flex min-h-screen w-screen bg-slate-100">

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-30 h-full transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col lg:ml-60">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa — solo en móvil */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-700"
            >
              <Menu size={22} />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-64 xl:w-80">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar solicitudes, activos..."
                className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-slate-500 hover:text-slate-700">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {usuario?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-700 leading-none">
                  {usuario?.username || 'Usuario'}
                </p>
                <p className="text-xs text-slate-400">
                  {usuario?.rol || 'Sin rol'}
                </p>
              </div>

            </div>
          </div>
        </header>

        {/* Página */}
        <main className="flex-1 p-4 xl:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}