'use client';

import { useEffect, useState } from 'react';

interface LiveCountersProps {
  fragmentStartTime: Date | null;
  todayTotalMinutes: number;
}

export default function LiveCounters({ fragmentStartTime, todayTotalMinutes }: LiveCountersProps) {
  const [currentFragmentTime, setCurrentFragmentTime] = useState(0);
  const [totalDayTime, setTotalDayTime] = useState(todayTotalMinutes);

  useEffect(() => {
    // Actualizar contador cada segundo
    const interval = setInterval(() => {
      if (fragmentStartTime) {
        const now = new Date();
        const diffMs = now.getTime() - fragmentStartTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        setCurrentFragmentTime(diffMinutes);
        setTotalDayTime(todayTotalMinutes + diffMinutes);
      } else {
        setCurrentFragmentTime(0);
        setTotalDayTime(todayTotalMinutes);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fragmentStartTime, todayTotalMinutes]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const secs = Math.floor((Date.now() - (fragmentStartTime?.getTime() || 0)) / 1000) % 60;
    
    if (fragmentStartTime && minutes === currentFragmentTime) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* Contador del fragmento actual */}
      <div className="bg-slate-800/60 backdrop-blur border-2 border-slate-600/40 rounded-2xl p-6 shadow-2xl">
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Fragmento Actual
          </h3>
          <div className="font-mono text-5xl font-black text-slate-100 tabular-nums">
            {fragmentStartTime ? formatTime(currentFragmentTime) : '--:--:--'}
          </div>
          {fragmentStartTime && (
            <div className="mt-2 flex justify-center items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">En curso</span>
            </div>
          )}
        </div>
      </div>

      {/* Contador del día total */}
      <div className="bg-slate-800/60 backdrop-blur border-2 border-slate-600/40 rounded-2xl p-6 shadow-2xl">
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Total del Día
          </h3>
          <div className="font-mono text-5xl font-black text-slate-100 tabular-nums">
            {formatTime(totalDayTime)}
          </div>
          <div className="mt-2">
            <span className="text-xs text-slate-400">
              {Math.floor(totalDayTime / 60)}h {totalDayTime % 60}m acumulados
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
