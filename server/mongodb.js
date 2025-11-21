const { MongoClient } = require('mongodb');

// Connection URL - domyślnie MongoDB lokalny
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'formularze_db';

let client = null;
let db = null;

/**
 * Inicjalizacja połączenia z MongoDB
 */
async function initMongoDB() {
  try {
    console.log('🔄 Łączenie z MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI}`);
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    db = client.db(DB_NAME);
    
    console.log(`✅ Połączono z MongoDB (baza: ${DB_NAME})`);
    
    // Testowe zapytanie
    const collections = await db.listCollections().toArray();
    console.log(`📁 Dostępne kolekcje: ${collections.map(c => c.name).join(', ') || 'brak'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Błąd połączenia z MongoDB:', error.message);
    console.log('💡 Upewnij się, że MongoDB jest uruchomiony:');
    console.log('   - Docker: docker run -d -p 27017:27017 --name mongodb mongo');
    console.log('   - Lokalnie: mongod');
    return false;
  }
}

/**
 * Pobiera referencję do bazy danych
 */
function getDB() {
  if (!db) {
    throw new Error('Baza danych nie jest zainicjalizowana. Wywołaj najpierw initMongoDB()');
  }
  return db;
}

/**
 * Pobiera kolekcję
 */
function getCollection(collectionName) {
  return getDB().collection(collectionName);
}

/**
 * Zapisuje dokument do kolekcji
 */
async function insertDocument(collectionName, document) {
  try {
    const collection = getCollection(collectionName);
    
    // Dodaj timestamp
    const docWithTimestamp = {
      ...document,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(docWithTimestamp);
    console.log(`✅ Zapisano dokument do ${collectionName}, ID: ${result.insertedId}`);
    
    return {
      success: true,
      insertedId: result.insertedId,
      document: docWithTimestamp
    };
  } catch (error) {
    console.error(`❌ Błąd zapisu do ${collectionName}:`, error.message);
    throw error;
  }
}

/**
 * Pobiera wszystkie dokumenty z kolekcji
 */
async function findDocuments(collectionName, filter = {}, options = {}) {
  try {
    const collection = getCollection(collectionName);
    const documents = await collection.find(filter, options).toArray();
    return documents;
  } catch (error) {
    console.error(`❌ Błąd odczytu z ${collectionName}:`, error.message);
    throw error;
  }
}

/**
 * Zamyka połączenie z MongoDB
 */
async function closeMongoDB() {
  if (client) {
    await client.close();
    console.log('✅ Rozłączono z MongoDB');
  }
}

module.exports = {
  initMongoDB,
  getDB,
  getCollection,
  insertDocument,
  findDocuments,
  closeMongoDB
};
