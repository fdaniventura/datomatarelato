#!/bin/bash
# Script de utilidades para el proyecto Datomatarelato

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Datomatarelato - Utilidades ===${NC}\n"

# Función para mostrar el menú
show_menu() {
    echo "Selecciona una opción:"
    echo "1) Iniciar servidor de desarrollo"
    echo "2) Compilar para producción"
    echo "3) Ver estado de la base de datos"
    echo "4) Backup de datos"
    echo "5) Limpiar caché y node_modules"
    echo "6) Verificar dependencias actualizadas"
    echo "7) Ver últimas entradas (JSON)"
    echo "8) Estadísticas de uso"
    echo "9) Salir"
    echo ""
}

# 1. Iniciar servidor de desarrollo
dev_server() {
    echo -e "${GREEN}Iniciando servidor de desarrollo...${NC}"
    npm run dev
}

# 2. Compilar para producción
build_prod() {
    echo -e "${GREEN}Compilando para producción...${NC}"
    npm run build
}

# 3. Ver estado de la base de datos
check_db() {
    echo -e "${BLUE}Estado de la base de datos:${NC}"
    if [ -f "data/db/datomatarelato.db" ]; then
        echo "✓ Base de datos existe"
        echo "Tamaño: $(du -h data/db/datomatarelato.db | cut -f1)"
        echo -e "\nTablas:"
        sqlite3 data/db/datomatarelato.db ".tables"
        echo -e "\nNúmero de entradas:"
        sqlite3 data/db/datomatarelato.db "SELECT COUNT(*) FROM daily_entries;"
    else
        echo "✗ Base de datos no existe (se creará al primer uso)"
    fi
}

# 4. Backup de datos
backup_data() {
    echo -e "${GREEN}Creando backup de datos...${NC}"
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if [ -f "data/db/datomatarelato.db" ]; then
        cp data/db/datomatarelato.db "$BACKUP_DIR/"
        echo "✓ Base de datos respaldada"
    fi
    
    if [ "$(ls -A data/json)" ]; then
        cp -r data/json "$BACKUP_DIR/"
        echo "✓ Archivos JSON respaldados"
    fi
    
    echo -e "${GREEN}Backup creado en: $BACKUP_DIR${NC}"
}

# 5. Limpiar caché
clean_cache() {
    echo -e "${YELLOW}Limpiando caché...${NC}"
    rm -rf .next
    rm -rf node_modules
    echo "✓ Caché limpiado"
    echo -e "${GREEN}Ejecuta 'npm install' para reinstalar dependencias${NC}"
}

# 6. Verificar actualizaciones
check_updates() {
    echo -e "${BLUE}Verificando actualizaciones...${NC}"
    npm outdated
}

# 7. Ver últimas entradas JSON
show_recent_entries() {
    echo -e "${BLUE}Últimas 5 entradas (JSON):${NC}"
    ls -t data/json/*.json 2>/dev/null | head -5 | while read file; do
        echo -e "\n${GREEN}$(basename $file)${NC}"
        cat "$file" | jq -r '.date, .moodScore, .notes' 2>/dev/null || cat "$file"
    done
}

# 8. Estadísticas de uso
show_stats() {
    echo -e "${BLUE}=== Estadísticas del Proyecto ===${NC}\n"
    
    echo "Archivos TypeScript/TSX:"
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next | wc -l
    
    echo -e "\nLíneas de código:"
    find . \( -name "*.ts" -o -name "*.tsx" \) | grep -v node_modules | grep -v .next | xargs wc -l | tail -1
    
    if [ -f "data/db/datomatarelato.db" ]; then
        echo -e "\nEntradas en la base de datos:"
        sqlite3 data/db/datomatarelato.db "SELECT COUNT(*) FROM daily_entries;" 2>/dev/null || echo "0"
        
        echo -e "\nActividades únicas:"
        sqlite3 data/db/datomatarelato.db "SELECT COUNT(*) FROM activities;" 2>/dev/null || echo "0"
    fi
    
    echo -e "\nArchivos JSON:"
    ls data/json/*.json 2>/dev/null | wc -l || echo "0"
}

# Menú principal
while true; do
    show_menu
    read -p "Opción: " choice
    
    case $choice in
        1) dev_server ;;
        2) build_prod ;;
        3) check_db ;;
        4) backup_data ;;
        5) clean_cache ;;
        6) check_updates ;;
        7) show_recent_entries ;;
        8) show_stats ;;
        9) echo "¡Hasta luego!"; exit 0 ;;
        *) echo -e "${YELLOW}Opción no válida${NC}" ;;
    esac
    
    echo -e "\n${YELLOW}Presiona Enter para continuar...${NC}"
    read
done
