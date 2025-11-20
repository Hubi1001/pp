# 🚀 Szybki Start - 5 minut

## Krok 1: Instalacja zależności

```bash
npm install
```

## Krok 2: Uruchom aplikację (bez bazy danych)

```bash
npm run dev
```

Otwórz: **http://localhost:5173/**

✅ **Gotowe!** Możesz tworzyć formularze i testować JSON Forms.

---

## 💾 Chcesz zapisywać dane do bazy? (opcjonalnie)

### A. Łatwy sposób - Docker 🐳

1. **Zainstaluj Docker Desktop** (https://www.docker.com/products/docker-desktop)

2. **Uruchom bazę danych:**
   ```bash
   docker-compose up -d
   ```

3. **Uruchom frontend:**
   ```bash
   npm run dev
   ```

4. **Gotowe!** Możesz zapisywać dane klikając "💾 Zapisz do bazy danych"

### B. Tradycyjny sposób - PostgreSQL lokalnie

1. **Zainstaluj PostgreSQL:**
   - Windows: https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **Utwórz bazę danych:**
   ```bash
   psql -U postgres
   CREATE DATABASE formularze_db;
   \q
   ```

3. **Wykonaj schemat:**
   ```bash
   psql -U postgres -d formularze_db -f database/schema.sql
   ```

4. **Skonfiguruj połączenie:**
   ```bash
   cp .env.example .env
   ```
   
   Edytuj `.env` i ustaw hasło:
   ```
   DB_PASSWORD=twoje_haslo
   ```

5. **Uruchom wszystko:**
   ```bash
   npm run dev:all
   ```

---

## 📚 Co dalej?

### Testowanie formularzy

1. **Wybierz szablon** z listy (np. "Formularz eksperymentu")
2. **Przejdź do "Formularz"**
3. **Wypełnij pola**
4. **Zobacz JSON** na dole strony
5. **Zapisz do bazy** (jeśli skonfigurowałeś PostgreSQL)

### Tworzenie własnych schematów

1. **Przejdź do "Edytor schematu"**
2. **Wybierz "Własny schemat"** z listy
3. **Wklej swój JSON Schema**
4. **Kliknij "Wygeneruj formularz"**

### Przykłady schematów

Zobacz plik `PRZYKLADY_SCHEMATOW.md` - zawiera gotowe do wklejenia schematy:
- Formularz obserwacji eksperymentu
- Formularz projektu badawczego
- Formularz sprzętu laboratoryjnego
- Formularz użytkownika/badacza

### API Backend

Backend udostępnia REST API:

```bash
# Health check
curl http://localhost:3001/api/health

# Zapisz eksperyment
curl -X POST http://localhost:3001/api/experiments \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "project_id": "PROJ-001"}'

# Pobierz wszystkie eksperymenty
curl http://localhost:3001/api/experiments
```

Szczegóły w `BACKEND_INSTRUKCJA.md`

---

## 🆘 Problemy?

### "Cannot connect to database"
- PostgreSQL nie działa lub błędne dane w `.env`
- Rozwiązanie: Sprawdź `BACKEND_INSTRUKCJA.md` sekcja "Rozwiązywanie problemów"

### "Port already in use"
- Port 5173 (frontend) lub 3001 (backend) zajęty
- Rozwiązanie: Zmień port w `.env` lub zatrzymaj proces na tym porcie

### "CORS Error"
- Backend nie pozwala na requesty z frontendu
- Rozwiązanie: Sprawdź czy `FRONTEND_URL` w `.env` to `http://localhost:5173`

### Inne problemy?
Sprawdź szczegółowe instrukcje:
- `BACKEND_INSTRUKCJA.md` - backend i baza danych
- `README_JSONFORMS.md` - JSON Forms i schematy
- `PRZEWODNIK_KONWERSJI.md` - konwersja formatów

---

## 🎯 Główne funkcje

✅ **Generowanie formularzy** z JSON Schema  
✅ **3 gotowe szablony** eksperymentów  
✅ **Edytor schematu** na żywo  
✅ **Walidacja** automatyczna  
✅ **Zapis do PostgreSQL** (opcjonalnie)  
✅ **Material Design** UI  
✅ **Responsywne** formularze  

---

## 📝 Struktura projektu

```
📁 src/                          Frontend (React + JSON Forms)
📁 server/                       Backend (Express.js + PostgreSQL)
📁 database/                     Schemat SQL
📄 .env.example                  Przykład konfiguracji
📄 docker-compose.yml            Docker setup (opcjonalnie)
📄 README.md                     Główna dokumentacja
📄 BACKEND_INSTRUKCJA.md         Szczegóły backendu
📄 PRZYKLADY_SCHEMATOW.md        Gotowe schematy
```

---

## 💡 Porady

1. **Zacznij bez bazy danych** - przetestuj formularze
2. **Użyj Docker** - najszybszy sposób na bazę danych
3. **Zobacz przykłady** - w `PRZYKLADY_SCHEMATOW.md`
4. **Eksperymentuj** - JSON Schema jest bardzo elastyczny
5. **Czytaj dokumentację** - JSON Forms ma świetne docs: https://jsonforms.io/

---

**Pytania?** Sprawdź dokumentację lub utwórz issue na GitHub!

**Powodzenia!** 🎉
