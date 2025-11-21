#!/bin/bash

# Skrypt do przeglądania danych w SQLite

DB_PATH="/workspaces/pp/database/forms.db"

echo "🗄️  SQLite Browser - Baza danych formularzy"
echo "=============================================="
echo ""
echo "📂 Plik bazy: $DB_PATH"
echo ""

# Funkcja do wyświetlania menu
show_menu() {
    echo ""
    echo "Wybierz opcję:"
    echo "1. Pokaż wszystkie tabele"
    echo "2. Pokaż eksperymenty (podstawowe)"
    echo "3. Pokaż eksperymenty (rozszerzone)"
    echo "4. Pokaż osoby"
    echo "5. Pokaż wszystkie formularze"
    echo "6. Wejdź do SQLite CLI (interaktywny)"
    echo "7. Wyczyść bazę danych"
    echo "0. Wyjście"
    echo ""
    read -p "Twój wybór: " choice
    
    case $choice in
        1)
            echo ""
            echo "📋 Tabele w bazie danych:"
            sqlite3 $DB_PATH ".tables"
            ;;
        2)
            echo ""
            echo "🔬 Eksperymenty (podstawowe):"
            sqlite3 $DB_PATH "SELECT * FROM eksperymenty ORDER BY created_at DESC LIMIT 20;" -header -column
            echo ""
            sqlite3 $DB_PATH "SELECT COUNT(*) as total FROM eksperymenty;"
            ;;
        3)
            echo ""
            echo "🔬 Eksperymenty (rozszerzone):"
            sqlite3 $DB_PATH "SELECT * FROM eksperymenty_extended ORDER BY created_at DESC LIMIT 20;" -header -column
            echo ""
            sqlite3 $DB_PATH "SELECT COUNT(*) as total FROM eksperymenty_extended;"
            ;;
        4)
            echo ""
            echo "👤 Osoby:"
            sqlite3 $DB_PATH "SELECT * FROM osoby ORDER BY created_at DESC LIMIT 20;" -header -column
            echo ""
            sqlite3 $DB_PATH "SELECT COUNT(*) as total FROM osoby;"
            ;;
        5)
            echo ""
            echo "📝 Wszystkie formularze:"
            sqlite3 $DB_PATH "SELECT id, form_type, created_at FROM form_submissions ORDER BY created_at DESC LIMIT 20;" -header -column
            echo ""
            sqlite3 $DB_PATH "SELECT COUNT(*) as total FROM form_submissions;"
            ;;
        6)
            echo ""
            echo "🔧 Tryb interaktywny SQLite"
            echo "💡 Użyj .exit aby wyjść"
            echo ""
            sqlite3 $DB_PATH
            ;;
        7)
            read -p "⚠️  Czy na pewno chcesz wyczyścić wszystkie dane? (tak/nie): " confirm
            if [ "$confirm" = "tak" ]; then
                sqlite3 $DB_PATH "DELETE FROM eksperymenty;"
                sqlite3 $DB_PATH "DELETE FROM eksperymenty_extended;"
                sqlite3 $DB_PATH "DELETE FROM osoby;"
                sqlite3 $DB_PATH "DELETE FROM form_submissions;"
                echo "✅ Baza danych wyczyszczona"
            else
                echo "❌ Anulowano"
            fi
            ;;
        0)
            echo "👋 Do widzenia!"
            exit 0
            ;;
        *)
            echo "❌ Nieprawidłowa opcja"
            ;;
    esac
    
    show_menu
}

# Uruchom menu
show_menu
