# Generator formularzy dla eksperymentów - JSON Forms

Aplikacja do generowania dynamicznych formularzy na podstawie JSON Schema, wykorzystująca bibliotekę [JSON Forms](https://jsonforms.io/).

## 🚀 Szybki start

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna na: **http://localhost:5173/**

## 📝 Opis projektu

Generator formularzy oparty na standardzie JSON Schema, umożliwiający tworzenie formularzy eksperymentów poprzez podanie schematu JSON.

### Główne funkcje:
- ✅ Generowanie formularzy z JSON Schema
- ✅ 3 gotowe szablony (w tym formularze eksperymentów)
- ✅ Edytor schematu w czasie rzeczywistym
- ✅ Automatyczna walidacja pól
- ✅ Podgląd danych w formacie JSON
- ✅ Material Design UI
- ✅ Pełna responsywność

## 📚 Dostępne szablony

1. **Formularz eksperymentu (podstawowy)** - odpowiednik oryginalnego `form.json`
2. **Formularz eksperymentu (rozszerzony)** - z dodatkowymi polami (daty, budżet, zespół, laboratorium)
3. **Formularz osoby (prosty)** - przykład testowy

## 📖 Dokumentacja

- [README_JSONFORMS.md](./README_JSONFORMS.md) - Pełna dokumentacja JSON Forms, przykłady typów pól
- [PRZEWODNIK_KONWERSJI.md](./PRZEWODNIK_KONWERSJI.md) - Konwersja z oryginalnego formatu na JSON Schema

## 🛠️ Technologie

- **React 18** + TypeScript
- **JSON Forms** - generator formularzy
- **Material-UI** - komponenty UI
- **Vite** - build tool

## 📦 Struktura projektu

```
src/
├── App.tsx                          # Główny komponent aplikacji
├── jsonforms-schema.json            # Szablon eksperymentu (podstawowy)
├── experiment-schema-extended.json  # Szablon eksperymentu (rozszerzony)
├── person-schema-simple.json        # Szablon osoby (prosty)
├── form.json                        # Oryginalny format (referencyjny)
└── styles.css                       # Style aplikacji
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
