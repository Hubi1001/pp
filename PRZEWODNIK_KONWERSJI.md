# Przewodnik po formularzu eksperymentu

## Mapowanie pól z oryginalnego form.json

Oryginalny format z repozytorium używał customowego formatu. Oto jak został przekonwertowany na JSON Schema:

### Oryginalny format (form.json)
```json
{
  "id": "project_id",
  "label": "Projekt",
  "type": "text",
  "dbField": "Eksperyment.projektID",
  "permissions": {
    "read": ["admin", "moderator", "badacz"],
    "write": ["admin", "moderator"]
  }
}
```

### Nowy format (JSON Schema)
```json
{
  "project_id": {
    "type": "string",
    "title": "Projekt",
    "description": "ID projektu lub wybór z listy"
  }
}
```

## Różnice między formatami

| Cecha | Oryginalny format | JSON Forms |
|-------|------------------|------------|
| Definicja pola | `id`, `label`, `type` | `properties[key]`, `title`, `type` |
| Walidacja | `validationType` | JSON Schema (min, max, pattern, etc.) |
| Layout | `row`, `col`, `colspan` | UI Schema (HorizontalLayout, VerticalLayout) |
| Uprawnienia | `permissions.read/write` | Nie wspierane natywnie (trzeba custom) |
| DB mapping | `dbField` | Nie wspierane (nazwa klucza = pole w DB) |

## Konwersja typów

| Oryginalny typ | JSON Schema type | Notatki |
|----------------|------------------|---------|
| `text` | `string` | - |
| `number` | `integer` lub `number` | `integer` dla liczb całkowitych |
| `textarea` | `string` | + UI Schema z `options.multi: true` |
| `select` | `string` + `enum` | Opcje z tablicy `options` |
| `date` | `string` + `format: "date"` | - |

## Przykład konwersji kompleksowej

### Przed (oryginalny format)
```json
{
  "id": "status",
  "label": "Status",
  "type": "select",
  "options": [
    { "label": "Nowy", "value": "new" },
    { "label": "W toku", "value": "in_progress" },
    { "label": "Zakończony", "value": "finished" }
  ],
  "validationType": "string",
  "value": "new",
  "row": 5,
  "col": 1,
  "colspan": 1,
  "dbField": "Eksperyment.status"
}
```

### Po (JSON Schema + UI Schema)

**Schema:**
```json
{
  "status": {
    "type": "string",
    "title": "Status",
    "enum": ["new", "in_progress", "finished"],
    "default": "new"
  }
}
```

**UI Schema:**
```json
{
  "type": "Control",
  "scope": "#/properties/status"
}
```

## Utracone funkcje i rozwiązania

### 1. System uprawnień (RBAC)
**Problem:** JSON Forms nie ma wbudowanego systemu uprawnień.

**Rozwiązanie:**
- Użyj Custom Renderer
- Filtruj schemat przed przekazaniem do JSON Forms
- Implementuj logikę uprawnień na poziomie backendu

### 2. Mapowanie do bazy danych (dbField)
**Problem:** JSON Forms używa nazwy klucza jako identyfikatora pola.

**Rozwiązanie:**
- Używaj nazw kluczy zgodnych z DB: `projekt_id` zamiast `projectId`
- Stwórz mapper po stronie backendu
- Możesz dodać custom property w schemacie (np. `x-db-field`)

### 3. Precyzyjny layout (grid)
**Problem:** Oryginalny format używał `row`, `col`, `colspan`.

**Rozwiązanie:**
- Użyj `HorizontalLayout` i `VerticalLayout` w UI Schema
- Dla bardziej zaawansowanych layoutów użyj Custom Layout Renderer

## Zalety JSON Forms vs oryginalny format

✅ **Standardy:** JSON Schema to standard przemysłowy  
✅ **Walidacja:** Bogata walidacja out-of-the-box  
✅ **Ekosystem:** Duża społeczność i dokumentacja  
✅ **UI:** Gotowe renderery (Material-UI, Vanilla, itp.)  
✅ **Rozszerzalność:** Custom renderers, validators, layouts  
✅ **Testowanie:** Łatwe do testowania (tylko JSON)  

## Dodatkowe możliwości JSON Forms

### Conditional rendering (reguły)
```json
{
  "type": "Control",
  "scope": "#/properties/details",
  "rule": {
    "effect": "SHOW",
    "condition": {
      "scope": "#/properties/status",
      "schema": { "const": "in_progress" }
    }
  }
}
```

### Custom format validators
```json
{
  "project_id": {
    "type": "string",
    "pattern": "^PROJ-[0-9]{4}$"
  }
}
```

### Zagnieżdżone obiekty
```json
{
  "laboratory": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "room": { "type": "string" }
    }
  }
}
```

### Array z obiektami
```json
{
  "team_members": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "role": { "type": "string" }
      }
    }
  }
}
```

## Rekomendacje

1. **Dla prostych formularzy:** Użyj podstawowego szablonu eksperymentu
2. **Dla złożonych formularzy:** Użyj rozszerzonego szablonu
3. **Custom requirements:** Edytuj schemat ręcznie w edytorze
4. **Uprawnienia:** Implementuj filtrowanie schematu przed renderem
5. **DB mapping:** Używaj nazw kluczy zgodnych z DB lub stwórz mapper
