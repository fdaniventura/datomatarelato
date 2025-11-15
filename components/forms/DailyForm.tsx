'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Esquema de validación con Zod
const dailyFormSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  moodScore: z.number().min(1, 'Mínimo 1').max(10, 'Máximo 10'),
  activities: z.array(z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    duration: z.number().optional(),
    intensity: z.number().min(1).max(5).optional(),
    category: z.string().optional(),
  })),
  customMetrics: z.array(z.object({
    name: z.string().min(1),
    value: z.number(),
    unit: z.string().optional(),
  })).optional(),
  notes: z.string().optional(),
});

type DailyFormData = z.infer<typeof dailyFormSchema>;

export default function DailyForm() {
  const [activities, setActivities] = useState<Array<{ name: string; duration?: number; intensity?: number; category?: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DailyFormData>({
    resolver: zodResolver(dailyFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      moodScore: 5,
      activities: [],
      notes: '',
    },
  });

  const addActivity = () => {
    setActivities([...activities, { name: '', duration: 0, intensity: 3 }]);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, field: string, value: string | number) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const onSubmit = async (data: DailyFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = {
        ...data,
        activities,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/daily-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('✅ Datos guardados correctamente');
        reset();
        setActivities([]);
      } else {
        const error = await response.json();
        setSubmitMessage(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      setSubmitMessage('❌ Error al guardar los datos');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Formulario Diario</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Estado de Ánimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado de Ánimo (1-10)
          </label>
          <input
            type="number"
            {...register('moodScore', { valueAsNumber: true })}
            min="1"
            max="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.moodScore && (
            <p className="text-red-500 text-sm mt-1">{errors.moodScore.message}</p>
          )}
        </div>

        {/* Actividades */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Actividades
            </label>
            <button
              type="button"
              onClick={addActivity}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              + Añadir Actividad
            </button>
          </div>

          {activities.map((activity, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Nombre de actividad"
                  value={activity.name}
                  onChange={(e) => updateActivity(index, 'name', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Duración (min)"
                  value={activity.duration || ''}
                  onChange={(e) => updateActivity(index, 'duration', Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Intensidad (1-5)"
                  min="1"
                  max="5"
                  value={activity.intensity || ''}
                  onChange={(e) => updateActivity(index, 'intensity', Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Escribe tus notas del día..."
          />
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Entrada Diaria'}
        </button>

        {submitMessage && (
          <div className={`p-4 rounded-md ${submitMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}
