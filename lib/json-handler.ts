import fs from 'fs';
import path from 'path';

const JSON_DATA_DIR = path.join(process.cwd(), 'data', 'json');

// Asegurar que el directorio existe
if (!fs.existsSync(JSON_DATA_DIR)) {
  fs.mkdirSync(JSON_DATA_DIR, { recursive: true });
}

export interface DailyFormData {
  date: string;
  moodScore: number;
  activities: Array<{
    name: string;
    duration?: number;
    intensity?: number;
    category?: string;
  }>;
  customMetrics?: Array<{
    name: string;
    value: number;
    unit?: string;
  }>;
  notes?: string;
  timestamp: string;
}

/**
 * Guardar datos del formulario en formato JSON
 */
export function saveDailyFormJSON(data: DailyFormData): string {
  const filename = `daily-${data.date}.json`;
  const filepath = path.join(JSON_DATA_DIR, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  return filepath;
}

/**
 * Leer datos JSON de un día específico
 */
export function readDailyFormJSON(date: string): DailyFormData | null {
  const filename = `daily-${date}.json`;
  const filepath = path.join(JSON_DATA_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    return null;
  }
  
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content) as DailyFormData;
}

/**
 * Listar todos los archivos JSON disponibles
 */
export function listDailyFormJSONs(): string[] {
  const files = fs.readdirSync(JSON_DATA_DIR);
  return files
    .filter(file => file.startsWith('daily-') && file.endsWith('.json'))
    .map(file => file.replace('daily-', '').replace('.json', ''))
    .sort()
    .reverse(); // Más recientes primero
}

/**
 * Exportar datos JSON a la base de datos SQL
 */
export async function exportJSONToDatabase(date: string) {
  const jsonData = readDailyFormJSON(date);
  if (!jsonData) {
    throw new Error(`No se encontró archivo JSON para la fecha ${date}`);
  }

  const { db } = await import('./db/database');
  
  try {
    // Insertar entrada diaria
    const result = db.createEntry({
      entry_date: jsonData.date,
      mood_score: jsonData.moodScore,
      notes: jsonData.notes || '',
      raw_json: JSON.stringify(jsonData)
    });

    const entryId = result.lastInsertRowid as number;

    // Insertar actividades
    for (const activity of jsonData.activities) {
      // Crear actividad si no existe
      try {
        const activityResult = db.createActivity({
          name: activity.name,
          category: activity.category
        });
        
        const activityId = activityResult.lastInsertRowid as number;
        
        db.addActivityToEntry({
          entry_id: entryId,
          activity_id: activityId,
          duration_minutes: activity.duration,
          intensity: activity.intensity
        });
      } catch {
        // Si la actividad ya existe, buscarla y asociarla
        const activities = db.getAllActivities() as Array<{ id: number; name: string }>;
        const existingActivity = activities.find(a => a.name === activity.name);
        
        if (existingActivity) {
          db.addActivityToEntry({
            entry_id: entryId,
            activity_id: existingActivity.id,
            duration_minutes: activity.duration,
            intensity: activity.intensity
          });
        }
      }
    }

    // Insertar métricas personalizadas
    if (jsonData.customMetrics) {
      for (const metric of jsonData.customMetrics) {
        db.addCustomMetric({
          entry_id: entryId,
          metric_name: metric.name,
          metric_value: metric.value,
          metric_unit: metric.unit
        });
      }
    }

    return entryId;
  } catch (error) {
    console.error('Error al exportar JSON a base de datos:', error);
    throw error;
  }
}
