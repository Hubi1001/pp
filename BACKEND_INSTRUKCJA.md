# Backend i Baza Danych - Instrukcja

## 📦 Wymagania

- **Node.js** (v16 lub nowszy)
- **PostgreSQL** (v12 lub nowszy)

## 🗄️ Konfiguracja bazy danych

### 1. Instalacja PostgreSQL

**Windows:**
- Pobierz z: https://www.postgresql.org/download/windows/
- Zainstaluj i zapamiętaj hasło użytkownika `postgres`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Tworzenie bazy danych

Połącz się z PostgreSQL:

```bash
psql -U postgres
```

Stwórz bazę danych:

```sql
CREATE DATABASE formularze_db;
```

Wyjdź z psql:
```
\q
```

### 3. Inicjalizacja schematu

Wykonaj plik SQL z schematem:

```bash
psql -U postgres -d formularze_db -f database/schema.sql
```

Lub ręcznie w psql:
```bash
psql -U postgres -d formularze_db
```

Następnie wklej zawartość pliku `database/schema.sql`.

## ⚙️ Konfiguracja środowiska

### 1. Skopiuj plik konfiguracyjny

```bash
cp .env.example .env
```

### 2. Edytuj plik `.env`

Uzupełnij dane dostępowe do bazy danych:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=twoje_haslo_tutaj
DB_NAME=formularze_db

PORT=3001
FRONTEND_URL=http://localhost:5173
```

## 🚀 Uruchamianie

### Opcja 1: Frontend i Backend oddzielnie

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### Opcja 2: Wszystko jednocześnie

```bash
npm run dev:all
```

### Opcja 3: Docker Compose (najłatwiejsza!) 🐳

Wymaga: Docker Desktop

```bash
# Uruchom PostgreSQL i Backend w kontenerach
docker-compose up -d

# Frontend uruchom normalnie
npm run dev
```

Zatrzymanie:
```bash
docker-compose down
```

Usunięcie danych (UWAGA!):
```bash
docker-compose down -v
```

## 🧪 Testowanie API

### Health Check

```bash
curl http://localhost:3001/api/health
```

Odpowiedź:
```json
{
  "status": "OK",
  "message": "Backend działa poprawnie",
  "timestamp": "2025-11-20T15:30:00.000Z"
}
```

### Zapisywanie eksperymentu (podstawowy)

```bash
curl -X POST http://localhost:3001/api/experiments \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJ-001",
    "name": "Test eksperymentu",
    "author_id": 1,
    "form_id": "FORM-001",
    "description": "Opis testowy",
    "status": "new"
  }'
```

### Pobieranie wszystkich eksperymentów

```bash
curl http://localhost:3001/api/experiments
```

### Zapisywanie eksperymentu (rozszerzony)

```bash
curl -X POST http://localhost:3001/api/experiments/extended \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJ-002",
    "name": "Test eksperymentu rozszerzonego",
    "author_id": 1,
    "description": "Opis testowy",
    "status": "new",
    "start_date": "2025-11-20",
    "priority": "Wysoki",
    "budget": 10000.00
  }'
```

### Zapisywanie osoby

```bash
curl -X POST http://localhost:3001/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jan",
    "lastName": "Kowalski",
    "age": 30,
    "email": "jan.kowalski@example.com"
  }'
```

### Uniwersalne zapisywanie formularza

```bash
curl -X POST http://localhost:3001/api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "custom_form",
    "data": {
      "field1": "value1",
      "field2": "value2"
    },
    "schema": {}
  }'
