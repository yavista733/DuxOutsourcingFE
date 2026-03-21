import { useEffect, useState } from 'react';
import { Plus, X, Users, ShieldCheck, UserCheck } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Navigate } from 'react-router-dom';

export default function Configuracion() {
  const { isAdmin } = useAuth();

  // Si no es admin, redirige al dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const [usuarios, setUsuarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resUsuarios, resAreas] = await Promise.all([
        api.get('/api/usuarios'),
        api.get('/api/areas'),
      ]);
      setUsuarios(resUsuarios.data);
      setAreas(resAreas.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const rolEstilo = {
    ADMIN: 'bg-purple-100 text-purple-700',
    APROBADOR: 'bg-blue-100 text-blue-700',
    SOLICITANTE: 'bg-slate-100 text-slate-600',
  };

  const rolIcono = {
    ADMIN: <ShieldCheck size={13} />,
    APROBADOR: <UserCheck size={13} />,
    SOLICITANTE: <Users size={13} />,
  };

  return (
    <Layout>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Configuración</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de usuarios del sistema</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <Plus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm">Total Usuarios</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{usuarios.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm">Activos</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {usuarios.filter(u => u.activo).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm">Administradores</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {usuarios.filter(u => u.rol?.nombre === 'ADMIN').length}
          </p>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-400">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Usuario</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Nombre Completo</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Área</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Rol</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-700 text-xs font-bold">
                              {u.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-semibold text-slate-700">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{u.nombreCompleto || '—'}</td>
                      <td className="px-5 py-3 text-slate-500">{u.email || '—'}</td>
                      <td className="px-5 py-3 text-slate-500">{u.area?.nombre || '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${rolEstilo[u.rol?.nombre] || 'bg-slate-100 text-slate-600'}`}>
                          {rolIcono[u.rol?.nombre]}
                          {u.rol?.nombre || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal crear usuario */}
      {modalAbierto && (
        <ModalNuevoUsuario
          areas={areas}
          onCerrar={() => setModalAbierto(false)}
          onGuardado={() => {
            setModalAbierto(false);
            cargarDatos();
          }}
        />
      )}
    </Layout>
  );
}

function ModalNuevoUsuario({ areas, onCerrar, onGuardado }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    nombreCompleto: '',
    email: '',
    rolId: '',
    areaId: '',
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'APROBADOR' },
    { id: 3, nombre: 'SOLICITANTE' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.nombreCompleto || !form.email || !form.rolId || !form.areaId) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setGuardando(true);
    try {
      await api.post('/api/usuarios', {
        username: form.username,
        password: form.password,
        nombreCompleto: form.nombreCompleto,
        email: form.email,
        rol: { id: parseInt(form.rolId) },
        area: { id: parseInt(form.areaId) },
      });
      onGuardado();
    } catch (err) {
      if (err.response?.status === 409) {
        setError('El usuario o email ya existe.');
      } else {
        setError('Error al crear el usuario. Intenta de nuevo.');
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Nuevo Usuario</h2>
          <button onClick={onCerrar} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Usuario</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Ej: jperez"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre Completo</label>
            <input
              type="text"
              name="nombreCompleto"
              value={form.nombreCompleto}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ej: jperez@dux.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Rol</label>
              <select
                name="rolId"
                value={form.rolId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="">Selecciona</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Área</label>
              <select
                name="areaId"
                value={form.areaId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="">Selecciona</option>
                {areas.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {guardando ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}