'use client';

import { useRouter } from 'next/navigation';

interface SectionCard {
  title: string;
  description: string;
  emoji: string;
  path: string;
  color: string;
}

export default function Home() {
  const router = useRouter();

  const sections: SectionCard[] = [
    {
      title: 'Panel',
      description: 'Acceso a todas las herramientas de control y gestión',
      emoji: '🎛️',
      path: '/panel',
      color: 'from-indigo-600 to-indigo-800',
    },
    {
      title: 'Work',
      description: 'Estadísticas y resúmenes de tu actividad laboral',
      emoji: '📊',
      path: '/work/today',
      color: 'from-emerald-600 to-emerald-800',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-7xl font-black text-slate-100 tracking-wide mb-4">
            Datomatarelato
          </h1>
          <p className="text-2xl text-slate-400">
            Tu sistema de seguimiento personal
          </p>
        </div>

        {/* Grid de secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sections.map((section) => (
            <button
              key={section.path}
              onClick={() => router.push(section.path)}
              className={`group relative bg-gradient-to-br ${section.color} rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 border-4 border-white/10 overflow-hidden`}
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
              
              {/* Contenido */}
              <div className="relative z-10">
                {/* Emoji */}
                <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {section.emoji}
                </div>

                {/* Título */}
                <h2 className="text-4xl font-black text-white mb-4 tracking-wide">
                  {section.title}
                </h2>

                {/* Descripción */}
                <p className="text-base text-white/80 leading-relaxed">
                  {section.description}
                </p>
              </div>

              {/* Indicador de hover */}
              <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-2xl">→</span>
              </div>

              {/* Efecto de onda al hacer clic */}
              <div className="absolute inset-0 opacity-0 group-active:opacity-20 bg-white rounded-3xl transition-opacity duration-100"></div>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-20 text-center">
          <p className="text-slate-500">
            Selecciona una sección para comenzar
          </p>
        </div>
      </div>
    </div>
  );
}
