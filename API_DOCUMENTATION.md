# API Documentation

Backend REST API dla aplikacji formularzy.

**Base URL:** `http://localhost:3001/api`

## 📋 Spis treści

- [Health Check](#health-check)
- [Eksperymenty](#eksperymenty)
- [Eksperymenty rozszerzone](#eksperymenty-rozszerzone)
- [Osoby](#osoby)
- [Uniwersalne zgłoszenia](#uniwersalne-zgłoszenia)

---

## Health Check

### GET /api/health

Sprawdź czy serwer działa.

**Response:**
```json
{
  "status": "OK",
  "message": "Backend działa poprawnie",
  "timestamp": "2025-11-20T15:30:00.000Z"
}
```

**cURL:**
```bash
curl http://localhost:3001/api/health
```

---

## Eksperymenty

### POST /api/experiments

Zapisz nowy eksperyment (podstawowy).

**Request Body:**
```json
{
  "project_id": "PROJ-001",
  "name": "Nazwa eksperymentu",
  "author_id": 1,
  "form_id": "FORM-001",
  "description": "Opis eksperymentu",
  "details": "{\"temp_start\": 20}",
  "status": "new"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Eksperyment został zapisany",
  "data": {
    "id": 1,
    "project_id": "PROJ-001",
    "name": "Nazwa eksperymentu",
    "author_id": 1,
    "form_id": "FORM-001",
    "description": "Opis eksperymentu",
    "details": {"temp_start": 20},
    "status": "new",
    "created_at": "2025-11-20T15:30:00.000Z",
    "updated_at": "2025-11-20T15:30:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/experiments \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJ-001",
    "name": "Testowy eksperyment",
    "author_id": 1,
    "status": "new"
  }'
```

### GET /api/experiments

Pobierz wszystkie eksperymenty (max 100).

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 2,
      "project_id": "PROJ-002",
      "name": "Drugi eksperyment",
      "created_at": "2025-11-20T16:00:00.000Z",
      ...
    },
    {
      "id": 1,
      "project_id": "PROJ-001",
      "name": "Pierwszy eksperyment",
      "created_at": "2025-11-20T15:30:00.000Z",
      ...
    }
  ]
}
```

**cURL:**
```bash
curl http://localhost:3001/api/experiments
```

### GET /api/experiments/:id

Pobierz jeden eksperyment po ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "project_id": "PROJ-001",
    "name": "Nazwa eksperymentu",
    ...
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Eksperyment nie został znaleziony"
}
```

**cURL:**
```bash
curl http://localhost:3001/api/experiments/1
```

---

## Eksperymenty rozszerzone

### POST /api/experiments/extended

Zapisz eksperyment z dodatkowymi polami.

**Request Body:**
```json
{
  "project_id": "PROJ-001",
  "name": "Nazwa eksperymentu",
  "author_id": 1,
  "form_id": "FORM-001",
  "description": "Opis",
  "details": "{}",
  "status": "new",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "priority": "Wysoki",
  "budget": 50000.00,
  "team_members": [
    {"user_id": 1, "role": "Kierownik"},
    {"user_id": 2, "role": "Badacz"}
  ],
  "tags": ["chemia", "synteza"],
  "is_confidential": false,
  "laboratory": {
    "name": "Lab A",
    "room_number": "101",
    "equipment": "Spektrometr"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Eksperyment rozszerzony został zapisany",
  "data": { ... }
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/experiments/extended \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJ-002",
    "name": "Eksperyment rozszerzony",
    "author_id": 1,
    "start_date": "2025-11-20",
    "priority": "Wysoki",
    "budget": 10000
  }'
```

---

## Osoby

### POST /api/persons

Zapisz nową osobę.

**Request Body:**
```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "age": 30,
  "email": "jan.kowalski@example.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Osoba została zapisana",
  "data": {
    "id": 1,
    "first_name": "Jan",
    "last_name": "Kowalski",
    "age": 30,
    "email": "jan.kowalski@example.com",
    "created_at": "2025-11-20T15:30:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jan",
    "lastName": "Kowalski",
    "age": 30,
    "email": "jan@example.com"
  }'
```

---

## Uniwersalne zgłoszenia

### POST /api/forms/submit

Zapisz dowolny formularz (uniwersalny endpoint).

**Request Body:**
```json
{
  "formType": "custom_form",
  "data": {
    "field1": "value1",
    "field2": "value2",
    "nested": {
      "field3": "value3"
    }
  },
  "schema": {
    "type": "object",
    "properties": { ... }
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Formularz został zapisany",
  "data": {
    "id": 1,
    "form_type": "custom_form",
    "data": { ... },
    "schema": { ... },
    "created_at": "2025-11-20T15:30:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "test_form",
    "data": {"test": "value"}
  }'
```

### GET /api/forms/submissions

Pobierz wszystkie zgłoszenia formularzy (max 100).

**Query Parameters:**
- `formType` (optional) - filtruj po typie formularza

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

**cURL:**
```bash
# Wszystkie zgłoszenia
curl http://localhost:3001/api/forms/submissions

# Tylko określony typ
curl "http://localhost:3001/api/forms/submissions?formType=experiment"
```

---

## Kody błędów

| Kod | Znaczenie |
|-----|-----------|
| 200 | OK - żądanie wykonane pomyślnie |
| 201 | Created - zasób utworzony |
| 400 | Bad Request - błędne dane wejściowe |
| 404 | Not Found - zasób nie znaleziony |
| 500 | Internal Server Error - błąd serwera |

---

## Przykłady błędów

### 400 Bad Request
```json
{
  "success": false,
  "message": "Brak wymaganych pól: formType i data"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Eksperyment nie został znaleziony"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Błąd zapisu do bazy danych",
  "error": "relation \"eksperymenty\" does not exist"
}
```

---

## Testowanie z JavaScript/Fetch

### Zapisz eksperyment

```javascript
const data = {
  project_id: "PROJ-001",
  name: "Test eksperymentu",
  author_id: 1,
  status: "new"
};

fetch("http://localhost:3001/api/experiments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then(response => response.json())
  .then(result => {
    console.log("Sukces:", result);
  })
  .catch(error => {
    console.error("Błąd:", error);
  });
```

### Pobierz wszystkie eksperymenty

```javascript
fetch("http://localhost:3001/api/experiments")
  .then(response => response.json())
  .then(result => {
    console.log("Eksperymenty:", result.data);
  })
  .catch(error => {
    console.error("Błąd:", error);
  });
```

---

## CORS

Backend akceptuje requesty z:
- `http://localhost:5173` (domyślny frontend Vite)

Aby zmienić, edytuj `FRONTEND_URL` w `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

---

## Rate Limiting

⚠️ **Obecnie brak rate limiting** - wszystkie endpointy są otwarte.

**Dla produkcji zalecamy:**
- Implementacja rate limiting (np. express-rate-limit)
- Uwierzytelnianie (JWT, OAuth)
- Walidacja danych wejściowych (np. Joi, Yup)

---

## Więcej informacji

- **Schemat bazy danych:** `database/schema.sql`
- **Konfiguracja:** `BACKEND_INSTRUKCJA.md`
- **Dokumentacja JSON Forms:** https://jsonforms.io/
