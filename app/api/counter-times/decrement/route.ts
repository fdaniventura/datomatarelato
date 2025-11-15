import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Decrementar el contador (-1)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { counterId } = body;

    if (!counterId) {
      return NextResponse.json({ error: 'counterId es requerido' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar el counter_time para hoy
    const existingCounterTime = await prisma.counterTime.findFirst({
      where: {
        counterId,
        date: today,
      },
    });

    if (!existingCounterTime) {
      return NextResponse.json({ error: 'No hay contador para decrementar' }, { status: 400 });
    }

    // No permitir que baje de 0
    if (existingCounterTime.times <= 0) {
      return NextResponse.json({ error: 'El contador ya está en 0' }, { status: 400 });
    }

    // Decrementar
    const updated = await prisma.counterTime.update({
      where: { id: existingCounterTime.id },
      data: { times: existingCounterTime.times - 1 },
      include: { counter: true },
    });

    return NextResponse.json({ counterTime: updated });
  } catch (error) {
    console.error('Error decrementing counter:', error);
    return NextResponse.json({ error: 'Error al decrementar contador' }, { status: 500 });
  }
}
