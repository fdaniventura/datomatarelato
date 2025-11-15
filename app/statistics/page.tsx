// Placeholder para vista de estadísticas (próximamente)
export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Estadísticas</h1>
          <a
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            ← Volver al Panel
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            📊 Sección de estadísticas en desarrollo
          </p>
          <p className="text-gray-500">
            Aquí podrás visualizar gráficos y análisis de tus datos
          </p>
        </div>
      </div>
    </div>
  );
}
