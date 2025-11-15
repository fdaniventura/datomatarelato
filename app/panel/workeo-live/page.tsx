'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkState } from './useWorkState';
import TicketModal from './TicketModal';
import LiveCounters from './LiveCounters';

export default function WorkeoLivePage() {
  const router = useRouter();
  const { fragment, state, loading, todayTotalMinutes, start, assign, baptize, kaos, stop } = useWorkState();
  const [showTicketModal, setShowTicketModal] = useState(false);

  const handleStart = async () => {
    try {
      await start();
    } catch (error) {
      console.error('Error al iniciar:', error);
    }
  };

  const handleAssign = () => {
    setShowTicketModal(true);
  };

  const handleAcceptTicket = async (ticket: string) => {
    try {
      await assign(ticket);
    } catch (error) {
      console.error('Error al asignar ticket:', error);
    }
  };

  const handleBaptize = async (ticket: string) => {
    try {
      await baptize(ticket);
    } catch (error) {
      console.error('Error al bautizar kaos:', error);
    }
  };

  const handleKaos = async () => {
    try {
      await kaos();
    } catch (error) {
      console.error('Error al iniciar kaos:', error);
    }
  };

  const handleStop = async () => {
    try {
      await stop();
    } catch (error) {
      console.error('Error al detener:', error);
    }
  };

  const handleExit = async () => {
    try {
      // Primero detener si hay fragmento activo
      if (fragment) {
        await stop();
      }
      
      // Actualizar work_day_stats
      await fetch('/api/work-day-stats', { method: 'POST' });
      
      // Redirigir a resumen del día
      router.push('/work/today');
    } catch (error) {
      console.error('Error al salir:', error);
    }
  };

  // Determinar el color de fondo según el estado
  const bgGradient = {
    idle: 'from-gray-700 via-gray-800 to-black',
    gestion: 'from-green-700 via-green-900 to-black',
    efectivo: 'from-blue-700 via-blue-900 to-black',
    kaos: 'from-purple-700 via-purple-900 to-black',
  }[state];

  const stateLabel = {
    idle: 'Workeo Live',
    gestion: 'Gestión',
    efectivo: 'Efectivo',
    kaos: 'Kaos',
  }[state];

  const stateLabelColor = {
    idle: 'text-gray-200',
    gestion: 'text-green-300',
    efectivo: 'text-blue-300',
    kaos: 'text-purple-300',
  }[state];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-8 transition-all duration-1000 animate-gradient-slow`}>
      <style jsx>{`
        @keyframes gradient-slow {
          0%, 100% {
            background-size: 200% 200%;
            background-position: 0% 50%;
          }
          50% {
            background-size: 200% 200%;
            background-position: 100% 50%;
          }
        }
        .animate-gradient-slow {
          animation: gradient-slow 15s ease-in-out infinite;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Cabecera con título y estado */}
        <div className="mb-12 text-center">
          <h1 className={`text-5xl font-black ${stateLabelColor} tracking-wider uppercase drop-shadow-2xl`}>
            {stateLabel}
          </h1>
        </div>

        {/* Contadores en vivo */}
        <LiveCounters 
          fragmentStartTime={fragment?.startTime ? new Date(fragment.startTime) : null}
          todayTotalMinutes={todayTotalMinutes}
        />

        {/* Botonera profesional estilo mesa de sonido */}
        <div className="grid grid-cols-5 gap-6">
          {/* Botón START */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="group relative bg-gradient-to-b from-green-400 to-green-600 rounded-xl shadow-2xl hover:shadow-green-500/50 transition-all duration-200 active:scale-95 p-8 border-4 border-green-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-200 rounded-full shadow-lg shadow-green-400/60"></div>
            <div className="relative">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-green-300 rounded-full shadow-inner flex items-center justify-center border-2 border-green-500/40">
                  <div className="w-10 h-10 bg-green-100 rounded-full"></div>
                </div>
              </div>
              <span className="block text-2xl font-black text-green-900 tracking-widest uppercase drop-shadow-lg">
                Start
              </span>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-green-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-green-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-green-900/40 rounded-full"></div>
            </div>
          </button>

          {/* Botón ASIGNAR # */}
          <button
            onClick={handleAssign}
            disabled={loading}
            className="group relative bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-200 active:scale-95 p-8 border-4 border-blue-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-200 rounded-full shadow-lg shadow-blue-400/60"></div>
            <div className="relative">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-blue-300 rounded-full shadow-inner flex items-center justify-center border-2 border-blue-500/40">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">#</span>
                  </div>
                </div>
              </div>
              <span className="block text-2xl font-black text-blue-900 tracking-widest uppercase drop-shadow-lg">
                Asignar #
              </span>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-blue-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-900/40 rounded-full"></div>
            </div>
          </button>

          {/* Botón KAOS */}
          <button
            onClick={handleKaos}
            disabled={loading}
            className="group relative bg-gradient-to-b from-purple-400 to-purple-600 rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-200 active:scale-95 p-8 border-4 border-purple-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-200 rounded-full shadow-lg shadow-purple-400/60"></div>
            <div className="relative">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-purple-300 rounded-full shadow-inner flex items-center justify-center border-2 border-purple-500/40">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">⚡</span>
                  </div>
                </div>
              </div>
              <span className="block text-2xl font-black text-purple-900 tracking-widest uppercase drop-shadow-lg">
                Kaos
              </span>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-purple-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-purple-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-purple-900/40 rounded-full"></div>
            </div>
          </button>

          {/* Botón STOP */}
          <button
            onClick={handleStop}
            disabled={loading}
            className="group relative bg-gradient-to-b from-red-400 to-red-600 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-200 active:scale-95 p-8 border-4 border-red-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-200 rounded-full shadow-lg shadow-red-400/60"></div>
            <div className="relative">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-red-300 rounded-full shadow-inner flex items-center justify-center border-2 border-red-500/40">
                  <div className="w-10 h-10 bg-red-100 rounded-sm"></div>
                </div>
              </div>
              <span className="block text-2xl font-black text-red-900 tracking-widest uppercase drop-shadow-lg">
                Stop
              </span>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-red-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-red-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-red-900/40 rounded-full"></div>
            </div>
          </button>

          {/* Botón SALIR */}
          <button
            onClick={handleExit}
            disabled={loading}
            className="group relative bg-gradient-to-b from-gray-400 to-gray-600 rounded-xl shadow-2xl hover:shadow-gray-500/50 transition-all duration-200 active:scale-95 p-8 border-4 border-gray-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-200 rounded-full shadow-lg shadow-gray-400/60"></div>
            <div className="relative">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full shadow-inner flex items-center justify-center border-2 border-gray-500/40">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">✕</span>
                  </div>
                </div>
              </div>
              <span className="block text-2xl font-black text-gray-900 tracking-widest uppercase drop-shadow-lg">
                Salir
              </span>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-gray-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-900/40 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-900/40 rounded-full"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Modal de ticket */}
      <TicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        onAccept={handleAcceptTicket}
        onBaptize={state === 'kaos' ? handleBaptize : undefined}
        initialValue={fragment?.ticket || ''}
        showBaptize={state === 'kaos'}
      />
    </div>
  );
}
