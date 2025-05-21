#!/usr/bin/env bash
# build.sh

# Aplicar migraciones
python3 manage.py makemigrations
python3 manage.py migrate

# Recolectar archivos estáticos
python3 manage.py collectstatic --noinpu

pip3 install -r requirements.txt