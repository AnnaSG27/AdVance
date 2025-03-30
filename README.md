# AdVance: Publicidad Sin Límites
## Integrantes del Equipo
 - Laura Sofía Jiménez París
 - Miguel Ángel Montoya Areiza
 - José Benjamín Vega Ramírez
 - Anna Sofía Giraldo Carvajal
## Versiones
 - **Sistemas Operativos:** macOS 14.3.1  y Windows 11 Pro 24H2
 - **Lenguajes Utilizados:** Python 3.13.1 , JavaScript , CSS , HTML
 - **Herramienta Utilizada:** Visual Studio Code 1.98.2  
 
## Instrucciones para la ejecución del proyecto

### Configuración inicial
1. Crea una carpeta
2. En esta carpeta clona el repositorio mediante GitBash

### Proceso de ejecución 

1. **Preparar el cliente (Frontend)**:
   - Abre una terminal y navega a la carpeta `advance_app`:
     ```bash
     cd advance_app
     ```
   - Instala las dependencias necesarias:
     ```bash
     npm install
     ```
   - Inicia la aplicación cliente:
     ```bash
     npm run electron_dev
     ```

2. **Preparar el servidor (Backend)**:
   - En una nueva terminal, navega a la carpeta Backend:
     ```bash
     cd ../Backend
     ```
   - Crea y activa el entorno virtual
     ```bash
     python -m venv (Nombre_entorno)
     ```
     ```bash
     (Nombre_entorno)\Scripts\activate
     ```
   - Instala las dependencias de Python:
     ```bash
     pip install -r requirements.txt
     ```
   - Inicia el servidor de desarrollo:
     ```bash
     py manage.py runserver
     ```

**Importante**: 
- Ambos procesos deben permanecer ejecutándose en terminales separadas
- El orden de ejecución puede ser indistinto (servidor primero o cliente primero)