```

## 📊 Struktura bazy danych

### Tabela: `eksperymenty`
Podstawowe informacje o eksperymentach.

| Kolumna | Typ | Opis |
|---------|-----|------|
| id | SERIAL | Klucz główny (auto-increment) |
| project_id | VARCHAR(255) | ID projektu |
| name | VARCHAR(255) | Nazwa eksperymentu (wymagane) |
| author_id | INTEGER | ID autora |
| form_id | VARCHAR(255) | ID formularza pomiarowego |
| description | TEXT | Opis eksperymentu |
| details | JSONB | Szczegóły w formacie JSON |
| status | VARCHAR(50) | Status (new/in_progress/finished) |
| created_at | TIMESTAMP | Data utworzenia |
| updated_at | TIMESTAMP | Data aktualizacji |

### Tabela: `eksperymenty_extended`
Rozszerzone informacje o eksperymentach (wszystkie pola + dodatkowe).

Zawiera wszystkie kolumny z `eksperymenty` plus:
- `start_date` (DATE) - data rozpoczęcia
- `end_date` (DATE) - data zakończenia
- `priority` (VARCHAR) - priorytet
- `budget` (DECIMAL) - budżet
- `team_members` (JSONB) - członkowie zespołu
- `tags` (TEXT[]) - tagi
- `is_confidential` (BOOLEAN) - czy poufny
- `laboratory` (JSONB) - informacje o laboratorium

### Tabela: `osoby`
Dane osób (dla prostego formularza).

| Kolumna | Typ | Opis |
|---------|-----|------|
| id | SERIAL | Klucz główny |
| first_name | VARCHAR(255) | Imię (wymagane) |
| last_name | VARCHAR(255) | Nazwisko (wymagane) |
| age | INTEGER | Wiek |
| email | VARCHAR(255) | Email |
| created_at | TIMESTAMP | Data utworzenia |

### Tabela: `form_submissions`
Uniwersalna tabela dla dowolnych formularzy.

| Kolumna | Typ | Opis |
|---------|-----|------|
| id | SERIAL | Klucz główny |
| form_type | VARCHAR(100) | Typ formularza (wymagane) |
| data | JSONB | Dane formularza (wymagane) |
| schema | JSONB | Schemat JSON (opcjonalnie) |
| created_at | TIMESTAMP | Data utworzenia |
| updated_at | TIMESTAMP | Data aktualizacji |

## 🔍 Zapytania SQL - Przykłady

### Pobierz wszystkie eksperymenty w statusie "in_progress"

```sql
SELECT * FROM eksperymenty 
WHERE status = 'in_progress' 
ORDER BY created_at DESC;
```

### Pobierz eksperymenty z określonego projektu

```sql
SELECT * FROM eksperymenty 
WHERE project_id = 'PROJ-001';
```

### Pobierz szczegóły JSON z eksperymentów

```sql
SELECT name, details->>'temp_start' as temp_start, details->>'temp_end' as temp_end
FROM eksperymenty
WHERE details IS NOT NULL;
```

### Zlicz eksperymenty według statusu

```sql
SELECT status, COUNT(*) as count 
FROM eksperymenty 
GROUP BY status;
```

### Pobierz ostatnie 10 zgłoszeń formularzy

```sql
SELECT * FROM form_submissions 
ORDER BY created_at DESC 
LIMIT 10;
```

### Pobierz zgłoszenia według typu

```sql
SELECT * FROM form_submissions 
WHERE form_type = 'experiment' 
ORDER BY created_at DESC;
```

## 🔐 Bezpieczeństwo

⚠️ **Ważne dla środowiska produkcyjnego:**

1. **Zmień hasła:**
   - Zmień domyślne hasło PostgreSQL
   - Użyj silnych haseł w pliku `.env`

2. **Dodaj walidację:**
   - Backend obecnie przyjmuje wszystkie dane
   - Dodaj walidację na poziomie serwera

3. **CORS:**
   - Ogranicz CORS tylko do konkretnych domen
   - Obecnie: `http://localhost:5173`

4. **Rate limiting:**
   - Dodaj ograniczenia liczby requestów
   - Zabezpiecz przed spam'em

5. **HTTPS:**
   - Użyj HTTPS w produkcji
   - Nie wysyłaj wrażliwych danych przez HTTP

6. **SQL Injection:**
   - Używamy parametryzowanych zapytań (✅ bezpieczne)
   - Nigdy nie konkatenuj SQL + user input

## 🛠️ Rozwiązywanie problemów

### Błąd: "Cannot connect to database"

**Przyczyna:** PostgreSQL nie działa lub błędne dane w `.env`

**Rozwiązanie:**
1. Sprawdź czy PostgreSQL działa:
   ```bash
   # Windows
   pg_ctl status
   
   # Linux/macOS
   sudo systemctl status postgresql
   ```

2. Sprawdź dane w `.env`:
   - Poprawny port (domyślnie 5432)
   - Poprawne hasło
   - Poprawna nazwa bazy

3. Testuj połączenie:
   ```bash
   psql -U postgres -d formularze_db
   ```

### Błąd: "Port 3001 already in use"

**Przyczyna:** Inny proces używa portu 3001

**Rozwiązanie:**
1. Zmień port w `.env`:
   ```env
   PORT=3002
   ```

2. Lub zatrzymaj proces na porcie 3001:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # Linux/macOS
   lsof -ti:3001 | xargs kill -9
   ```

### Błąd: "relation does not exist"

**Przyczyna:** Tabele nie zostały utworzone

**Rozwiązanie:**
```bash
psql -U postgres -d formularze_db -f database/schema.sql
```

### CORS Error w przeglądarce

**Przyczyna:** Backend nie zezwala na requesty z frontendu

**Rozwiązanie:**
Sprawdź `FRONTEND_URL` w `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

## 📚 Przydatne komendy PostgreSQL

```sql
-- Lista wszystkich baz danych
\l

-- Połącz się z bazą
\c formularze_db

-- Lista wszystkich tabel
\dt

-- Opisz strukturę tabeli
\d eksperymenty

-- Pokaż wszystkie rekordy
SELECT * FROM eksperymenty;

-- Usuń wszystkie rekordy (UWAGA!)
TRUNCATE TABLE eksperymenty CASCADE;

-- Usuń bazę danych (UWAGA!)
DROP DATABASE formularze_db;
```

## 📈 Monitorowanie

### Logowanie zapytań

Edytuj `postgresql.conf`:
```
log_statement = 'all'
log_duration = on
```

Restart PostgreSQL.

### Sprawdź aktywne połączenia

```sql
SELECT * FROM pg_stat_activity WHERE datname = 'formularze_db';
```

## 🎯 Następne kroki

- [ ] Dodaj autentykację użytkowników (JWT)
- [ ] Implementuj role i uprawnienia (RBAC)
- [ ] Dodaj paginację do endpointów GET
- [ ] Dodaj filtrowanie i sortowanie
- [ ] Implementuj migracje bazy danych (np. z Knex.js)
- [ ] Dodaj testy jednostkowe (Jest)
- [ ] Dodaj Docker Compose dla łatwego setupu
- [ ] Dodaj monitoring (np. Prometheus + Grafana)
