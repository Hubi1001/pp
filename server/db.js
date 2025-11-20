const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'forms.db');
let db = null;

// Inicjalizacja bazy danych SQLite
const initDatabase = async () => {
  try {
    const SQL = await initSqlJs();
    
    // Sprawdź czy plik bazy danych istnieje
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
      console.log('✅ Załadowano istniejącą bazę danych SQLite z pliku:', DB_PATH);
    } else {
      // Utwórz nową bazę danych
      db = new SQL.Database();
      console.log('✅ Utworzono nową bazę danych SQLite');
      
      // Utwórz tabele
      await createTables();
      
      // Zapisz do pliku
      saveDatabase();
    }
    
    return true;
  } catch (error) {
    console.error('❌ Błąd inicjalizacji bazy danych:', error.message);
    return false;
  }
};

// Tworzenie tabel
const createTables = async () => {
  const schema = `
    -- Tabela: Eksperymenty (podstawowe informacje)
    CREATE TABLE IF NOT EXISTS eksperymenty (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT,
        name TEXT NOT NULL,
        author_id INTEGER,
        form_id TEXT,
        description TEXT,
        details TEXT,
        status TEXT DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela: Eksperymenty rozszerzone
    CREATE TABLE IF NOT EXISTS eksperymenty_extended (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT,
        name TEXT NOT NULL,
        author_id INTEGER,
        form_id TEXT,
        description TEXT,
        details TEXT,
        status TEXT DEFAULT 'new',
        start_date TEXT,
        end_date TEXT,
        priority TEXT,
        budget REAL,
        team_members TEXT,
        tags TEXT,
        is_confidential INTEGER DEFAULT 0,
        laboratory TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela: Osoby
    CREATE TABLE IF NOT EXISTS osoby (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        age INTEGER,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela: Formularze ogólne
    CREATE TABLE IF NOT EXISTS form_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        form_type TEXT NOT NULL,
        data TEXT NOT NULL,
        schema TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Indeksy
    CREATE INDEX IF NOT EXISTS idx_eksperymenty_status ON eksperymenty(status);
    CREATE INDEX IF NOT EXISTS idx_eksperymenty_project_id ON eksperymenty(project_id);
  `;

  try {
    db.run(schema);
    console.log('✅ Tabele utworzone pomyślnie');
    return true;
  } catch (error) {
    console.error('❌ Błąd tworzenia tabel:', error.message);
    return false;
  }
};

// Zapisywanie bazy danych do pliku
const saveDatabase = () => {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    
    // Upewnij się, że katalog istnieje
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(DB_PATH, buffer);
  } catch (error) {
    console.error('❌ Błąd zapisywania bazy danych:', error.message);
  }
};

// Funkcja do wykonywania zapytań SELECT
const query = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    
    return { rows };
  } catch (error) {
    console.error('❌ Błąd zapytania:', error.message);
    throw error;
  }
};

// Funkcja do wykonywania INSERT/UPDATE/DELETE
const run = (sql, params = []) => {
  try {
    // Używamy exec dla sql.js (zamiast run z better-sqlite3)
    if (params && params.length > 0) {
      // Dla zapytań z parametrami używamy prepare
      const stmt = db.prepare(sql);
      stmt.bind(params);
      stmt.step();
      stmt.free();
    } else {
      // Bez parametrów używamy exec
      db.exec(sql);
    }
    
    saveDatabase(); // Zapisz po każdej zmianie
    
    // Zwróć ID ostatnio wstawionego rekordu
    const result = db.exec('SELECT last_insert_rowid() as id');
    const insertId = result[0]?.values[0]?.[0] || null;
    
    return { insertId, changes: 1 };
  } catch (error) {
    console.error('❌ Błąd wykonania SQL:', sql);
    console.error('❌ Parametry:', params);
    console.error('❌ Błąd:', error.message);
    console.error('❌ Stack:', error.stack);
    throw error;
  }
};

// Test połączenia
const testConnection = async () => {
  try {
    if (!db) {
      await initDatabase();
    }
    
    const result = query('SELECT datetime("now") as now');
    console.log('🕐 Czas serwera DB:', result.rows[0].now);
    console.log('✅ Połączenie z bazą danych działa poprawnie!');
    console.log('💾 Plik bazy danych:', DB_PATH);
    return true;
  } catch (error) {
    console.error('❌ Błąd połączenia z bazą danych:', error.message);
    return false;
  }
};

module.exports = {
  initDatabase,
  query,
  run,
  testConnection,
  getDb: () => db,
};
