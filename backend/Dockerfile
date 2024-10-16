# Verwende ein offizielles Python-Image als Basis
FROM python:3.10-slim

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die Anforderungen in den Container
COPY requirements.txt requirements.txt

# Installiere Python-Abhängigkeiten
RUN pip install --no-cache-dir -r requirements.txt

# Kopiere den Rest des Codes in das Arbeitsverzeichnis
COPY . .

# Setze Umgebungsvariablen (optional)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Migriere die Datenbank und starte den Django-Server
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
