'use client';

import { useRouter } from 'next/navigation';

interface PanelCard {
  title: string;
  description: string;
  emoji: string;
  path: string;
  color: string;
}

export default function PanelPage() {
  const router = useRouter();

  const panels: PanelCard[] = [
    {
      title: 'Workeo Live',
      description: 'Control de fragmentos de trabajo en tiempo real',
      emoji: '⏱️',
      path: '/panel/workeo-live',
      color: 'from-blue-600 to-blue-800',
    },
    {
      title: 'Contadores',
      description: 'Registra y gestiona tus actividades diarias',
      emoji: '🔢',
      path: '/panel/counters',
      color: 'from-purple-600 to-purple-800',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black text-slate-100 tracking-wide mb-4">
            Panel de Control
          </h1>
          <p className="text-xl text-slate-400">
            Selecciona una sección para comenzar
          </p>
        </div>

        {/* Grid de paneles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {panels.map((panel) => (
            <button
              key={panel.path}
              onClick={() => router.push(panel.path)}
              className={`group relative bg-gradient-to-br ${panel.color} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 border-4 border-white/10 overflow-hidden`}
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
              
              {/* Contenido */}
              <div className="relative z-10">
                {/* Emoji */}
                <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {panel.emoji}
                </div>

                {/* Título */}
                <h2 className="text-3xl font-black text-white mb-3 tracking-wide">
                  {panel.title}
                </h2>

                {/* Descripción */}
                <p className="text-sm text-white/80 leading-relaxed">
                  {panel.description}
                </p>
              </div>

              {/* Indicador de hover */}
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xl">→</span>
              </div>

              {/* Efecto de onda al hacer clic */}
              <div className="absolute inset-0 opacity-0 group-active:opacity-20 bg-white rounded-3xl transition-opacity duration-100"></div>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            Presiona cualquier panel para acceder a sus funcionalidades
          </p>
        </div>
      </div>
    </div>
  );
}
