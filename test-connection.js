const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'forms_db',
});

async function testConnection() {
  try {
    console.log('🔄 Próba połączenia...');
    const client = await pool.connect();
    console.log('✅ Połączono!');
    
    const result = await client.query('SELECT NOW(), version()');
    console.log('🕐 Czas serwera:', result.rows[0].now);
    console.log('📊 Wersja PostgreSQL:', result.rows[0].version);
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tabele w bazie:');
    tables.rows.forEach(row => console.log('  -', row.table_name));
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Błąd:', error);
    process.exit(1);
  }
}

testConnection();
