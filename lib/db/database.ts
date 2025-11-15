import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'db', 'datomatarelato.db');
const SCHEMA_PATH = path.join(process.cwd(), 'lib', 'db', 'schema.sql');

// Asegurar que el directorio de la base de datos existe
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializar la base de datos
let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH, { verbose: console.log });
    initializeDatabase(dbInstance);
  }
  return dbInstance;
}

function initializeDatabase(database: Database.Database) {
  // Leer y ejecutar el esquema SQL
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  database.exec(schema);
  console.log('Base de datos inicializada correctamente');
}

// Funciones de utilidad para operaciones comunes
export const db = {
  // Obtener todas las entradas diarias
  getAllEntries: () => {
    const database = getDatabase();
    return database.prepare('SELECT * FROM daily_entries ORDER BY entry_date DESC').all();
  },

  // Obtener una entrada por fecha
  getEntryByDate: (date: string) => {
    const database = getDatabase();
    return database.prepare('SELECT * FROM daily_entries WHERE entry_date = ?').get(date);
  },

  // Crear una nueva entrada diaria
  createEntry: (data: {
    entry_date: string;
    mood_score?: number;
    notes?: string;
    raw_json: string;
  }) => {
    const database = getDatabase();
    const stmt = database.prepare(`
      INSERT INTO daily_entries (entry_date, mood_score, notes, raw_json)
      VALUES (@entry_date, @mood_score, @notes, @raw_json)
    `);
    return stmt.run(data);
  },

  // Actualizar una entrada existente
  updateEntry: (id: number, data: {
    mood_score?: number;
    notes?: string;
    raw_json?: string;
  }) => {
    const database = getDatabase();
    const fields: string[] = [];
    const values: Record<string, string | number> = { id };
    
    if (data.mood_score !== undefined) {
      fields.push('mood_score = @mood_score');
      values.mood_score = data.mood_score;
    }
    if (data.notes !== undefined) {
      fields.push('notes = @notes');
      values.notes = data.notes;
    }
    if (data.raw_json !== undefined) {
      fields.push('raw_json = @raw_json');
      values.raw_json = data.raw_json;
    }
    
    if (fields.length === 0) return;
    
    const stmt = database.prepare(`
      UPDATE daily_entries SET ${fields.join(', ')} WHERE id = @id
    `);
    return stmt.run(values);
  },

  // Actividades
  getAllActivities: () => {
    const database = getDatabase();
    return database.prepare('SELECT * FROM activities ORDER BY name').all();
  },

  createActivity: (data: { name: string; category?: string; description?: string }) => {
    const database = getDatabase();
    const stmt = database.prepare(`
      INSERT INTO activities (name, category, description)
      VALUES (@name, @category, @description)
    `);
    return stmt.run(data);
  },

  // Asociar actividad con entrada
  addActivityToEntry: (data: {
    entry_id: number;
    activity_id: number;
    duration_minutes?: number;
    intensity?: number;
    notes?: string;
  }) => {
    const database = getDatabase();
    const stmt = database.prepare(`
      INSERT INTO entry_activities (entry_id, activity_id, duration_minutes, intensity, notes)
      VALUES (@entry_id, @activity_id, @duration_minutes, @intensity, @notes)
    `);
    return stmt.run(data);
  },

  // Obtener actividades de una entrada
  getActivitiesByEntry: (entryId: number) => {
    const database = getDatabase();
    return database.prepare(`
      SELECT a.*, ea.duration_minutes, ea.intensity, ea.notes as activity_notes
      FROM entry_activities ea
      JOIN activities a ON ea.activity_id = a.id
      WHERE ea.entry_id = ?
    `).all(entryId);
  },

  // Guardar métrica personalizada
  addCustomMetric: (data: {
    entry_id: number;
    metric_name: string;
    metric_value: number;
    metric_unit?: string;
  }) => {
    const database = getDatabase();
    const stmt = database.prepare(`
      INSERT INTO custom_metrics (entry_id, metric_name, metric_value, metric_unit)
      VALUES (@entry_id, @metric_name, @metric_value, @metric_unit)
    `);
    return stmt.run(data);
  },

  // Cerrar la base de datos
  close: () => {
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }
  }
};

export default db;
