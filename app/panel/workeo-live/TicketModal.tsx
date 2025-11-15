'use client';

import { useState, useEffect } from 'react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (ticket: string) => void;
  onBaptize?: (ticket: string) => void;
  initialValue?: string;
  showBaptize?: boolean;
}

export default function TicketModal({
  isOpen,
  onClose,
  onAccept,
  onBaptize,
  initialValue = '',
  showBaptize = false,
}: TicketModalProps) {
  const [ticket, setTicket] = useState('#');

  useEffect(() => {
    // Asegurar que siempre empiece con #
    const value = initialValue.startsWith('#') ? initialValue : '#' + initialValue;
    setTicket(value);
  }, [initialValue, isOpen]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key >= '0' && e.key <= '9' && ticket.length < 6) {
        setTicket(ticket + e.key);
      } else if (e.key === 'Backspace') {
        // No permitir borrar el #
        if (ticket.length > 1) {
          setTicket(ticket.slice(0, -1));
        }
      } else if (e.key === 'Enter' && ticket.length === 6) {
        onAccept(ticket);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, ticket, onAccept, onClose]);

  const handleNumberClick = (num: string) => {
    if (ticket.length < 6) {
      setTicket(ticket + num);
    }
  };

  const handleClear = () => setTicket('#');
  const handleBackspace = () => {
    // No permitir borrar el #
    if (ticket.length > 1) {
      setTicket(ticket.slice(0, -1));
    }
  };
  
  const handleAccept = () => {
    if (ticket.length === 6) {
      onAccept(ticket);
      onClose();
    }
  };

  const handleBaptizeClick = () => {
    if (ticket.length === 6 && onBaptize) {
      onBaptize(ticket);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border-4 border-gray-600/50 p-8 max-w-md w-full">
        {/* Título */}
        <h2 className="text-3xl font-black text-gray-200 text-center mb-6 tracking-wider uppercase">
          Asignar Ticket
        </h2>

        {/* Display del ticket */}
        <div className="bg-black/40 border-4 border-gray-600/30 rounded-xl p-6 mb-6 shadow-inner">
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`w-12 h-16 bg-gradient-to-b ${
                  index === 0 
                    ? 'from-yellow-900 to-yellow-950 border-yellow-700/50' 
                    : 'from-green-900 to-green-950 border-green-700/50'
                } border-2 rounded-lg flex items-center justify-center shadow-lg`}
              >
                <span className={`text-4xl font-mono font-bold ${
                  index === 0 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {index === 0 ? '#' : (ticket[index] || '_')}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            {ticket.length - 1}/5 dígitos
          </p>
        </div>

        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="bg-gradient-to-b from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600 active:scale-95 rounded-xl p-6 text-3xl font-bold text-white shadow-lg border-2 border-gray-400/30 transition-all"
            >
              {num}
            </button>
          ))}

          {/* Botón Clear */}
          <button
            onClick={handleClear}
            className="bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 active:scale-95 rounded-xl p-6 text-lg font-bold text-yellow-900 shadow-lg border-2 border-yellow-400/30 transition-all"
          >
            CLR
          </button>

          {/* Botón 0 */}
          <button
            onClick={() => handleNumberClick('0')}
            className="bg-gradient-to-b from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600 active:scale-95 rounded-xl p-6 text-3xl font-bold text-white shadow-lg border-2 border-gray-400/30 transition-all"
          >
            0
          </button>

          {/* Botón Backspace */}
          <button
            onClick={handleBackspace}
            className="bg-gradient-to-b from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 active:scale-95 rounded-xl p-6 text-lg font-bold text-orange-900 shadow-lg border-2 border-orange-400/30 transition-all"
          >
            ⌫
          </button>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
        {showBaptize && (
            <button
              onClick={handleBaptizeClick}
              disabled={ticket.length !== 6}
              className="w-full bg-gradient-to-b from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed active:scale-95 rounded-xl p-4 text-xl font-bold text-white shadow-lg border-2 border-purple-400/30 transition-all"
            >
              ⚡ Bautizar Kaos
            </button>
          )}

          <button
            onClick={handleAccept}
            disabled={ticket.length !== 6}
            className="w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed active:scale-95 rounded-xl p-4 text-xl font-bold text-white shadow-lg border-2 border-green-400/30 transition-all"
          >
            ✓ Aceptar
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-b from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600 active:scale-95 rounded-xl p-4 text-xl font-bold text-white shadow-lg border-2 border-gray-400/30 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
