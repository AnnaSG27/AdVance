Para ejecutar el programa, hay que crear una carpeta que sea la raíz del proyecto y agregar todos los archivos que están en el repositorio.

EJECUTAR EL CLIENTE

Después, se ingresa a la carperta advance_app, se abre la terminal y se ejecuta el comando npm install para instalar todas las dependencias de la aplicación.
Después de hacer esto, se ejecuta el comando npm run electron_dev. Esto ejecutará el cliente.

EJECUTAR EL SERVIDOR

Para correr el servidor, es necesario, en otra terminal, salirse de advance_app, entrar a la carpeta Backend y ejecutar venv\Scripts\activate para activar el entorno virtual. Después de activado el entorno virtual, ejecutar el siguiente comando: pip install -r requirements.txt. Esto, instalará las dependencias necesarias para correr el servidor.
Una vez hecho lo anterior, ejecutar el comando py manage.py runserver para inciar el servidor.


