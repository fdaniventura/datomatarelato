# 🚀 Guía de Inicio Rápido

## ✅ Estado del Proyecto

El entorno está completamente configurado y listo para usar. Ya se han completado:

- ✅ Proyecto Next.js 14 inicializado con TypeScript
- ✅ Dependencias instaladas (React Hook Form, Zod, SQLite, Tailwind CSS, etc.)
- ✅ Estructura de carpetas creada
- ✅ Base de datos SQLite configurada con esquema
- ✅ Sistema de almacenamiento dual (JSON + SQL)
- ✅ Componentes base implementados:
  - Dashboard principal
  - Formulario diario
  - Vista de entradas
  - API endpoints
- ✅ Build de producción verificado ✓

## 🎯 Próximos Pasos Inmediatos

### 1. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

### 2. Probar la Aplicación

Una vez iniciado el servidor:

1. **Dashboard Principal** (/)
   - Verás 4 tarjetas de navegación
   - Panel con resumen rápido

2. **Formulario Diario** (/daily-form)
   - Registra tu primera entrada del día
   - Completa fecha, estado de ánimo (1-10)
   - Añade actividades con el botón "+ Añadir Actividad"
   - Guarda la entrada

3. **Ver Entradas** (/entries)
   - Consulta todas tus entradas guardadas
   - Las más recientes aparecen primero

## 📂 Ubicación de los Datos

Los datos se guardan automáticamente en:

```
data/
├── json/              # Archivos JSON de respaldo
│   └── daily-2025-11-15.json
└── db/                # Base de datos SQLite
    └── datomatarelato.db
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev           # Iniciar servidor de desarrollo

# Producción
npm run build         # Compilar para producción
npm start             # Ejecutar versión de producción

# Calidad de código
npm run lint          # Verificar código
```

## 📊 Próximas Funcionalidades a Implementar

Según prioridad (ver `ROADMAP.md` para detalles):

1. **Gráficos de estadísticas** (línea de tiempo del ánimo)
2. **Filtros por fecha** en la vista de entradas
3. **Calendario interactivo** para navegación
4. **Exportación de datos** a CSV/JSON
5. **Análisis de correlaciones** (ánimo vs actividades)

## 🎨 Personalización Rápida

### Cambiar colores del tema

Edita `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',  // Azul personalizado
      // ... añade más colores
    }
  }
}
```

### Añadir nueva página

1. Crea `app/mi-pagina/page.tsx`
2. Añade enlace en el Dashboard (`components/dashboard/Dashboard.tsx`)

## 🐛 Solución de Problemas Comunes

### Error de compilación
```bash
rm -rf .next
npm run dev
```

### Puerto 3000 ocupado
```bash
# Usar otro puerto
PORT=3001 npm run dev
```

### Problemas con la BD
```bash
# Eliminar y recrear la BD
rm data/db/datomatarelato.db
# La BD se recreará automáticamente al iniciar
```

## 📚 Documentación Completa

- **`README.md`**: Información general del proyecto
- **`DEVELOPMENT.md`**: Guía de desarrollo detallada
- **`ROADMAP.md`**: Plan de funcionalidades futuras

## 🎉 ¡Listo para Empezar!

Ejecuta `npm run dev` y empieza a registrar tus actividades diarias.

---

**¿Necesitas ayuda?** Consulta los archivos de documentación o los comentarios en el código.
