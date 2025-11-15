'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Entry {
  id: number;
  entry_date: string;
  mood_score: number;
  notes: string;
  created_at: string;
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/daily-entry');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      } else {
        setError('Error al cargar las entradas');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Mis Entradas</h1>
          <a
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            ← Volver al Panel
          </a>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {entries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No hay entradas registradas todavía
            </p>
            <a
              href="/daily-form"
              className="inline-block px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Crear Primera Entrada
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {format(new Date(entry.entry_date), 'EEEE, d MMMM yyyy', { locale: es })}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Registrado el {format(new Date(entry.created_at), "d/MM/yyyy 'a las' HH:mm")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-600 mb-1">Estado de Ánimo</span>
                    <span className={`text-3xl font-bold ${
                      entry.mood_score >= 7 ? 'text-green-500' :
                      entry.mood_score >= 4 ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {entry.mood_score}/10
                    </span>
                  </div>
                </div>

                {entry.notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold text-gray-700 mb-2">Notas:</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
