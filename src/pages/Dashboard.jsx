import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Clock, Monitor } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

// Badges de estado
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

// Tarjetas KPI
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

export default function Dashboard() {
  const [areas, setAreas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resAreas, resSolicitudes] = await Promise.all([
          api.get('/api/areas'),
          api.get('/api/solicitudes/area/1'), // área 1 = TI por defecto
        ]);
        setAreas(resAreas.data);
        setSolicitudes(resSolicitudes.data.slice(0, 6)); // últimas 6
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // Calcular KPIs desde las áreas
  const presupuestoTotal = areas.reduce((sum, a) => sum + (a.presupuestoAnual || 0), 0);
  const saldoTotal = areas.reduce((sum, a) => sum + (a.saldoActual || 0), 0);
  const pendientes = solicitudes.filter(s => s.estado === 'PENDIENTE').length;

  // Datos para el gráfico
  const datosGrafico = areas.map(area => ({
    nombre: area.nombre,
    Gastado: parseFloat(((area.presupuestoAnual - area.saldoActual) || 0).toFixed(2)),
    Restante: parseFloat((area.saldoActual || 0).toFixed(2)),
  }));

  return (
    <Layout>
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Sistema de Control Presupuestario y Activos TI</p>
      </div>

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
              valor={`S/ ${presupuestoTotal.toLocaleString()}`}
              icono={DollarSign}
              colorIcono="text-blue-600"
              colorFondo="bg-blue-100"
            />
            <KpiCard
              titulo="Saldo Restante"
              valor={`S/ ${saldoTotal.toLocaleString()}`}
              icono={TrendingUp}
              colorIcono="text-emerald-600"
              colorFondo="bg-emerald-100"
            />
            <KpiCard
              titulo="Solicitudes Pendientes"
              valor={pendientes}
              icono={Clock}
              colorIcono="text-yellow-600"
              colorFondo="bg-yellow-100"
            />
            <KpiCard
              titulo="Activos TI Activos"
              valor="—"
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
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={datosGrafico} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="nombre" tick={{ fontSize: 13, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => `S/ ${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="Gastado" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Restante" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla de solicitudes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700">Solicitudes Recientes</h2>
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
                        No hay solicitudes registradas
                      </td>
                    </tr>
                  ) : (
                    solicitudes.map((sol) => (
                      <tr key={sol.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-semibold text-slate-700">
                          REQ-{String(sol.id).padStart(3, '0')}
                        </td>
                        <td className="px-5 py-3 text-slate-600">{sol.descripcion}</td>
                        <td className="px-5 py-3 text-slate-500">{sol.area?.nombre || '—'}</td>
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