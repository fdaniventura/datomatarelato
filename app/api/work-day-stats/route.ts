import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar work_day_stats para hoy
    const workDay = await prisma.workDayStats.findUnique({
      where: { date: today },
      include: {
        fragments: true,
      },
    });

    if (!workDay) {
      return NextResponse.json({ message: 'No hay fragmentos para hoy' });
    }

    // Calcular totales
    let workedTime = 0; // Fragmentos con ticket
    let mngmtTime = 0;  // Fragmentos sin ticket y sin kaos
    let kaosTime = 0;   // Fragmentos kaos sin ticket

    for (const fragment of workDay.fragments) {
      // Solo contar fragmentos cerrados
      if (!fragment.endTime) continue;

      const duration = fragment.duration;

      if (fragment.isKaos && !fragment.ticket) {
        // Kaos puro (sin ticket)
        kaosTime += duration;
      } else if (fragment.ticket) {
        // Tiempo efectivo (con ticket, independientemente de si es kaos)
        workedTime += duration;
      } else {
        // Gestión (sin ticket, sin kaos)
        mngmtTime += duration;
      }
    }

    // Actualizar work_day_stats
    const updatedWorkDay = await prisma.workDayStats.update({
      where: { id: workDay.id },
      data: {
        workedTime,
        mngmtTime,
        kaosTime,
      },
    });

    return NextResponse.json({
      message: 'Estadísticas actualizadas',
      stats: {
        workedTime,
        mngmtTime,
        kaosTime,
        total: workedTime + mngmtTime + kaosTime,
      },
    });
  } catch (error) {
    console.error('Error updating work day stats:', error);
    return NextResponse.json({ error: 'Error al actualizar estadísticas' }, { status: 500 });
  }
}
