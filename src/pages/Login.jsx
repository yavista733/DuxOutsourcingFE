import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Lógica del Carrusel ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      imagen: '/slide1.jpg',
      titulo: 'SICP: Centralizando el control',
      desc: 'Gestión presupuestaria ágil y transparente para todas las áreas.'
    },
    {
      id: 2,
      imagen: '/slide2.jpg',
      titulo: 'Tu información está segura',
      desc: 'Mantenemos los más altos estándares de seguridad para la gestión de activos.'
    },
    {
      id: 3,
      imagen: '/slide3.jpg',
      titulo: '¿Problemas para ingresar?',
      desc: 'Contacta a la mesa de ayuda: soporte@duxoutsourcing.com'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  // ---------------------------

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/login', {
        username: form.username,
        password: form.password,
      });
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal sin restricciones
    <div className="min-h-screen w-full flex bg-gray-950 overflow-hidden">
      
      {/* LADO IZQUIERDO: Formulario (40% de la pantalla en desktop) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 sm:p-12 relative z-10 bg-gray-950">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 mb-4 shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-xl">DUX</span>
            </div>
            <h1 className="text-white text-3xl font-bold">Bienvenido al SICP</h1>
            <p className="text-gray-400 text-sm mt-2">Sistema de Control Presupuestario</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Usuario</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
          <p className="text-center text-gray-600 text-xs mt-6">SICP v1.0.0 · Dux Outsourcing</p>
        </div>
      </div>

      {/* LADO DERECHO: Carrusel (60% de la pantalla en desktop) */}
      <div className="hidden lg:block lg:w-[60%] relative bg-gray-900">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            // Agregamos pointer-events-none para que los slides ocultos no estorben
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 z-10' 
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img
              src={slide.imagen}
              alt={slide.titulo}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md">
                {slide.titulo}
              </h2>
              <p className="text-xl text-gray-200 max-w-lg drop-shadow-md">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSlide ? 'bg-emerald-500 w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}