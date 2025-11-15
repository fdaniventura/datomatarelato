'use client';

import { useEffect, useState } from 'react';
import CounterModal from './CounterModal';

interface Counter {
  id: string;
  emoji: string;
  name: string | null;
  threshold: number | null;
  exceedingIsGood: boolean;
}

interface CounterTime {
  id: string;
  counterId: string;
  times: number;
  counter: Counter;
}

export default function CountersPage() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [counterTimes, setCounterTimes] = useState<Map<string, number>>(new Map());
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener contadores
      const countersRes = await fetch('/api/counters');
      const countersData = await countersRes.json();
      setCounters(countersData.counters || []);

      // Obtener counter_times de hoy
      const timesRes = await fetch('/api/counter-times');
      const timesData = await timesRes.json();
      
      const timesMap = new Map<string, number>();
      (timesData.counterTimes || []).forEach((ct: CounterTime) => {
        timesMap.set(ct.counterId, ct.times);
      });
      setCounterTimes(timesMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCounterClick = async (counterId: string) => {
    if (loading) return;
    
    setLoading(true);
    try {
      await fetch('/api/counter-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counterId }),
      });

      // Actualizar localmente
      setCounterTimes(prev => {
        const newMap = new Map(prev);
        newMap.set(counterId, (prev.get(counterId) || 0) + 1);
        return newMap;
      });
    } catch (error) {
      console.error('Error incrementing counter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrementCounter = async (counterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    
    const currentTimes = counterTimes.get(counterId) || 0;
    if (currentTimes <= 0) return;
    
    setLoading(true);
    try {
      await fetch('/api/counter-times/decrement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counterId }),
      });

      // Actualizar localmente
      setCounterTimes(prev => {
        const newMap = new Map(prev);
        newMap.set(counterId, Math.max(0, (prev.get(counterId) || 0) - 1));
        return newMap;
      });
    } catch (error) {
      console.error('Error decrementing counter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCounter = async (data: { emoji: string; name: string; threshold: number | null; exceedingIsGood: boolean }) => {
    try {
      await fetch('/api/counters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      await fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating counter:', error);
    }
  };

  const handleUpdateCounter = async (id: string, data: { emoji: string; name: string; threshold: number | null; exceedingIsGood: boolean }) => {
    try {
      await fetch('/api/counters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });

      await fetchData();
      setShowModal(false);
      setEditingCounter(null);
    } catch (error) {
      console.error('Error updating counter:', error);
    }
  };

  const handleEditClick = (counter: Counter, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCounter(counter);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCounter(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-slate-100 tracking-wide mb-2">
            Contadores
          </h1>
          <p className="text-slate-400">Registra tus actividades diarias</p>
        </div>

        {/* Grid de contadores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {counters.map((counter) => {
            const times = counterTimes.get(counter.id) || 0;
            const isOverThreshold = counter.threshold !== null && times >= counter.threshold;
            const thresholdColor = isOverThreshold 
              ? (counter.exceedingIsGood ? 'border-green-500' : 'border-red-500')
              : 'border-slate-600/40';

            return (
              <button
                key={counter.id}
                onClick={() => handleCounterClick(counter.id)}
                disabled={loading}
                className={`group relative bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 rounded-2xl p-8 shadow-2xl transition-all duration-200 active:scale-95 border-4 ${thresholdColor} disabled:opacity-50`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl pointer-events-none"></div>
                
                <div className="relative text-center">
                  {/* Botón de decrementar */}
                  <button
                    onClick={(e) => handleDecrementCounter(counter.id, e)}
                    disabled={times === 0}
                    className="absolute top-0 left-0 w-8 h-8 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-slate-200 transition-colors z-10"
                    title="Restar -1"
                  >
                    ➖
                  </button>

                  {/* Botón de edición */}
                  <button
                    onClick={(e) => handleEditClick(counter, e)}
                    className="absolute top-0 right-0 w-8 h-8 bg-slate-600 hover:bg-slate-500 rounded-full flex items-center justify-center text-slate-200 transition-colors z-10"
                    title="Editar contador"
                  >
                    ✏️
                  </button>

                  {/* Emoji */}
                  <div className="text-6xl mb-4">{counter.emoji}</div>
                  
                  {/* Nombre */}
                  {counter.name && (
                    <h3 className="text-lg font-bold text-slate-200 mb-3">
                      {counter.name}
                    </h3>
                  )}
                  
                  {/* Contador */}
                  <div className="bg-slate-900/60 rounded-lg px-4 py-3 mb-2">
                    <span className="text-4xl font-black text-slate-100 tabular-nums">
                      {times}
                    </span>
                  </div>

                  {/* Threshold */}
                  {counter.threshold !== null && (
                    <div className="text-xs text-slate-400 mt-2">
                      Meta: {counter.threshold} {counter.exceedingIsGood ? '↑' : '↓'}
                    </div>
                  )}
                </div>

                {/* Efecto de pulso al hacer clic */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-slate-400 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ping"></div>
              </button>
            );
          })}

          {/* Botón para crear nuevo contador */}
          <button
            onClick={() => setShowModal(true)}
            className="group relative bg-gradient-to-br from-blue-600/30 to-blue-800/30 hover:from-blue-600/40 hover:to-blue-800/40 rounded-2xl p-8 shadow-2xl transition-all duration-200 active:scale-95 border-4 border-blue-500/30 border-dashed"
          >
            <div className="relative text-center">
              <div className="text-6xl mb-4">➕</div>
              <h3 className="text-lg font-bold text-blue-300">
                Nuevo Contador
              </h3>
            </div>
          </button>
        </div>
      </div>

      {/* Modal para crear/editar contador */}
      <CounterModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onCreate={handleCreateCounter}
        onUpdate={handleUpdateCounter}
        editingCounter={editingCounter}
      />
    </div>
  );
}
