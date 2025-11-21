# Generator formularzy dla eksperymentów - JSON Forms

Aplikacja do generowania dynamicznych formularzy na podstawie JSON Schema, wykorzystująca bibliotekę [JSON Forms](https://jsonforms.io/).

> **⚡ Nowy użytkownik?** Zobacz [SZYBKI_START.md](./SZYBKI_START.md) - uruchomisz projekt w 5 minut!

## 🚀 Szybki start

### Tylko frontend (bez bazy danych)

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna na: **http://localhost:5173/**

### Frontend + Backend + MongoDB 🍃 (ZALECANE)

```bash
# 1. Uruchom MongoDB
docker compose up -d mongodb

# 2. Skonfiguruj .env
echo "USE_MONGODB=true" > .env
echo "MONGODB_URI=mongodb://localhost:27017" >> .env
echo "MONGODB_DB_NAME=formularze_db" >> .env

# 3. Uruchom aplikację
npm run dev:all
```

📚 **Szczegóły:** [JAK_MONGODB.md](./JAK_MONGODB.md)

### Frontend + Backend + SQLite (domyślne)

```bash
npm install
npm run dev:all
```

Dane zapisywane są w `database/forms.db`

### Frontend + Backend + PostgreSQL

1. **Zainstaluj PostgreSQL** i utwórz bazę danych `formularze_db`
2. **Wykonaj schemat bazy:**
   ```bash
   psql -U postgres -d formularze_db -f database/schema.sql
   ```
3. **Skonfiguruj połączenie** - skopiuj `.env.example` do `.env` i uzupełnij dane
4. **Uruchom wszystko:**
   ```bash
   npm install
   npm run dev:all
   ```

Frontend: **http://localhost:5173/**  
Backend API: **http://localhost:3001/api**

Szczegółowa instrukcja: [BACKEND_INSTRUKCJA.md](./BACKEND_INSTRUKCJA.md)

## 📝 Opis projektu

Generator formularzy oparty na standardzie JSON Schema, umożliwiający tworzenie formularzy eksperymentów poprzez podanie schematu JSON.

### Główne funkcje:
- ✅ Generowanie formularzy z JSON Schema
- ✅ 3 gotowe szablony (w tym formularze eksperymentów)
- ✅ Edytor schematu w czasie rzeczywistym
- ✅ Automatyczna walidacja pól
- ✅ **Zapisywanie danych do PostgreSQL**
- ✅ Backend API (Express.js + Node.js)
- ✅ Podgląd danych w formacie JSON
- ✅ Material Design UI
- ✅ Pełna responsywność

## 📚 Dostępne szablony

1. **Formularz eksperymentu (podstawowy)** - odpowiednik oryginalnego `form.json`
2. **Formularz eksperymentu (rozszerzony)** - z dodatkowymi polami (daty, budżet, zespół, laboratorium)
3. **Formularz osoby (prosty)** - przykład testowy

## 📖 Dokumentacja

- **[SZYBKI_START.md](./SZYBKI_START.md)** - ⚡ Uruchom projekt w 5 minut (START TUTAJ!)
- [BACKEND_INSTRUKCJA.md](./BACKEND_INSTRUKCJA.md) - Szczegółowa instrukcja backendu i PostgreSQL
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Dokumentacja REST API (endpointy, przykłady)
- [README_JSONFORMS.md](./README_JSONFORMS.md) - Pełna dokumentacja JSON Forms, przykłady typów pól
- [PRZYKLADY_SCHEMATOW.md](./PRZYKLADY_SCHEMATOW.md) - Gotowe przykłady schematów do wklejenia
- [PRZEWODNIK_KONWERSJI.md](./PRZEWODNIK_KONWERSJI.md) - Konwersja z oryginalnego formatu na JSON Schema

## 🛠️ Technologie

### Frontend
- **React 18** + TypeScript
- **JSON Forms** - generator formularzy
- **Material-UI** - komponenty UI
- **Vite** - build tool

### Backend
- **Node.js** + Express.js
- **PostgreSQL** - baza danych
- **node-postgres (pg)** - driver PostgreSQL
- **CORS** - obsługa cross-origin requests

## 📦 Struktura projektu

```
src/
├── App.tsx                          # Główny komponent aplikacji
├── jsonforms-schema.json            # Szablon eksperymentu (podstawowy)
├── experiment-schema-extended.json  # Szablon eksperymentu (rozszerzony)
├── person-schema-simple.json        # Szablon osoby (prosty)
├── form.json                        # Oryginalny format (referencyjny)
└── styles.css                       # Style aplikacji

server/
├── index.js                         # Serwer Express.js
└── db.js                            # Konfiguracja PostgreSQL

database/
└── schema.sql                       # Schemat bazy danych

.env                                 # Konfiguracja (nie commitować!)
.env.example                         # Przykład konfiguracji
```

## 💡 Jak używać

### 1. Wybierz szablon
Z listy rozwijanej wybierz jeden z dostępnych szablonów lub zacznij od pustego schematu.

### 2. Edytuj schemat (opcjonalnie)
W zakładce "Edytor schematu" możesz zmodyfikować JSON Schema i UI Schema według potrzeb.

### 3. Wygeneruj formularz
Kliknij "Wygeneruj formularz" aby zobaczyć rezultat.

### 4. Wypełnij formularz
Przejdź do zakładki "Formularz" i wypełnij pola. Dane w formacie JSON pojawią się na dole.

### 5. Zapisz do bazy danych
Kliknij przycisk **"💾 Zapisz do bazy danych"** aby zapisać dane w PostgreSQL.

### 6. Sprawdź dane w bazie
```sql
-- Otwórz psql
psql -U postgres -d formularze_db

-- Zobacz ostatnie eksperymenty
SELECT * FROM eksperymenty ORDER BY created_at DESC LIMIT 5;
```

## 🔗 Przydatne linki

- [JSON Forms Documentation](https://jsonforms.io/docs/)
- [JSON Schema Tutorial](https://jsonforms.io/docs/tutorial)
- [UI Schema Elements](https://jsonforms.io/docs/uischema)
- [React JSON Schema Form (RJSF)](https://rjsf-team.github.io/react-jsonschema-form/docs/)
- [Form.io React](https://github.com/formio/react)

## 🎯 Przykład użycia

```typescript
import { JsonForms } from "@jsonforms/react";
import { materialRenderers } from "@jsonforms/material-renderers";

// Twój schemat
const schema = {
  type: "object",
  properties: {
    name: { type: "string", title: "Nazwa" }
  }
};

// Renderowanie
<JsonForms
  schema={schema}
  data={data}
  renderers={materialRenderers}
  onChange={({ data }) => setData(data)}
/>
```

## 📝 Licencja

MIT

## 👨‍💻 Autor

Hubert (@Hubi1001)
