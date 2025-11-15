# Guía de Desarrollo

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

### Scripts Disponibles

```bash
npm run dev         # Servidor de desarrollo con hot reload
npm run build       # Compilar para producción
npm run start       # Iniciar servidor de producción
npm run lint        # Verificar código con ESLint
npm run lint:fix    # Corregir problemas de linting automáticamente
```

## 📁 Estructura de Archivos Clave

### Rutas de la Aplicación (`/app`)

- **`page.tsx`**: Dashboard principal
- **`daily-form/page.tsx`**: Formulario para registro diario
- **`entries/page.tsx`**: Lista de entradas guardadas
- **`statistics/page.tsx`**: Visualización de estadísticas (en desarrollo)
- **`api/daily-entry/route.ts`**: API endpoint para CRUD de entradas

### Componentes (`/components`)

- **`dashboard/Dashboard.tsx`**: Panel de control con tarjetas de navegación
- **`forms/DailyForm.tsx`**: Formulario completo con validación

### Lógica de Negocio (`/lib`)

- **`db/database.ts`**: Funciones para interactuar con SQLite
- **`db/schema.sql`**: Esquema de la base de datos
- **`json-handler.ts`**: Manejo de archivos JSON intermedios

### Datos (`/data`)

- **`json/`**: Archivos JSON de respaldo diario
- **`db/`**: Base de datos SQLite

## 🔧 Flujo de Datos

### Guardado de Entrada Diaria

1. Usuario completa el formulario en `/daily-form`
2. El formulario se envía via POST a `/api/daily-entry`
3. Los datos se guardan en:
   - **JSON**: `/data/json/daily-YYYY-MM-DD.json` (respaldo)
   - **SQLite**: Base de datos relacional para consultas

### Esquema de Datos

```typescript
interface DailyFormData {
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
```

## 🗄️ Base de Datos SQLite

### Tablas Principales

1. **`daily_entries`**: Entradas diarias principales
   - `id`, `entry_date`, `mood_score`, `notes`, `raw_json`, `created_at`, `updated_at`

2. **`activities`**: Catálogo de actividades
   - `id`, `name`, `category`, `description`, `created_at`

3. **`entry_activities`**: Relación muchos-a-muchos
   - `id`, `entry_id`, `activity_id`, `duration_minutes`, `intensity`, `notes`

4. **`custom_metrics`**: Métricas adicionales
   - `id`, `entry_id`, `metric_name`, `metric_value`, `metric_unit`

### Consultas Útiles

```typescript
// Obtener todas las entradas
const entries = db.getAllEntries();

// Obtener entrada por fecha
const entry = db.getEntryByDate('2025-11-15');

// Crear nueva entrada
db.createEntry({
  entry_date: '2025-11-15',
  mood_score: 7,
  notes: 'Buen día',
  raw_json: JSON.stringify(data)
});

// Obtener actividades de una entrada
const activities = db.getActivitiesByEntry(entryId);
```

## 🎨 Estilos con Tailwind CSS

Este proyecto usa Tailwind CSS para los estilos. Configuración en:
- `tailwind.config.ts`: Configuración de Tailwind
- `app/globals.css`: Estilos globales

### Clases Comunes Usadas

```tsx
// Contenedores
className="max-w-6xl mx-auto p-8"

// Tarjetas
className="bg-white rounded-lg shadow-md p-6"

// Botones
className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"

// Inputs
className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
```

## 📝 Añadir Nuevas Funcionalidades

### Ejemplo: Añadir Nueva Página

1. Crear archivo en `/app/nueva-pagina/page.tsx`
2. Exportar componente por defecto
3. Añadir enlace en el Dashboard

```tsx
// app/nueva-pagina/page.tsx
export default function NuevaPagina() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1>Nueva Página</h1>
    </div>
  );
}
```

### Ejemplo: Añadir Nuevo Endpoint de API

1. Crear archivo en `/app/api/nombre/route.ts`
2. Exportar funciones GET, POST, etc.

```typescript
// app/api/nombre/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hola' });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  return NextResponse.json({ success: true, data });
}
```

## 🧪 Testing (Futuro)

Estructura sugerida para tests:

```
__tests__/
├── components/
│   └── DailyForm.test.tsx
├── lib/
│   ├── database.test.ts
│   └── json-handler.test.ts
└── api/
    └── daily-entry.test.ts
```

## 🐛 Debugging

### Ver logs de la base de datos

La inicialización de la BD tiene `verbose: console.log`, así que verás las consultas SQL en la consola.

### Inspeccionar archivos JSON

```bash
cat data/json/daily-2025-11-15.json | jq
```

### Inspeccionar base de datos SQLite

```bash
sqlite3 data/db/datomatarelato.db
# Dentro de sqlite3:
.tables
.schema daily_entries
SELECT * FROM daily_entries;
```

## 📦 Dependencias Principales

- **next**: Framework React
- **react-hook-form**: Manejo de formularios
- **zod**: Validación de esquemas
- **better-sqlite3**: Base de datos SQLite
- **tailwindcss**: Estilos CSS utility-first
- **lucide-react**: Iconos
- **date-fns**: Manejo de fechas
- **recharts**: Gráficos (para futuras estadísticas)

## 🔐 Seguridad

- No hay autenticación implementada aún (app de uso local)
- Los datos JSON y SQLite están en `.gitignore`
- Para producción, considera añadir autenticación y cifrado

## 🚢 Deployment

### Vercel (Recomendado para Next.js)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

⚠️ **Nota**: La base de datos SQLite no persiste en Vercel (serverless). Para producción, considera migrar a PostgreSQL/MySQL.

### Alternativas

- **Docker**: Crear Dockerfile para containerizar la app
- **VPS**: Desplegar en servidor propio con PM2

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
