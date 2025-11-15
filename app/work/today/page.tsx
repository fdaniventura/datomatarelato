'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WorkFragment {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  ticket: string | null;
  isKaos: boolean;
  mood?: {
    emoji: string;
    name: string;
  };
}

interface DayStats {
  workedTime: number;
  mngmtTime: number;
  kaosTime: number;
  totalFragments: number;
  effectiveFragments: number;
  gestionFragments: number;
  kaosFragments: number;
  avgFragmentDuration: number;
  longestFragment: number;
  shortestFragment: number;
  productivity: number; // % de tiempo efectivo vs total
}

export default function WorkTodayPage() {
  const router = useRouter();
  const [fragments, setFragments] = useState<WorkFragment[]>([]);
  const [stats, setStats] = useState<DayStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener todos los fragmentos del día
      const res = await fetch('/api/work-fragments?all=true');
      const data = await res.json();
      
      if (data.fragments) {
        setFragments(data.fragments);
        calculateStats(data.fragments);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (frags: WorkFragment[]) => {
    const completed = frags.filter(f => f.endTime !== null);
    
    if (completed.length === 0) {
      setStats(null);
      return;
    }

    const workedTime = completed
      .filter(f => f.ticket && !f.isKaos)
      .reduce((acc, f) => acc + f.duration, 0);
    
    const mngmtTime = completed
      .filter(f => !f.ticket && !f.isKaos)
      .reduce((acc, f) => acc + f.duration, 0);
    
    const kaosTime = completed
      .filter(f => f.isKaos && !f.ticket)
      .reduce((acc, f) => acc + f.duration, 0);

    const durations = completed.map(f => f.duration);
    const totalTime = workedTime + mngmtTime + kaosTime;

    setStats({
      workedTime,
      mngmtTime,
      kaosTime,
      totalFragments: completed.length,
      effectiveFragments: completed.filter(f => f.ticket && !f.isKaos).length,
      gestionFragments: completed.filter(f => !f.ticket && !f.isKaos).length,
      kaosFragments: completed.filter(f => f.isKaos).length,
      avgFragmentDuration: totalTime / completed.length,
      longestFragment: Math.max(...durations),
      shortestFragment: Math.min(...durations),
      productivity: totalTime > 0 ? (workedTime / totalTime) * 100 : 0,
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatTimeShort = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="text-3xl text-slate-300 animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-black text-slate-100 tracking-wide">
            Resumen del Día
          </h1>
          <button
            onClick={() => router.push('/panel/workeo-live')}
            className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-slate-100 rounded-lg hover:from-slate-500 hover:to-slate-600 transition-all shadow-lg font-bold"
          >
            ← Volver
          </button>
        </div>

        {stats ? (
          <>
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Tiempo Efectivo */}
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/60 backdrop-blur border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-300">Tiempo Efectivo</h3>
                  <span className="text-4xl">🎯</span>
                </div>
                <p className="text-5xl font-black text-blue-100 mb-2">{formatTimeShort(stats.workedTime)}</p>
                <p className="text-sm text-blue-300">{stats.effectiveFragments} fragmentos</p>
              </div>

              {/* Tiempo Gestión */}
              <div className="bg-gradient-to-br from-green-900/40 to-green-950/60 backdrop-blur border border-green-500/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-green-300">Tiempo Gestión</h3>
                  <span className="text-4xl">📋</span>
                </div>
                <p className="text-5xl font-black text-green-100 mb-2">{formatTimeShort(stats.mngmtTime)}</p>
                <p className="text-sm text-green-300">{stats.gestionFragments} fragmentos</p>
              </div>

              {/* Tiempo Kaos */}
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/60 backdrop-blur border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-purple-300">Tiempo Kaos</h3>
                  <span className="text-4xl">⚡</span>
                </div>
                <p className="text-5xl font-black text-purple-100 mb-2">{formatTimeShort(stats.kaosTime)}</p>
                <p className="text-sm text-purple-300">{stats.kaosFragments} fragmentos</p>
              </div>
            </div>

            {/* Estadísticas adicionales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/60 backdrop-blur border border-slate-600/40 rounded-xl p-6">
                <h4 className="text-sm text-slate-400 mb-2">Productividad</h4>
                <p className="text-3xl font-bold text-slate-100">{stats.productivity.toFixed(1)}%</p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur border border-slate-600/40 rounded-xl p-6">
                <h4 className="text-sm text-slate-400 mb-2">Total Fragmentos</h4>
                <p className="text-3xl font-bold text-slate-100">{stats.totalFragments}</p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur border border-slate-600/40 rounded-xl p-6">
                <h4 className="text-sm text-slate-400 mb-2">Duración Promedio</h4>
                <p className="text-3xl font-bold text-slate-100">{formatTimeShort(Math.round(stats.avgFragmentDuration))}</p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur border border-slate-600/40 rounded-xl p-6">
                <h4 className="text-sm text-slate-400 mb-2">Fragmento Más Largo</h4>
                <p className="text-3xl font-bold text-slate-100">{formatTimeShort(stats.longestFragment)}</p>
              </div>
            </div>

            {/* Gráfico de distribución */}
            <div className="bg-slate-800/40 backdrop-blur border border-slate-600/30 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Distribución del Tiempo</h3>
              <div className="flex gap-2 h-12 rounded-lg overflow-hidden">
                {stats.workedTime > 0 && (
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm"
                    style={{ width: `${(stats.workedTime / (stats.workedTime + stats.mngmtTime + stats.kaosTime)) * 100}%` }}
                  >
                    {((stats.workedTime / (stats.workedTime + stats.mngmtTime + stats.kaosTime)) * 100).toFixed(0)}%
                  </div>
                )}
                {stats.mngmtTime > 0 && (
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm"
                    style={{ width: `${(stats.mngmtTime / (stats.workedTime + stats.mngmtTime + stats.kaosTime)) * 100}%` }}
                  >
                    {((stats.mngmtTime / (stats.workedTime + stats.mngmtTime + stats.kaosTime)) * 100).toFixed(0)}%
                  </div>
                )}
                {stats.kaosTime > 0 && (
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm"
                    style={{ width: `${(stats.kaosTime / (stats.workedTime + stats.mngmtTime + stats.kaosTime)) * 100}%` }}
                  >
                    {((stats.kaosTime / (stats.workedTime + stats.mngmtTime + stats.kaosTime)) * 100).toFixed(0)}%
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-4 text-sm text-slate-400">
                <span>🎯 Efectivo</span>
                <span>📋 Gestión</span>
                <span>⚡ Kaos</span>
              </div>
            </div>

            {/* Lista de fragmentos */}
            <div className="bg-slate-800/40 backdrop-blur border border-slate-600/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Fragmentos del Día</h3>
              <div className="space-y-3">
                {fragments.filter(f => f.endTime !== null).map((fragment) => (
                  <div
                    key={fragment.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      fragment.isKaos
                        ? 'bg-purple-900/20 border-purple-500'
                        : fragment.ticket
                        ? 'bg-blue-900/20 border-blue-500'
                        : 'bg-green-900/20 border-green-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {fragment.mood && <span className="text-2xl">{fragment.mood.emoji}</span>}
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-300 font-mono">
                              {fragment.startTime} - {fragment.endTime}
                            </span>
                            {fragment.ticket && (
                              <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm font-mono">
                                {fragment.ticket}
                              </span>
                            )}
                            {fragment.isKaos && (
                              <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm font-bold">
                                KAOS
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">
                            {fragment.isKaos ? 'Kaos' : fragment.ticket ? 'Efectivo' : 'Gestión'} • {formatTime(fragment.duration)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-3xl text-slate-400">No hay fragmentos completados hoy</p>
          </div>
        )}
      </div>
    </div>
  );
}
