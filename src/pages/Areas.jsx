import { useEffect, useState } from 'react';
import { X, Pencil, TrendingUp, TrendingDown } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

export default function Areas() {
  const [areas, setAreas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalArea, setModalArea] = useState(null); // área seleccionada para editar

  const cargarAreas = async () => {
    setCargando(true);
    try {
      const res = await api.get('/api/areas');
      setAreas(res.data);
    } catch (error) {
      console.error('Error cargando áreas:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAreas();
  }, []);

  // Calcula porcentaje gastado
  const porcentajeGastado = (area) => {
    if (!area.presupuestoAnual || area.presupuestoAnual === 0) return 0;
    const gastado = area.presupuestoAnual - area.saldoActual;
    return Math.min(Math.round((gastado / area.presupuestoAnual) * 100), 100);
  };

  const colorBarra = (porcentaje) => {
    if (porcentaje >= 80) return 'bg-red-500';
    if (porcentaje >= 50) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <Layout>
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Áreas y Presupuesto</h1>
        <p className="text-slate-500 text-sm mt-1">Control de saldos por área</p>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Cargando áreas...</p>
        </div>
      ) : (
        <>
          {/* Tarjetas de áreas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {areas.map(area => {
              const gastado = area.presupuestoAnual - area.saldoActual;
              const porcentaje = porcentajeGastado(area);

              return (
                <div key={area.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                  {/* Header tarjeta */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-bold text-slate-800 text-lg">{area.nombre}</h2>
                      <p className="text-slate-400 text-xs">Presupuesto anual</p>
                    </div>
                    <button
                      onClick={() => setModalArea(area)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-medium transition-colors"
                    >
                      <Pencil size={13} />
                      Editar
                    </button>
                  </div>

                  {/* Monto presupuesto */}
                  <p className="text-2xl font-bold text-slate-800 mb-1">
                    S/ {area.presupuestoAnual?.toLocaleString()}
                  </p>

                  {/* Barra de progreso */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all ${colorBarra(porcentaje)}`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>

                  {/* Gastado vs Restante */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingDown size={14} />
                      <span className="font-medium">S/ {gastado.toLocaleString()}</span>
                      <span className="text-slate-400 text-xs">gastado</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <TrendingUp size={14} />
                      <span className="font-medium">S/ {area.saldoActual?.toLocaleString()}</span>
                      <span className="text-slate-400 text-xs">disponible</span>
                    </div>
                  </div>

                  {/* Porcentaje */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400 text-right">
                      <span className={`font-semibold ${
                        porcentaje >= 80 ? 'text-red-500' :
                        porcentaje >= 50 ? 'text-yellow-500' : 'text-emerald-600'
                      }`}>{porcentaje}%</span> utilizado
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabla resumen */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700">Resumen de Presupuestos</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Área</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Presupuesto Anual</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Gastado</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Saldo Disponible</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">% Utilizado</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map(area => {
                    const gastado = area.presupuestoAnual - area.saldoActual;
                    const porcentaje = porcentajeGastado(area);
                    return (
                      <tr key={area.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-semibold text-slate-700">{area.nombre}</td>
                        <td className="px-5 py-3 text-slate-600">
                          S/ {area.presupuestoAnual?.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-red-500 font-medium">
                          S/ {gastado.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-emerald-600 font-medium">
                          S/ {area.saldoActual?.toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${colorBarra(porcentaje)}`}
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${
                              porcentaje >= 80 ? 'text-red-500' :
                              porcentaje >= 50 ? 'text-yellow-500' : 'text-emerald-600'
                            }`}>{porcentaje}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal editar presupuesto */}
      {modalArea && (
        <ModalEditarArea
          area={modalArea}
          onCerrar={() => setModalArea(null)}
          onGuardado={() => {
            setModalArea(null);
            cargarAreas();
          }}
        />
      )}
    </Layout>
  );
}

function ModalEditarArea({ area, onCerrar, onGuardado }) {
  const [presupuesto, setPresupuesto] = useState(area.presupuestoAnual);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!presupuesto || presupuesto <= 0) {
      setError('El presupuesto debe ser mayor a 0.');
      return;
    }
    setGuardando(true);
    try {
      await api.put(`/api/areas/${area.id}`, {
        nombre: area.nombre,
        presupuestoAnual: parseFloat(presupuesto),
        saldoActual: area.saldoActual,
      });
      onGuardado();
    } catch (error) {
      setError('Error al actualizar. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Editar Presupuesto — {area.nombre}</h2>
          <button onClick={onCerrar} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Presupuesto Anual (S/)
            </label>
            <input
              type="number"
              value={presupuesto}
              onChange={(e) => { setPresupuesto(e.target.value); setError(''); }}
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-500">
            <p>Saldo actual: <span className="font-semibold text-emerald-600">S/ {area.saldoActual?.toLocaleString()}</span></p>
            <p className="text-xs mt-1 text-slate-400">El saldo disponible no se modifica manualmente — se actualiza automáticamente con las aprobaciones.</p>
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
              {guardando ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}