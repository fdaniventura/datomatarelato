import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Obtener el fragmento vigente (el que no tiene end_time) o todos los fragmentos del día
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    if (showAll) {
      // Obtener todos los fragmentos del día de hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const workDay = await prisma.workDayStats.findUnique({
        where: { date: today },
        include: {
          fragments: {
            orderBy: { startTime: 'asc' },
          },
        },
      });

      return NextResponse.json({ fragments: workDay?.fragments || [] });
    }

    // Comportamiento original: solo el fragmento activo
    const activeFragment = await prisma.workFragment.findFirst({
      where: {
        endTime: null,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json({ fragment: activeFragment });
  } catch (error) {
    console.error('Error fetching active fragment:', error);
    return NextResponse.json({ error: 'Error al obtener fragmento activo' }, { status: 500 });
  }
}

// Crear o cerrar fragmentos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ticket, moodId } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar o crear work_day_stats para hoy
    let workDay = await prisma.workDayStats.findUnique({
      where: { date: today },
    });

    if (!workDay) {
      workDay = await prisma.workDayStats.create({
        data: {
          date: today,
        },
      });
    }

    // Obtener fragmento activo
    const activeFragment = await prisma.workFragment.findFirst({
      where: { endTime: null },
      orderBy: { startTime: 'desc' },
    });

    switch (action) {
      case 'start': {
        // Si hay fragmento activo de gestión, no hacer nada
        if (activeFragment && !activeFragment.ticket && !activeFragment.isKaos) {
          return NextResponse.json({ fragment: activeFragment });
        }

        // Cerrar fragmento activo si existe
        if (activeFragment) {
          await closeFragment(activeFragment.id);
        }

        // Crear fragmento de gestión
        const newFragment = await prisma.workFragment.create({
          data: {
            workDayId: workDay.id,
            startTime: new Date(),
            duration: 0,
            ...(moodId && { moodId }),
            isKaos: false,
          },
        });

        return NextResponse.json({ fragment: newFragment });
      }

      case 'assign': {
        // Validar ticket
        if (!ticket || !/^#\d{5}$/.test(ticket)) {
          return NextResponse.json({ error: 'Ticket debe ser #XXXXX (5 dígitos)' }, { status: 400 });
        }

        // Si el fragmento activo ya tiene este ticket, no hacer nada
        if (activeFragment && activeFragment.ticket === ticket && !activeFragment.isKaos) {
          return NextResponse.json({ fragment: activeFragment });
        }

        // Cerrar fragmento activo si existe
        if (activeFragment) {
          await closeFragment(activeFragment.id);
        }

        // Crear fragmento con ticket
        const newFragment = await prisma.workFragment.create({
          data: {
            workDayId: workDay.id,
            startTime: new Date(),
            duration: 0,
            ticket,
            ...(moodId && { moodId }),
            isKaos: false,
          },
        });

        return NextResponse.json({ fragment: newFragment });
      }

      case 'baptize': {
        // Asignar ticket al fragmento kaos vigente
        if (!activeFragment || !activeFragment.isKaos) {
          return NextResponse.json({ error: 'No hay fragmento kaos activo' }, { status: 400 });
        }

        if (!ticket || !/^#\d{6}$/.test(ticket)) {
          return NextResponse.json({ error: 'Ticket debe ser #XXXXXX (6 dígitos)' }, { status: 400 });
        }

        // Actualizar y cerrar el fragmento kaos con el ticket
        const baptizedFragment = await closeFragment(activeFragment.id, ticket);

        return NextResponse.json({ fragment: baptizedFragment });
      }

      case 'kaos': {
        // Si ya hay un fragmento kaos activo sin ticket, no hacer nada
        if (activeFragment && activeFragment.isKaos && !activeFragment.ticket) {
          return NextResponse.json({ fragment: activeFragment });
        }

        // Cerrar fragmento activo si existe
        if (activeFragment) {
          await closeFragment(activeFragment.id);
        }

        // Crear fragmento kaos
        const newFragment = await prisma.workFragment.create({
          data: {
            workDayId: workDay.id,
            startTime: new Date(),
            duration: 0,
            ...(moodId && { moodId }),
            isKaos: true,
          },
        });

        return NextResponse.json({ fragment: newFragment });
      }

      case 'stop': {
        if (!activeFragment) {
          return NextResponse.json({ message: 'No hay fragmento activo' });
        }

        await closeFragment(activeFragment.id);
        return NextResponse.json({ message: 'Fragmento cerrado' });
      }

      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in work-fragments API:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

// Función auxiliar para cerrar un fragmento
async function closeFragment(fragmentId: string, ticket?: string) {
  const now = new Date();
  const fragment = await prisma.workFragment.findUnique({
    where: { id: fragmentId },
  });

  if (!fragment) return null;

  const startTime = fragment.startTime;
  const endTime = now;
  
  // Calcular duración en minutos
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  return await prisma.workFragment.update({
    where: { id: fragmentId },
    data: {
      endTime,
      duration,
      ...(ticket && { ticket }),
    },
  });
}


