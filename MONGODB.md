# 🍃 Integracja MongoDB

Aplikacja obsługuje zarówno MongoDB jak i SQLite. MongoDB jest zalecany do produkcji.

## 🚀 Szybki Start

### 1. Uruchom MongoDB (Docker)

```bash
docker-compose up -d mongodb
```

Sprawdź czy działa:
```bash
docker ps | grep mongodb
```

### 2. Uruchom aplikację

```bash
npm run dev:all
```

Gotowe! Dane będą zapisywane do MongoDB.

## ⚙️ Konfiguracja

Plik `.env`:

```env
# Użyj MongoDB zamiast SQLite
USE_MONGODB=true

# Connection string MongoDB
MONGODB_URI=mongodb://localhost:27017

# Nazwa bazy danych
MONGODB_DB_NAME=formularze_db

# Port serwera
PORT=3001
```

## 📦 Kolekcje MongoDB

Aplikacja automatycznie tworzy następujące kolekcje:

- `experiments` - podstawowe formularze eksperymentów
- `experiments_extended` - rozszerzone formularze eksperymentów  
- `persons` - dane osobowe
- `form_submissions` - inne formularze

## 🔍 Testowanie

### Test połączenia z MongoDB

```bash
# W przeglądarce otwórz konsolę deweloperską (F12)
# Kliknij "Test połączenia" w aplikacji

# Lub użyj curl:
curl http://localhost:3001/api/health
```

Odpowiedź powinna zawierać `"database": "MongoDB"`.

### Zapisz testowy dokument

1. Otwórz aplikację: http://localhost:5173/
2. Wybierz szablon formularza (np. "Formularz eksperymentu")
3. Wypełnij pola
4. Kliknij "💾 Zapisz do bazy danych"

### Zobacz zapisane dane

Zainstaluj MongoDB Compass lub użyj mongosh:

```bash
# W terminalu
docker exec -it formularze_mongodb mongosh

# W mongosh:
use formularze_db
db.experiments.find().pretty()
```

## 🔄 Przełączanie między bazami

### Użyj MongoDB

```env
USE_MONGODB=true
```

### Użyj SQLite (domyślne)

```env
USE_MONGODB=false
```

## 📊 MongoDB Cloud (Atlas)

Możesz użyć MongoDB Atlas (darmowy plan 512MB):

1. Zarejestruj się: https://www.mongodb.com/cloud/atlas/register
2. Utwórz cluster
3. Pobierz connection string
4. Zaktualizuj `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=formularze_db
```

## 🛠️ API Endpoints

### Zapisz dokument

```bash
POST http://localhost:3001/api/mongodb/save
Content-Type: application/json

{
  "collection": "experiments",
  "data": {
    "name": "Test eksperyment",
    "description": "Opis",
    "project_id": "PRJ-001"
  }
}
```

### Pobierz dokumenty

```bash
GET http://localhost:3001/api/mongodb/experiments
```

## 🐛 Troubleshooting

### MongoDB nie działa?

```bash
# Sprawdź logi
docker logs formularze_mongodb

# Restart kontenera
docker-compose restart mongodb

# Sprawdź czy port 27017 jest wolny
netstat -an | grep 27017
```

### Backend nie może połączyć się z MongoDB?

1. Sprawdź czy MongoDB działa: `docker ps`
2. Sprawdź `.env`: `USE_MONGODB=true`
3. Sprawdź connection string w `.env`
4. Restart backendu: Ctrl+C i `npm run server`

### Aplikacja nadal używa SQLite?

Backend automatycznie wraca do SQLite jeśli MongoDB jest niedostępny. Sprawdź logi serwera.

## 📚 Więcej informacji

- MongoDB Docs: https://docs.mongodb.com/
- MongoDB Node.js Driver: https://mongodb.github.io/node-mongodb-native/
- MongoDB Compass (GUI): https://www.mongodb.com/products/compass
