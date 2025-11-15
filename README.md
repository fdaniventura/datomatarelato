# Datomatarelato

**Recopilador de datos de actividades cruzado con ánimo**

Aplicación web desarrollada con Next.js para el seguimiento diario de actividades y estados de ánimo, con análisis de datos y visualización de estadísticas.

## 🚀 Características

- **Formulario Diario**: Registra tus actividades, estado de ánimo y notas del día
- **Almacenamiento Dual**: 
  - Archivos JSON intermedios para respaldo y auditoría
  - Base de datos SQLite para consultas estructuradas y relacionales
- **Panel de Control**: Vista general de tus registros y estadísticas
- **Visualización de Datos**: (En desarrollo) Gráficos y análisis de tendencias

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: SQLite (better-sqlite3)
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React
- **Gráficos**: Recharts (para estadísticas futuras)

## 📦 Instalación y Uso

```bash
# Instalar dependencias (ya realizado)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
datomatarelato/
├── app/                      # Rutas de Next.js (App Router)
│   ├── api/                  # API Routes
│   │   └── daily-entry/      # Endpoints para entradas diarias
│   ├── daily-form/           # Página del formulario diario
│   ├── entries/              # Página de visualización de entradas
│   └── page.tsx              # Página principal (Dashboard)
├── components/               # Componentes React
│   ├── dashboard/            # Componentes del panel de control
│   └── forms/                # Formularios
├── lib/                      # Lógica de negocio
│   ├── db/                   # Configuración de base de datos
│   │   ├── schema.sql        # Esquema SQL
│   │   └── database.ts       # Funciones de BD
│   └── json-handler.ts       # Manejo de archivos JSON
├── data/                     # Datos generados
│   ├── json/                 # Archivos JSON de respaldo
│   └── db/                   # Base de datos SQLite
└── public/                   # Archivos estáticos
```

## 🗄️ Modelo de Datos

### Base de Datos SQLite

- **daily_entries**: Registros diarios principales
- **activities**: Catálogo de actividades
- **entry_activities**: Relación entre entradas y actividades
- **custom_metrics**: Métricas personalizadas

### JSON Intermedio

Cada entrada diaria se guarda primero como JSON con estructura:
```json
{
  "date": "2025-11-15",
  "moodScore": 7,
  "activities": [...],
  "customMetrics": [...],
  "notes": "...",
  "timestamp": "2025-11-15T14:30:00Z"
}
```

## 🎯 Uso

1. **Registro Diario**: Accede al formulario desde el dashboard o `/daily-form`
2. **Ver Entradas**: Consulta tus registros en `/entries`
3. **Estadísticas**: (Próximamente) Visualiza tendencias y análisis

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm start        # Iniciar en producción
npm run lint     # Linting del código
```

## 📝 Roadmap

- [x] Configuración inicial del proyecto
- [x] Formulario diario básico
- [x] Almacenamiento en JSON y SQLite
- [x] Panel de control
- [x] Visualización de entradas
- [ ] Estadísticas y gráficos
- [ ] Análisis de correlaciones (ánimo vs actividades)
- [ ] Exportación de datos
- [ ] Filtros y búsqueda avanzada

## 👤 Autor

[@fdaniventura](https://github.com/fdaniventura)

