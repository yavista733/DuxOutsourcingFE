import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DollarSign, TrendingUp, Clock, Monitor } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

const KpiCard = ({ titulo, valor, icono: Icono, colorIcono, colorFondo }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-sm mb-1">{titulo}</p>
      <p className="text-2xl font-bold text-slate-800">{valor}</p>
    </div>
    <div className={`w-12 h-12 rounded-xl ${colorFondo} flex items-center justify-center`}>
      <Icono size={22} className={colorIcono} />
    </div>
  </div>
);

const estadoBadge = {
  APROBADA: 'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  RECHAZADA: 'bg-red-100 text-red-700',
};

const estadoLabel = {
  APROBADA: 'Aprobada',
  PENDIENTE: 'Pendiente',
  RECHAZADA: 'Rechazada',
};

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [grafico, setGrafico] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError('');
      try {
        const [resKpis, resGrafico, resSolicitudes] = await Promise.all([
          api.get('/api/dashboard/kpis'),
          api.get('/api/dashboard/grafico-areas'),
          api.get('/api/solicitudes/recientes'),
        ]);
        setKpis(resKpis.data);
        setGrafico(resGrafico.data);
        setSolicitudes(resSolicitudes.data);
      } catch (err) {
        console.error('Error cargando dashboard:', err);
        setError('No se pudieron cargar los datos. Verifica que el backend esté corriendo.');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <Layout>
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Sistema de Control Presupuestario y Activos TI
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Cargando datos...</p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <KpiCard
              titulo="Presupuesto Total"
              valor={`S/ ${kpis?.presupuestoTotal?.toLocaleString() || 0}`}
              icono={DollarSign}
              colorIcono="text-blue-600"
              colorFondo="bg-blue-100"
            />
            <KpiCard
              titulo="Saldo Restante"
              valor={`S/ ${kpis?.saldoRestante?.toLocaleString() || 0}`}
              icono={TrendingUp}
              colorIcono="text-emerald-600"
              colorFondo="bg-emerald-100"
            />
            <KpiCard
              titulo="Solicitudes Pendientes"
              valor={kpis?.solicitudesPendientes ?? 0}
              icono={Clock}
              colorIcono="text-yellow-600"
              colorFondo="bg-yellow-100"
            />
            <KpiCard
              titulo="Activos TI Activos"
              valor={kpis?.activosActivos ?? 0}
              icono={Monitor}
              colorIcono="text-slate-500"
              colorFondo="bg-slate-100"
            />
          </div>

          {/* Gráfico */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 mb-6">
            <h2 className="font-semibold text-slate-700 mb-4">
              Presupuesto Gastado vs Restante por Área
            </h2>
            {grafico.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">
                Sin datos de áreas disponibles
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={grafico}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 13, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value) => `S/ ${value.toLocaleString()}`}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="gastado" name="Gastado" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="restante" name="Restante" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Tabla solicitudes recientes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700">
                Solicitudes Recientes
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">ID</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Descripción</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Área</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Monto</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400">
                        No hay solicitudes recientes
                      </td>
                    </tr>
                  ) : (
                    solicitudes.map((sol) => (
                      <tr
                        key={sol.id}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-3 font-semibold text-slate-700">
                          REQ-{String(sol.id).padStart(3, '0')}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {sol.descripcion}
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {sol.area?.nombre || '—'}
                        </td>
                        <td className="px-5 py-3 font-medium text-slate-700">
                          S/ {sol.monto?.toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoBadge[sol.estado]}`}>
                            {estadoLabel[sol.estado]}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
