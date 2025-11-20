# Przykładowe schematy JSON Forms

Ten plik zawiera gotowe przykłady schematów, które możesz wkleić do edytora.

## 1. Formularz obserwacji eksperymentu

```json
{
  "schema": {
    "type": "object",
    "title": "Formularz obserwacji eksperymentu",
    "properties": {
      "eksperyment_id": {
        "type": "string",
        "title": "ID Eksperymentu"
      },
      "data_obserwacji": {
        "type": "string",
        "format": "date",
        "title": "Data obserwacji"
      },
      "godzina": {
        "type": "string",
        "format": "time",
        "title": "Godzina"
      },
      "temperatura": {
        "type": "number",
        "title": "Temperatura (°C)",
        "minimum": -273.15,
        "maximum": 1000
      },
      "cisnienie": {
        "type": "number",
        "title": "Ciśnienie (hPa)",
        "minimum": 0
      },
      "wilgotnosc": {
        "type": "number",
        "title": "Wilgotność (%)",
        "minimum": 0,
        "maximum": 100
      },
      "obserwacje": {
        "type": "string",
        "title": "Obserwacje"
      },
      "zdjecia": {
        "type": "array",
        "title": "Zdjęcia",
        "items": {
          "type": "string",
          "format": "uri"
        }
      }
    },
    "required": ["eksperyment_id", "data_obserwacji", "temperatura"]
  },
  "uischema": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "HorizontalLayout",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/eksperyment_id"
          },
          {
            "type": "Control",
            "scope": "#/properties/data_obserwacji"
          },
          {
            "type": "Control",
            "scope": "#/properties/godzina"
          }
        ]
      },
      {
        "type": "Group",
        "label": "Pomiary",
        "elements": [
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/temperatura"
              },
              {
                "type": "Control",
                "scope": "#/properties/cisnienie"
              },
              {
                "type": "Control",
                "scope": "#/properties/wilgotnosc"
              }
            ]
          }
        ]
      },
      {
        "type": "Control",
        "scope": "#/properties/obserwacje",
        "options": {
          "multi": true
        }
      },
      {
        "type": "Control",
        "scope": "#/properties/zdjecia"
      }
    ]
  }
}
```

## 2. Formularz projektu badawczego

```json
{
  "schema": {
    "type": "object",
    "title": "Projekt badawczy",
    "properties": {
      "nazwa_projektu": {
        "type": "string",
        "title": "Nazwa projektu",
        "minLength": 5
      },
      "akronim": {
        "type": "string",
        "title": "Akronim",
        "maxLength": 10
      },
      "kierownik": {
        "type": "object",
        "title": "Kierownik projektu",
        "properties": {
          "imie": { "type": "string", "title": "Imię" },
          "nazwisko": { "type": "string", "title": "Nazwisko" },
          "email": { "type": "string", "format": "email", "title": "Email" }
        },
        "required": ["imie", "nazwisko", "email"]
      },
      "data_rozpoczecia": {
        "type": "string",
        "format": "date",
        "title": "Data rozpoczęcia"
      },
      "data_zakonczenia": {
        "type": "string",
        "format": "date",
        "title": "Data zakończenia"
      },
      "budzet_total": {
        "type": "number",
        "title": "Całkowity budżet (PLN)",
        "minimum": 0
      },
      "finansowanie": {
        "type": "string",
        "title": "Źródło finansowania",
        "enum": ["NCN", "NCBiR", "MNiSW", "UE", "Prywatne", "Inne"]
      },
      "opis": {
        "type": "string",
        "title": "Opis projektu"
      },
      "cele": {
        "type": "array",
        "title": "Cele projektu",
        "items": {
          "type": "string"
        }
      }
    },
    "required": ["nazwa_projektu", "kierownik", "data_rozpoczecia"]
  },
  "uischema": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "HorizontalLayout",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/nazwa_projektu"
          },
          {
            "type": "Control",
            "scope": "#/properties/akronim"
          }
        ]
      },
      {
        "type": "Group",
        "label": "Kierownik projektu",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/kierownik"
          }
        ]
      },
      {
        "type": "Group",
        "label": "Terminy i finanse",
        "elements": [
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/data_rozpoczecia"
              },
              {
                "type": "Control",
                "scope": "#/properties/data_zakonczenia"
              }
            ]
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/budzet_total"
              },
              {
                "type": "Control",
                "scope": "#/properties/finansowanie"
              }
            ]
          }
        ]
      },
      {
        "type": "Control",
        "scope": "#/properties/opis",
        "options": {
          "multi": true
        }
      },
      {
        "type": "Control",
        "scope": "#/properties/cele"
      }
    ]
  }
}
```

## 3. Formularz sprzętu laboratoryjnego

