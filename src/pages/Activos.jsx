import { useEffect, useState } from 'react';
import { Plus, X, Monitor, Package } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

const estadoEstilo = {
  DISPONIBLE: 'bg-emerald-100 text-emerald-700',
  ASIGNADO: 'bg-blue-100 text-blue-700',
  MANTENIMIENTO: 'bg-yellow-100 text-yellow-700',
};

const tipoIcono = {
  HARDWARE: <Monitor size={16} className="text-slate-500" />,
  SOFTWARE: <Package size={16} className="text-slate-500" />,
};

const AREA_IDS = [1, 2, 3];
const AREA_NOMBRES = { 1: 'TI', 2: 'RRHH', 3: 'OPERACIONES' };

export default function Activos() {
  const [activos, setActivos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  const cargarActivos = async () => {
    setCargando(true);
    try {
      const [resAreas, ...resActivos] = await Promise.all([
        api.get('/api/areas'),
        ...AREA_IDS.map(id => api.get(`/api/activos/area/${id}`))
      ]);
      setAreas(resAreas.data);
      const todos = resActivos.flatMap(res => res.data);
      todos.sort((a, b) => b.id - a.id);
      setActivos(todos);
    } catch (error) {
      console.error('Error cargando activos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarActivos();
  }, []);

  const activosFiltrados = filtroTipo === 'TODOS'
    ? activos
    : activos.filter(a => a.tipo === filtroTipo);

  // Contadores para las tarjetas
  const totalHardware = activos.filter(a => a.tipo === 'HARDWARE').length;
  const totalSoftware = activos.filter(a => a.tipo === 'SOFTWARE').length;
  const totalDisponible = activos.filter(a => a.estado === 'DISPONIBLE').length;

  return (
    <Layout>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Activos TI</h1>
          <p className="text-slate-500 text-sm mt-1">Inventario de hardware y software</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <Plus size={18} />
          Nuevo Activo
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm">Total Activos</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{activos.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm">Hardware / Software</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {totalHardware} / {totalSoftware}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm">Disponibles</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{totalDisponible}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['TODOS', 'HARDWARE', 'SOFTWARE'].map(tipo => (
          <button
            key={tipo}
            onClick={() => setFiltroTipo(tipo)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filtroTipo === tipo
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tipo === 'TODOS' ? 'Todos' : tipo}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-400">Cargando activos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">ID</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Nombre</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Código Serie</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Tipo</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Área</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {activosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No hay activos registrados
                    </td>
                  </tr>
                ) : (
                  activosFiltrados.map((activo) => (
                    <tr key={activo.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-700">
                        ACT-{String(activo.id).padStart(3, '0')}
                      </td>
                      <td className="px-5 py-3 text-slate-700 font-medium">
                        {activo.nombre}
                      </td>
                      <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                        {activo.codigoSerie || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          {tipoIcono[activo.tipo]}
                          {activo.tipo}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {activo.area?.nombre || AREA_NOMBRES[activo.area?.id] || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoEstilo[activo.estado]}`}>
                          {activo.estado}
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

      {/* Modal */}
      {modalAbierto && (
        <ModalNuevoActivo
          areas={areas}
          onCerrar={() => setModalAbierto(false)}
          onGuardado={() => {
            setModalAbierto(false);
            cargarActivos();
          }}
        />
      )}
    </Layout>
  );
}

function ModalNuevoActivo({ areas, onCerrar, onGuardado }) {
  const [form, setForm] = useState({
    nombre: '',
    codigoSerie: '',
    tipo: 'HARDWARE',
    estado: 'DISPONIBLE',
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
    if (!form.nombre || !form.areaId) {
      setError('Nombre y área son obligatorios.');
      return;
    }
    setGuardando(true);
    try {
      await api.post('/api/activos', {
        nombre: form.nombre,
        codigoSerie: form.codigoSerie || null,
        tipo: form.tipo,
        estado: form.estado,
        area: { id: parseInt(form.areaId) },
      });
      onGuardado();
    } catch (error) {
      setError('Error al crear el activo. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Nuevo Activo TI</h2>
          <button onClick={onCerrar} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Laptop Dell XPS"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Código de Serie <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="codigoSerie"
              value={form.codigoSerie}
              onChange={handleChange}
              placeholder="Ej: DELL-001"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="HARDWARE">HARDWARE</option>
                <option value="SOFTWARE">SOFTWARE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="ASIGNADO">ASIGNADO</option>
                <option value="MANTENIMIENTO">MANTENIMIENTO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Área</label>
            <select
              name="areaId"
              value={form.areaId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="">Selecciona un área</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.nombre}</option>
              ))}
            </select>
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
              {guardando ? 'Guardando...' : 'Registrar Activo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}