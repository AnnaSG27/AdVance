# AdVance: Publicidad Sin Límites
## Integrantes del Equipo
 - Laura Sofía Jiménez París
 - Miguel Ángel Montoya Areiza
 - José Benjamín Vega Ramírez
 - Anna Sofía Giraldo Carvajal
## Versiones
 - **Sistemas Operativos:** MacOS Sequoia 15.5, MacOS 14.3.1, Windows 11 Pro 24H2
 - **Lenguajes Utilizados:** Python 3.13.1 , JavaScript , CSS , HTML
 - **Herramienta Utilizada:** Visual Studio Code 1.98.2  
 
## Instrucciones para la ejecución del proyecto

### Configuración inicial
1. Crea una carpeta
2. En esta carpeta clona el repositorio mediante GitBash
   ```bash
   # Mac y Windows
   git clone https://github.com/AnnaSG27/AdVance.git
   ```

### Proceso de ejecución 

1. **Preparar el cliente (Frontend)**:
   - Abre una terminal en la carpeta del proyecto y navega a la carpeta `Client`:
     ```bash
     # Mac y Windows 
     cd Client
     ```
   - Instala las dependencias necesarias:
     ```bash
     # Mac y Windows
     npm install
     ```
   - Inicia la aplicación cliente:
     ```bash
     # Mac y Windows
     npm run electron-dev
     ```

2. **Preparar el servidor (Backend)**:
   - En una nueva terminal, abre la carpeta del proyecto y navega a la carpeta `Server`:
     ```bash
     # Mac y Windows
     cd Server
     ```
   - Crea y activa el entorno virtual
	   ```bash
     # Mac
     python3 -m venv (Nombre_entorno)
     ```
     ```bash
     source (Nombre_entorno)/bin/activate
     ```
   
     ```bash
     # Windows
     python -m venv (Nombre_entorno)
     ```
     ```bash
     (Nombre_entorno)\Scripts\activate
     ```
   - Instala las dependencias de Python:
     ```bash
     # Mac y Windows
     pip install -r requirements.txt
     ```
   - Inicia el servidor de desarrollo:
     ```bash
     # Mac y Windows
     py manage.py runserver
     ```

**Importante**:
- Ambos procesos deben permanecer ejecutándose en terminales separadas
- El orden de ejecución puede ser indistinto (servidor primero o cliente primero)