```json
{
  "schema": {
    "type": "object",
    "title": "Rejestr sprzętu laboratoryjnego",
    "properties": {
      "nazwa_sprzetu": {
        "type": "string",
        "title": "Nazwa sprzętu"
      },
      "producent": {
        "type": "string",
        "title": "Producent"
      },
      "model": {
        "type": "string",
        "title": "Model"
      },
      "numer_inwentarzowy": {
        "type": "string",
        "title": "Numer inwentarzowy",
        "pattern": "^INW-[0-9]{6}$"
      },
      "data_zakupu": {
        "type": "string",
        "format": "date",
        "title": "Data zakupu"
      },
      "cena_zakupu": {
        "type": "number",
        "title": "Cena zakupu (PLN)",
        "minimum": 0
      },
      "lokalizacja": {
        "type": "object",
        "properties": {
          "budynek": { "type": "string", "title": "Budynek" },
          "pokoj": { "type": "string", "title": "Pokój" },
          "szafa": { "type": "string", "title": "Szafa/Półka" }
        }
      },
      "stan_techniczny": {
        "type": "string",
        "title": "Stan techniczny",
        "enum": ["Sprawny", "Wymaga konserwacji", "Niesprawny", "Zezłomowany"]
      },
      "ostatni_przeglad": {
        "type": "string",
        "format": "date",
        "title": "Data ostatniego przeglądu"
      },
      "nastepny_przeglad": {
        "type": "string",
        "format": "date",
        "title": "Data następnego przeglądu"
      },
      "osoba_odpowiedzialna": {
        "type": "string",
        "title": "Osoba odpowiedzialna"
      },
      "uwagi": {
        "type": "string",
        "title": "Uwagi"
      }
    },
    "required": ["nazwa_sprzetu", "numer_inwentarzowy", "lokalizacja"]
  },
  "uischema": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Group",
        "label": "Identyfikacja",
        "elements": [
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/nazwa_sprzetu"
              },
              {
                "type": "Control",
                "scope": "#/properties/numer_inwentarzowy"
              }
            ]
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/producent"
              },
              {
                "type": "Control",
                "scope": "#/properties/model"
              }
            ]
          }
        ]
      },
      {
        "type": "Group",
        "label": "Zakup",
        "elements": [
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/data_zakupu"
              },
              {
                "type": "Control",
                "scope": "#/properties/cena_zakupu"
              }
            ]
          }
        ]
      },
      {
        "type": "Group",
        "label": "Lokalizacja",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/lokalizacja"
          }
        ]
      },
      {
        "type": "Group",
        "label": "Stan i przeglądy",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/stan_techniczny"
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/ostatni_przeglad"
              },
              {
                "type": "Control",
                "scope": "#/properties/nastepny_przeglad"
              }
            ]
          },
          {
            "type": "Control",
            "scope": "#/properties/osoba_odpowiedzialna"
          }
        ]
      },
      {
        "type": "Control",
        "scope": "#/properties/uwagi",
        "options": {
          "multi": true
        }
      }
    ]
  }
}
```

## 4. Formularz użytkownika/badacza

```json
{
  "schema": {
    "type": "object",
    "title": "Rejestracja użytkownika",
    "properties": {
      "dane_osobowe": {
        "type": "object",
        "title": "Dane osobowe",
        "properties": {
          "imie": { "type": "string", "title": "Imię", "minLength": 2 },
          "nazwisko": { "type": "string", "title": "Nazwisko", "minLength": 2 },
          "tytul_naukowy": {
            "type": "string",
            "title": "Tytuł naukowy",
            "enum": ["", "mgr", "dr", "dr hab.", "prof."]
          }
        }
      },
      "kontakt": {
        "type": "object",
        "title": "Kontakt",
        "properties": {
          "email": { "type": "string", "format": "email", "title": "Email" },
          "telefon": { 
            "type": "string", 
            "title": "Telefon",
            "pattern": "^[0-9]{9,15}$"
          }
        }
      },
      "afiliacja": {
        "type": "object",
        "title": "Afiliacja",
        "properties": {
          "uczelnia": { "type": "string", "title": "Uczelnia/Instytucja" },
          "wydzial": { "type": "string", "title": "Wydział" },
          "katedra": { "type": "string", "title": "Katedra/Zakład" }
        }
      },
      "rola": {
        "type": "string",
        "title": "Rola w systemie",
        "enum": ["admin", "moderator", "badacz", "viewer"]
      },
      "specjalizacja": {
        "type": "array",
        "title": "Specjalizacje",
        "items": {
          "type": "string",
          "enum": ["Chemia", "Fizyka", "Biologia", "Inżynieria", "Informatyka", "Inne"]
        },
        "uniqueItems": true
      },
      "aktywny": {
        "type": "boolean",
        "title": "Konto aktywne",
        "default": true
      }
    },
    "required": ["dane_osobowe", "kontakt", "rola"]
  },
  "uischema": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Group",
        "label": "Dane osobowe",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/dane_osobowe"
          }
        ]
      },
      {
        "type": "Group",
        "label": "Kontakt",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/kontakt"
          }
        ]
      },
      {
        "type": "Group",
        "label": "Afiliacja",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/afiliacja"
          }
        ]
      },
      {
        "type": "HorizontalLayout",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/rola"
          },
          {
            "type": "Control",
            "scope": "#/properties/aktywny"
          }
        ]
      },
      {
        "type": "Control",
        "scope": "#/properties/specjalizacja"
      }
    ]
  }
}
```

## Jak użyć tych schematów?

1. Skopiuj cały kod JSON (razem z `schema`, `uischema`)
2. Otwórz aplikację
3. Przejdź do zakładki "Edytor schematu"
4. Wklej kod do odpowiednich pól (JSON Schema i UI Schema)
5. Kliknij "Wygeneruj formularz"

## Wskazówki

- Możesz łączyć elementy z różnych schematów
- Dodawaj nowe pola poprzez rozszerzenie sekcji `properties`
- Eksperymentuj z różnymi typami pól i walidacją
- UI Schema kontroluje układ - możesz go zmienić bez zmiany danych
