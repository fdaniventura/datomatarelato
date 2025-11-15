'use client';

import { useState, useEffect, useCallback } from 'react';

export type WorkState = 'idle' | 'gestion' | 'efectivo' | 'kaos';

interface WorkFragment {
  id: string;
  ticket: string | null;
  isKaos: boolean;
  startTime: Date;
  endTime: Date | null;
  duration: number;
}

export function useWorkState() {
  const [fragment, setFragment] = useState<WorkFragment | null>(null);
  const [state, setState] = useState<WorkState>('idle');
  const [loading, setLoading] = useState(false);
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);

  const fetchActiveFragment = useCallback(async () => {
    try {
      const res = await fetch('/api/work-fragments');
      const data = await res.json();
      setFragment(data.fragment);
      
      // Determinar el estado basándose en el fragmento
      if (!data.fragment) {
        setState('idle');
      } else if (data.fragment.isKaos) {
        setState('kaos');
      } else if (data.fragment.ticket) {
        setState('efectivo');
      } else {
        setState('gestion');
      }

      // Obtener también el total del día
      const allRes = await fetch('/api/work-fragments?all=true');
      const allData = await allRes.json();
      if (allData.fragments) {
        const total = allData.fragments
          .filter((f: WorkFragment) => f.endTime !== null)
          .reduce((acc: number, f: WorkFragment) => acc + f.duration, 0);
        setTodayTotalMinutes(total);
      }
    } catch (error) {
      console.error('Error fetching fragment:', error);
    }
  }, []);

  useEffect(() => {
    fetchActiveFragment();
    
    // Actualizar cada 5 segundos para mantener sincronizado
    const interval = setInterval(fetchActiveFragment, 5000);
    return () => clearInterval(interval);
  }, [fetchActiveFragment]);

  const executeAction = useCallback(async (action: string, data?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/work-fragments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error en la acción');
      }

      await fetchActiveFragment();
    } catch (error) {
      console.error('Error executing action:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchActiveFragment]);

  const start = useCallback(() => executeAction('start'), [executeAction]);
  const assign = useCallback((ticket: string) => executeAction('assign', { ticket }), [executeAction]);
  const baptize = useCallback((ticket: string) => executeAction('baptize', { ticket }), [executeAction]);
  const kaos = useCallback(() => executeAction('kaos'), [executeAction]);
  const stop = useCallback(() => executeAction('stop'), [executeAction]);

  const getLastTicket = useCallback(async (): Promise<string> => {
    // Si el fragmento actual tiene ticket, usarlo
    if (fragment?.ticket) {
      return fragment.ticket;
    }

    // Buscar el último fragmento con ticket (esto requeriría otro endpoint, por ahora retornamos vacío)
    return '';
  }, [fragment]);

  return {
    fragment,
    state,
    loading,
    todayTotalMinutes,
    start,
    assign,
    baptize,
    kaos,
    stop,
    getLastTicket,
    refresh: fetchActiveFragment,
  };
}
