# Generator formularzy JSON Forms

Projekt umożliwia generowanie dynamicznych formularzy na podstawie schematu JSON Schema zgodnie z dokumentacją [JSON Forms](https://jsonforms.io/).

Bazuje na strukturze formularzy eksperymentów z repozytorium [Hubi1001/pp](https://github.com/Hubi1001/pp).

## 🚀 Jak używać

### 1. Uruchomienie aplikacji
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:5173/

### 2. Wybór szablonu

Dostępne są następujące szablony:
- **Formularz eksperymentu (podstawowy)** - szablon z form.json z repozytorium
- **Formularz eksperymentu (rozszerzony)** - rozbudowany szablon z dodatkowymi polami
- **Formularz osoby (prosty)** - prosty przykład dla testów
- **Własny schemat (pusty)** - zaczynasz od zera

### 3. Edycja schematu

Aplikacja ma dwa tryby:
- **Edytor schematu** - edytuj JSON Schema i UI Schema
- **Formularz** - zobacz wygenerowany formularz w akcji

### 4. Format JSON Schema

Aplikacja wymaga schematu w następującym formacie:

```json
{
  "schema": {
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string",
        "minLength": 3,
        "description": "Wprowadź swoje imię"
      },
      "age": {
        "type": "integer",
        "minimum": 18
      }
    },
    "required": ["firstName"]
  },
  "uischema": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Control",
        "scope": "#/properties/firstName"
      }
    ]
  },
  "data": {
    "firstName": "",
    "age": null
  }
}
```

## 📝 Przykłady typów pól

### Tekst
```json
{
  "firstName": {
    "type": "string",
    "minLength": 3
  }
}
```

### Liczba
```json
{
  "age": {
    "type": "integer",
    "minimum": 18,
    "maximum": 100
  }
}
```

### Email
```json
{
  "email": {
    "type": "string",
    "format": "email"
  }
}
```

### Data
```json
{
  "birthDate": {
    "type": "string",
    "format": "date"
  }
}
```

### Lista rozwijana (enum)
```json
{
  "gender": {
    "type": "string",
    "enum": ["Mężczyzna", "Kobieta", "Inne"]
  }
}
```

### Pole tekstowe wieloliniowe
```json
{
  "bio": {
    "type": "string"
  }
}
```

W UI Schema dodaj opcję:
```json
{
  "type": "Control",
  "scope": "#/properties/bio",
  "options": {
    "multi": true
  }
}
```

### Checkbox
```json
{
  "subscribe": {
    "type": "boolean"
  }
}
```

### Obiekt zagnieżdżony
```json
{
  "address": {
    "type": "object",
    "properties": {
      "street": { "type": "string" },
      "city": { "type": "string" }
    }
  }
}
```

## 🎨 Układy UI Schema

### Układ pionowy
```json
{
  "type": "VerticalLayout",
  "elements": [
    { "type": "Control", "scope": "#/properties/firstName" },
    { "type": "Control", "scope": "#/properties/lastName" }
  ]
}
```

### Układ poziomy
```json
{
  "type": "HorizontalLayout",
  "elements": [
    { "type": "Control", "scope": "#/properties/firstName" },
    { "type": "Control", "scope": "#/properties/lastName" }
  ]
}
```

### Grupa z etykietą
```json
{
  "type": "Group",
  "label": "Adres",
  "elements": [
    { "type": "Control", "scope": "#/properties/street" },
    { "type": "Control", "scope": "#/properties/city" }
  ]
}
```

## 📦 Zainstalowane pakiety

- `@jsonforms/core` - rdzeń JSON Forms
- `@jsonforms/react` - bindingi dla React
- `@jsonforms/material-renderers` - renderery Material-UI
- `@mui/material` - Material-UI
- `@mui/x-date-pickers` - komponenty dat
- `dayjs` - obsługa dat

## 🔗 Dokumentacja

Pełna dokumentacja JSON Forms: https://jsonforms.io/docs/

### Przydatne linki:
- [JSON Schema Tutorial](https://jsonforms.io/docs/tutorial)
- [UI Schema Elements](https://jsonforms.io/docs/uischema)
- [Custom Renderers](https://jsonforms.io/docs/renderer-sets)
- [Validation](https://jsonforms.io/docs/validation)

## ⚙️ Funkcje aplikacji

1. **Edytor schematu** - edytuj JSON Schema i UI Schema w czasie rzeczywistym
2. **Walidacja** - automatyczna walidacja pól zgodnie z JSON Schema
3. **Podgląd danych** - zobacz wygenerowany JSON z danymi formularza
4. **Responsywność** - formularze dostosowują się do rozmiaru ekranu
5. **Material Design** - nowoczesny wygląd zgodny z Material Design

## � Dostępne szablony

### 1. Formularz eksperymentu (podstawowy)
Odpowiednik `form.json` z oryginalnego repo. Zawiera:
- ID projektu
- Nazwa eksperymentu
- ID autora
- ID formularza pomiarowego
- Opis eksperymentu
- Szczegóły JSON
- Status (nowy/w toku/zakończony)

### 2. Formularz eksperymentu (rozszerzony)
Rozbudowana wersja z dodatkowymi polami:
- Wszystkie pola z podstawowego formularza
- Daty rozpoczęcia i zakończenia
- Priorytet
- Budżet
- Członkowie zespołu (array)
- Tagi
- Czy poufny (boolean)
- Informacje o laboratorium (nested object)

### 3. Formularz osoby (prosty)
Prosty formularz do testów z polami: imię, nazwisko, wiek, email

## �💡 Wskazówki

- Wybierz szablon z listy rozwijanej, a schemat zostanie załadowany automatycznie
- Jeśli nie podasz UI Schema, zostanie wygenerowany automatycznie
- Pola wymagane definiujesz w `required: ["pole1", "pole2"]`
- Walidacja działa automatycznie (min, max, minLength, pattern, itp.)
- Możesz zagnieżdżać obiekty i tworzyć złożone struktury
- Dane formularza są wyświetlane na żywo w formacie JSON
