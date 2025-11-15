import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Obtener todos los contadores
export async function GET() {
  try {
    const counters = await prisma.counter.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ counters });
  } catch (error) {
    console.error('Error fetching counters:', error);
    return NextResponse.json({ error: 'Error al obtener contadores' }, { status: 500 });
  }
}

// Crear un nuevo contador
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emoji, name, threshold, exceedingIsGood } = body;

    if (!emoji) {
      return NextResponse.json({ error: 'El emoji es requerido' }, { status: 400 });
    }

    const newCounter = await prisma.counter.create({
      data: {
        emoji,
        name: name || null,
        threshold: threshold || null,
        exceedingIsGood: exceedingIsGood || false,
      },
    });

    return NextResponse.json({ counter: newCounter });
  } catch (error) {
    console.error('Error creating counter:', error);
    return NextResponse.json({ error: 'Error al crear contador' }, { status: 500 });
  }
}

// Actualizar un contador existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, emoji, name, threshold, exceedingIsGood } = body;

    if (!id) {
      return NextResponse.json({ error: 'El id es requerido' }, { status: 400 });
    }

    if (!emoji) {
      return NextResponse.json({ error: 'El emoji es requerido' }, { status: 400 });
    }

    const updatedCounter = await prisma.counter.update({
      where: { id },
      data: {
        emoji,
        name: name || null,
        threshold: threshold || null,
        exceedingIsGood: exceedingIsGood || false,
      },
    });

    return NextResponse.json({ counter: updatedCounter });
  } catch (error) {
    console.error('Error updating counter:', error);
    return NextResponse.json({ error: 'Error al actualizar contador' }, { status: 500 });
  }
}
