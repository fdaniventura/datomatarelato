-- Esquema de base de datos para el sistema de datos y estados de ánimo

-- Tabla para almacenar los registros diarios procesados
CREATE TABLE IF NOT EXISTS daily_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date DATE NOT NULL UNIQUE,
    mood_score INTEGER CHECK(mood_score >= 1 AND mood_score <= 10),
    notes TEXT,
    raw_json TEXT, -- JSON original del formulario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para actividades registradas
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación entre entradas diarias y actividades
CREATE TABLE IF NOT EXISTS entry_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    duration_minutes INTEGER,
    intensity INTEGER CHECK(intensity >= 1 AND intensity <= 5),
    notes TEXT,
    FOREIGN KEY (entry_id) REFERENCES daily_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    UNIQUE(entry_id, activity_id)
);

-- Tabla para métricas personalizadas
CREATE TABLE IF NOT EXISTS custom_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    metric_unit TEXT,
    FOREIGN KEY (entry_id) REFERENCES daily_entries(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_entry_date ON daily_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_entry_activities_entry ON entry_activities(entry_id);
CREATE INDEX IF NOT EXISTS idx_entry_activities_activity ON entry_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_custom_metrics_entry ON custom_metrics(entry_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER IF NOT EXISTS update_daily_entries_timestamp 
AFTER UPDATE ON daily_entries
BEGIN
    UPDATE daily_entries SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
