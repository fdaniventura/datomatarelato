'use client';

import { useState, useEffect } from 'react';

interface Counter {
  id: string;
  emoji: string;
  name: string | null;
  threshold: number | null;
  exceedingIsGood: boolean;
}

interface CounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { emoji: string; name: string; threshold: number | null; exceedingIsGood: boolean }) => void;
  onUpdate?: (id: string, data: { emoji: string; name: string; threshold: number | null; exceedingIsGood: boolean }) => void;
  editingCounter?: Counter | null;
}

export default function CounterModal({ isOpen, onClose, onCreate, onUpdate, editingCounter }: CounterModalProps) {
  const [emoji, setEmoji] = useState('');
  const [name, setName] = useState('');
  const [threshold, setThreshold] = useState('');
  const [exceedingIsGood, setExceedingIsGood] = useState(false);

  useEffect(() => {
    if (editingCounter) {
      setEmoji(editingCounter.emoji);
      setName(editingCounter.name || '');
      setThreshold(editingCounter.threshold?.toString() || '');
      setExceedingIsGood(editingCounter.exceedingIsGood);
    } else {
      setEmoji('');
      setName('');
      setThreshold('');
      setExceedingIsGood(true);
    }
  }, [editingCounter, isOpen]);

  const handleSubmit = () => {
    if (!emoji.trim()) {
      alert('El emoji es requerido');
      return;
    }

    const data = {
      emoji: emoji.trim(),
      name: name.trim(),
      threshold: threshold ? parseInt(threshold) : null,
      exceedingIsGood,
    };

    if (editingCounter && onUpdate) {
      onUpdate(editingCounter.id, data);
    } else {
      onCreate(data);
    }

    // Reset
    setEmoji('');
    setName('');
    setThreshold('');
    setExceedingIsGood(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border-4 border-slate-600/50 p-8 max-w-md w-full">
        {/* Título */}
        <h2 className="text-3xl font-black text-slate-100 text-center mb-6 tracking-wider uppercase">
          {editingCounter ? 'Editar Contador' : 'Nuevo Contador'}
        </h2>

        {/* Formulario */}
        <div className="space-y-6">
          {/* Emoji */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Emoji *
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🏃"
              className="w-full bg-slate-900/60 border-2 border-slate-600/50 rounded-lg px-4 py-3 text-4xl text-center text-slate-100 focus:outline-none focus:border-blue-500"
              maxLength={4}
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Ejercicio"
              className="w-full bg-slate-900/60 border-2 border-slate-600/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500"
              maxLength={100}
            />
          </div>

          {/* Threshold */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Meta (opcional)
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full bg-slate-900/60 border-2 border-slate-600/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Exceeding is good */}
          {threshold && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="exceedingIsGood"
                checked={exceedingIsGood}
                onChange={(e) => setExceedingIsGood(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="exceedingIsGood" className="text-sm text-slate-300">
                Superar la meta es bueno
              </label>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-b from-slate-500 to-slate-700 hover:from-slate-400 hover:to-slate-600 active:scale-95 rounded-xl p-4 text-xl font-bold text-white shadow-lg border-2 border-slate-400/30 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 active:scale-95 rounded-xl p-4 text-xl font-bold text-white shadow-lg border-2 border-blue-400/30 transition-all"
          >
            {editingCounter ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
