import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Obtener los counter_times del día actual
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counterTimes = await prisma.counterTime.findMany({
      where: { date: today },
      include: { counter: true },
    });

    return NextResponse.json({ counterTimes });
  } catch (error) {
    console.error('Error fetching counter times:', error);
    return NextResponse.json({ error: 'Error al obtener counter times' }, { status: 500 });
  }
}

// Incrementar el contador (+1)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { counterId } = body;

    if (!counterId) {
      return NextResponse.json({ error: 'counterId es requerido' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar si ya existe un counter_time para hoy
    const existingCounterTime = await prisma.counterTime.findFirst({
      where: {
        counterId,
        date: today,
      },
    });

    if (existingCounterTime) {
      // Incrementar
      const updated = await prisma.counterTime.update({
        where: { id: existingCounterTime.id },
        data: { times: existingCounterTime.times + 1 },
        include: { counter: true },
      });
      return NextResponse.json({ counterTime: updated });
    } else {
      // Crear nuevo con times = 1
      const created = await prisma.counterTime.create({
        data: {
          counterId,
          date: today,
          times: 1,
        },
        include: { counter: true },
      });
      return NextResponse.json({ counterTime: created });
    }
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return NextResponse.json({ error: 'Error al incrementar contador' }, { status: 500 });
  }
}
