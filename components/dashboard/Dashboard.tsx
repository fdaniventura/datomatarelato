'use client';

import Link from 'next/link';
import { BarChart3, Calendar, FileText, Home } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function DashboardCard({ title, description, icon, href, color }: DashboardCardProps) {
  return (
    <Link href={href}>
      <div className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${color}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-white text-4xl">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90 text-sm">{description}</p>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const cards = [
    {
      title: 'Formulario Diario',
      description: 'Registra tus actividades y estado de ánimo del día',
      icon: <Calendar />,
      href: '/daily-form',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      title: 'Ver Entradas',
      description: 'Consulta tus registros anteriores',
      icon: <FileText />,
      href: '/entries',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      title: 'Estadísticas',
      description: 'Visualiza tus datos y tendencias',
      icon: <BarChart3 />,
      href: '/statistics',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      title: 'Panel Principal',
      description: 'Vista general de tu progreso',
      icon: <Home />,
      href: '/overview',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Panel de Control
          </h1>
          <p className="text-gray-600">
            Gestiona tus datos de actividades y estado de ánimo
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Resumen Rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">--</p>
              <p className="text-gray-600 mt-2">Entradas Registradas</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">--</p>
              <p className="text-gray-600 mt-2">Promedio de Ánimo</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">--</p>
              <p className="text-gray-600 mt-2">Actividades Únicas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
