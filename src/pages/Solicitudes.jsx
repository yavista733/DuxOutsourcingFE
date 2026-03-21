import { useEffect, useState } from 'react';
import { Plus, Check, X, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const estadoEstilo = {
  APROBADA: 'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  RECHAZADA: 'bg-red-100 text-red-700',
};

const estadoLabel = {
  APROBADA: 'Aprobada',
  PENDIENTE: 'Pendiente',
  RECHAZADA: 'Rechazada',
};

// IDs de las 3 áreas según tu BD
const AREA_IDS = [1, 2, 3];

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [procesando, setProcesando] = useState(null); // id de solicitud en proceso
  const { isAprobador } = useAuth();

  // Carga solicitudes de todas las áreas en paralelo
  const cargarSolicitudes = async () => {
    setCargando(true);
    try {
      const [resAreas, ...resSolicitudes] = await Promise.all([
        api.get('/api/areas'),
        ...AREA_IDS.map(id => api.get(`/api/solicitudes/area/${id}`))
      ]);
      setAreas(resAreas.data);
      // Junta todas las solicitudes de las 3 áreas
      const todas = resSolicitudes.flatMap(res => res.data);
      // Ordena por id descendente (más recientes primero)
      todas.sort((a, b) => b.id - a.id);
      setSolicitudes(todas);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleAprobar = async (id) => {
    setProcesando(id);
    try {
      await api.post(`/api/solicitudes/${id}/aprobar`);
      await cargarSolicitudes(); // recarga la tabla
    } catch (error) {
      alert('Error al aprobar: ' + (error.response?.data || 'Intenta de nuevo'));
    } finally {
      setProcesando(null);
    }
  };

  const handleRechazar = async (id) => {
    setProcesando(id);
    try {
      await api.post(`/api/solicitudes/${id}/rechazar`);
      await cargarSolicitudes();
    } catch (error) {
      alert('Error al rechazar: ' + (error.response?.data || 'Intenta de nuevo'));
    } finally {
      setProcesando(null);
    }
  };

  // Filtro por estado
  const solicitudesFiltradas = filtroEstado === 'TODOS'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filtroEstado);

  return (
    <Layout>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Solicitudes de Compra</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión y aprobación de solicitudes</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <Plus size={18} />
          Nueva Solicitud
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['TODOS', 'PENDIENTE', 'APROBADA', 'RECHAZADA'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filtroEstado === estado
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {estado === 'TODOS' ? 'Todos' : estadoLabel[estado]}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-400">Cargando solicitudes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">ID</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Descripción</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Área</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Monto</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Estado</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No hay solicitudes registradas
                    </td>
                  </tr>
                ) : (
                  solicitudesFiltradas.map((sol) => (
                    <tr key={sol.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-700">
                        REQ-{String(sol.id).padStart(3, '0')}
                      </td>
                      <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                        {sol.descripcion}
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {sol.area?.nombre || '—'}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-700">
                        S/ {sol.monto?.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoEstilo[sol.estado]}`}>
                          {estadoLabel[sol.estado]}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {sol.estado === 'PENDIENTE' && isAprobador && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAprobar(sol.id)}
                              disabled={procesando === sol.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              <Check size={13} />
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleRechazar(sol.id)}
                              disabled={procesando === sol.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              <X size={13} />
                              Rechazar
                            </button>
                          </div>
                        )}
                        {sol.estado !== 'PENDIENTE' && (
                          <span className="text-slate-300 text-xs">Sin acciones</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nueva Solicitud */}
      {modalAbierto && (
        <ModalNuevaSolicitud
          areas={areas}
          onCerrar={() => setModalAbierto(false)}
          onGuardado={() => {
            setModalAbierto(false);
            cargarSolicitudes();
          }}
        />
      )}
    </Layout>
  );
}

// Modal separado como componente interno
function ModalNuevaSolicitud({ areas, onCerrar, onGuardado }) {
  const [form, setForm] = useState({
    descripcion: '',
    monto: '',
    areaId: '',
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.descripcion || !form.monto || !form.areaId) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setGuardando(true);
    try {
      await api.post('/api/solicitudes', {
        descripcion: form.descripcion,
        monto: parseFloat(form.monto),
        area: { id: parseInt(form.areaId) },
      });
      onGuardado();
    } catch (error) {
      setError('Error al crear la solicitud. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Nueva Solicitud de Compra</h2>
          <button onClick={onCerrar} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Body modal */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Descripción
            </label>
            <input
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej: Laptop Lenovo ThinkPad X1"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Monto (S/)
            </label>
            <input
              type="number"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Área
            </label>
            <select
              name="areaId"
              value={form.areaId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
            >
              <option value="">Selecciona un área</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.nombre} — Saldo: S/ {area.saldoActual?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Botones */}
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
              {guardando ? 'Guardando...' : 'Crear Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}