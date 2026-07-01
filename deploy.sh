#!/bin/bash
NC='\033[0m'
RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'

FOLDER="./source"
COMMAND=""

# Procesa los argumentos
for arg in "$@"; do
    case $arg in
        --folder=*)
        FOLDER="${arg#*=}"
        ;;
        *)
        COMMAND="$arg"
        ;;
    esac
done

# Verifica si se proporcionó un comando
if [ -z "$COMMAND" ]; then
    echo -e "${RED}No se proporcionó un comando.${NC}"
    echo -e "Uso: ./deploy.sh <install|start|build|lint|format|typecheck|test|test:coverage>"
    exit 1
fi

# Cambia al directorio del proyecto (source/)
if [ -d "$FOLDER" ]; then
    echo
    echo -e "${BLUE}Cambiando al directorio $FOLDER${NC}"
    cd "$FOLDER" || exit 1
else
    echo -e "${RED}Directorio no encontrado: $FOLDER${NC}"
    exit 1
fi

# Ejecuta el comando
if [ "$COMMAND" == "install" ]; then
    echo
    echo -e "${BLUE}Iniciando proceso de instalación...${NC}"
    npm install
else
    echo
    echo -e "${GREEN}Ejecutando: npm run ${COMMAND}...${NC}"
    npm run "${COMMAND}"
fi
