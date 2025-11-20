const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase, query, run, testConnection } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Middleware do logowania żądań
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url} - Origin: ${req.get('origin')}`);
  next();
});

// Endpoint testowy
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend działa poprawnie',
    timestamp: new Date().toISOString() 
  });
});

// Endpoint do zapisywania eksperymentu (podstawowy)
app.post('/api/experiments', async (req, res) => {
  console.log('🔵 POST /api/experiments - Body:', JSON.stringify(req.body, null, 2));
  const { project_id, name, author_id, form_id, description, details, status } = req.body;

  try {
    const result = run(
      `INSERT INTO eksperymenty 
       (project_id, name, author_id, form_id, description, details, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [project_id, name, author_id, form_id, description, details ? JSON.stringify(details) : null, status || 'new']
    );

    // Pobierz zapisany rekord
    const inserted = query('SELECT * FROM eksperymenty WHERE id = ?', [result.insertId]);

    console.log('✅ Eksperyment zapisany:', inserted.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Eksperyment został zapisany',
      data: inserted.rows[0],
    });
  } catch (error) {
    console.error('❌ Błąd zapisu eksperymentu:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd zapisu do bazy danych',
      error: error.message,
    });
  }
});

// Endpoint do zapisywania eksperymentu (rozszerzony)
app.post('/api/experiments/extended', async (req, res) => {
  const {
    project_id,
    name,
    author_id,
    form_id,
    description,
    details,
    status,
    start_date,
    end_date,
    priority,
    budget,
    team_members,
    tags,
    is_confidential,
    laboratory,
  } = req.body;

  try {
    const result = run(
      `INSERT INTO eksperymenty_extended 
       (project_id, name, author_id, form_id, description, details, status, 
        start_date, end_date, priority, budget, team_members, tags, is_confidential, laboratory) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        name,
        author_id,
        form_id,
        description,
        details ? JSON.stringify(details) : null,
        status || 'new',
        start_date || null,
        end_date || null,
        priority || null,
        budget || null,
        team_members ? JSON.stringify(team_members) : null,
        tags || null,
        is_confidential ? 1 : 0,
        laboratory ? JSON.stringify(laboratory) : null,
      ]
    );

    const inserted = query('SELECT * FROM eksperymenty_extended WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Eksperyment rozszerzony został zapisany',
      data: inserted.rows[0],
    });
  } catch (error) {
    console.error('Błąd zapisu eksperymentu rozszerzonego:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd zapisu do bazy danych',
      error: error.message,
    });
  }
});

// Endpoint do zapisywania osób
app.post('/api/persons', async (req, res) => {
  const { firstName, lastName, age, email } = req.body;

  try {
    const result = run(
      `INSERT INTO osoby (first_name, last_name, age, email) 
       VALUES (?, ?, ?, ?)`,
      [firstName, lastName, age || null, email || null]
    );

    const inserted = query('SELECT * FROM osoby WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Osoba została zapisana',
      data: inserted.rows[0],
    });
  } catch (error) {
    console.error('Błąd zapisu osoby:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd zapisu do bazy danych',
      error: error.message,
    });
  }
});

// Endpoint uniwersalny - dla dowolnego formularza
app.post('/api/forms/submit', async (req, res) => {
  const { formType, data, schema } = req.body;

  if (!formType || !data) {
    return res.status(400).json({
      success: false,
      message: 'Brak wymaganych pól: formType i data',
    });
  }

  try {
    const result = run(
      `INSERT INTO form_submissions (form_type, data, schema) 
       VALUES (?, ?, ?)`,
      [formType, JSON.stringify(data), schema ? JSON.stringify(schema) : null]
    );

    const inserted = query('SELECT * FROM form_submissions WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Formularz został zapisany',
      data: inserted.rows[0],
    });
  } catch (error) {
    console.error('Błąd zapisu formularza:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd zapisu do bazy danych',
      error: error.message,
    });
  }
});

// Endpoint do pobierania wszystkich eksperymentów
app.get('/api/experiments', async (req, res) => {
  try {
    const result = query('SELECT * FROM eksperymenty ORDER BY created_at DESC LIMIT 100');

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Błąd pobierania eksperymentów:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania danych',
      error: error.message,
    });
  }
});

// Endpoint do pobierania jednego eksperymentu
app.get('/api/experiments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = query('SELECT * FROM eksperymenty WHERE id = ?', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Eksperyment nie został znaleziony',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Błąd pobierania eksperymentu:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania danych',
      error: error.message,
    });
  }
});

// Endpoint do pobierania wszystkich zgłoszeń formularzy
app.get('/api/forms/submissions', async (req, res) => {
  const { formType } = req.query;

  try {
    let sql = 'SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT 100';
    let params = [];

    if (formType) {
      sql = 'SELECT * FROM form_submissions WHERE form_type = ? ORDER BY created_at DESC LIMIT 100';
      params = [formType];
    }

    const result = query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Błąd pobierania zgłoszeń:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania danych',
      error: error.message,
    });
  }
});

// Obsługa nieistniejących endpointów
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint nie istnieje',
  });
});

// Uruchomienie serwera
const startServer = async () => {
  try {
    console.log('🔄 Inicjalizacja serwera...');
    
    // Inicjalizacja bazy danych SQLite
    await initDatabase();
    console.log('✅ Baza danych zainicjalizowana');
    
    // Test połączenia z bazą danych
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('⚠️  Uwaga: Nie można połączyć się z bazą danych.');
      console.error('⚠️  Serwer będzie działał, ale zapisy do bazy nie będą możliwe.');
    }

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Serwer backend uruchomiony na porcie ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📝 API endpoint: http://localhost:${PORT}/api`);
      console.log(`\n🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5174'}\n`);
    });

    // Upewnij się, że serwer nie kończy się nieoczekiwanie
    server.on('error', (error) => {
      console.error('❌ Błąd serwera:', error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n⏹️  SIGTERM otrzymany, zamykanie serwera...');
      server.close(() => {
        console.log('✅ Serwer zamknięty');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Krytyczny błąd podczas startu serwera:', error);
    process.exit(1);
  }
};

startServer();
