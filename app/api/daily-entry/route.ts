import { NextRequest, NextResponse } from 'next/server';
import { saveDailyFormJSON, exportJSONToDatabase } from '@/lib/json-handler';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar datos básicos
    if (!data.date || !data.moodScore) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Guardar primero en JSON
    const jsonPath = saveDailyFormJSON(data);
    console.log('Datos guardados en JSON:', jsonPath);

    // Luego exportar a la base de datos SQL
    try {
      const entryId = await exportJSONToDatabase(data.date);
      console.log('Datos exportados a BD con ID:', entryId);
      
      return NextResponse.json({
        success: true,
        message: 'Datos guardados correctamente',
        jsonPath,
        entryId,
      });
    } catch (dbError) {
      console.error('Error al guardar en BD, pero JSON guardado:', dbError);
      return NextResponse.json({
        success: true,
        message: 'Datos guardados en JSON (error en BD)',
        jsonPath,
        warning: 'No se pudo guardar en la base de datos',
      });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al guardar los datos', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await import('@/lib/db/database');
    const entries = db.getAllEntries();
    
    return NextResponse.json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos', details: String(error) },
      { status: 500 }
    );
  }
}
