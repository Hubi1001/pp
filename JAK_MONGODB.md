# 🚀 Jak wysyłać rekordy do MongoDB

## Krok 1: Uruchom MongoDB

### Opcja A: Docker (Zalecane)

```bash
# Uruchom MongoDB w kontenerze
docker compose up -d mongodb

# Sprawdź czy działa
docker ps | grep mongodb
```

### Opcja B: MongoDB lokalnie

- **Windows**: Pobierz i zainstaluj z https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community`
- **Linux**: `sudo apt install mongodb` lub `sudo yum install mongodb-org`

Uruchom:
```bash
mongod
```

### Opcja C: MongoDB Atlas (Cloud - DARMOWY)

1. Zarejestruj się: https://www.mongodb.com/cloud/atlas/register
2. Utwórz darmowy cluster (512MB)
3. Kliknij "Connect" → "Connect your application"
4. Skopiuj connection string

## Krok 2: Skonfiguruj aplikację

Edytuj plik `.env` w głównym katalogu:

```env
# Włącz MongoDB
USE_MONGODB=true

# Connection string
# Dla Docker/lokalnego:
MONGODB_URI=mongodb://localhost:27017

# Dla MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/

# Nazwa bazy danych
MONGODB_DB_NAME=formularze_db
```

## Krok 3: Uruchom aplikację

```bash
# Zatrzymaj poprzednie procesy (Ctrl+C)

# Uruchom frontend + backend
npm run dev:all
```

## Krok 4: Testuj

1. Otwórz: http://localhost:5173/
2. Wybierz szablon (np. "Formularz eksperymentu")
3. Wypełnij formularz
4. Kliknij **"💾 Zapisz do bazy danych"**
5. Powinieneś zobaczyć: ✅ "Dokument zapisany w kolekcji experiments"

## 📊 Zobacz zapisane dane

### MongoDB Compass (GUI - Zalecane)

1. Pobierz: https://www.mongodb.com/products/compass
2. Połącz się: `mongodb://localhost:27017`
3. Wybierz bazę: `formularze_db`
4. Zobacz kolekcje: `experiments`, `persons`, itp.

### Mongosh (CLI)

```bash
# Połącz się z MongoDB
docker exec -it formularze_mongodb mongosh

# W mongosh:
use formularze_db
db.experiments.find().pretty()
db.persons.find().pretty()
```

### VS Code Extension

1. Zainstaluj "MongoDB for VS Code"
2. Połącz się: `mongodb://localhost:27017`
3. Przeglądaj dane w VS Code

## 🔧 Struktura danych

Każdy dokument zawiera:

```json
{
  "_id": "ObjectId automatycznie wygenerowany",
  "formType": "experiment",
  "name": "Nazwa eksperymentu",
  "project_id": "PRJ-001",
  "description": "Opis",
  "createdAt": "2025-11-21T10:00:00.000Z",
  "updatedAt": "2025-11-21T10:00:00.000Z"
}
```

## ✅ Weryfikacja

Sprawdź czy MongoDB działa:

```bash
# Test connection
curl http://localhost:3001/api/health
```

Powinieneś zobaczyć:
```json
{
  "status": "OK",
  "message": "Backend działa poprawnie",
  "database": "MongoDB",
  "timestamp": "..."
}
```

Jeśli widzisz `"database": "SQLite"`, oznacza to że MongoDB nie jest dostępny i aplikacja używa SQLite jako fallback.

## 🐛 Problemy?

### "MongoDB nie jest włączony"

- Sprawdź plik `.env`: `USE_MONGODB=true`
- Zrestartuj backend: Ctrl+C i `npm run dev:all`

### "Cannot connect to MongoDB"

- Sprawdź czy MongoDB działa: `docker ps` lub `mongosh`
- Sprawdź connection string w `.env`
- Sprawdź czy port 27017 jest wolny: `netstat -an | grep 27017`

### Backend używa SQLite zamiast MongoDB

Backend automatycznie wraca do SQLite gdy MongoDB jest niedostępny. To jest zabezpieczenie - aplikacja zawsze będzie działać. Sprawdź logi backendu w terminalu.

## 📚 Dokumentacja

- Pełna dokumentacja: [MONGODB.md](./MONGODB.md)
- MongoDB Tutorial: https://docs.mongodb.com/manual/tutorial/
- Node.js Driver: https://mongodb.github.io/node-mongodb-native/
