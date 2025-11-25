const { MongoClient } = require('mongodb');

// Connection URL - domyślnie MongoDB lokalny
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'formularze_db';

let client = null;
let db = null;
let useFallback = false;
let inMemoryDB = {}; // Fallback in-memory storage

/**
 * Inicjalizacja połączenia z MongoDB
 */
async function initMongoDB() {
  try {
    console.log('🔄 Łączenie z MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI}`);
    
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // 3 sekundy timeout
      connectTimeoutMS: 3000
    });
    await client.connect();
    
    db = client.db(DB_NAME);
    
    console.log(`✅ Połączono z MongoDB (baza: ${DB_NAME})`);
    
    // Testowe zapytanie
    const collections = await db.listCollections().toArray();
    console.log(`📁 Dostępne kolekcje: ${collections.map(c => c.name).join(', ') || 'brak'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Błąd połączenia z MongoDB:', error.message);
    console.log('⚠️  Przełączam na tryb in-memory (bez persystencji)');
    console.log('💡 Aby użyć prawdziwego MongoDB:');
    console.log('   - MongoDB Atlas (darmowe): https://www.mongodb.com/cloud/atlas/register');
    console.log('   - Docker: docker run -d -p 27017:27017 --name mongodb mongo');
    useFallback = true;
    return true; // Zwróć true, aby aplikacja działała
  }
}

/**
 * Pobiera referencję do bazy danych
 */
function getDB() {
  if (useFallback) {
    return null; // Fallback mode
  }
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
    // Dodaj timestamp
    const docWithTimestamp = {
      ...document,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (useFallback) {
      // In-memory fallback
      if (!inMemoryDB[collectionName]) {
        inMemoryDB[collectionName] = [];
      }
      const id = Date.now() + Math.random();
      docWithTimestamp._id = id;
      inMemoryDB[collectionName].push(docWithTimestamp);
      console.log(`✅ Zapisano dokument do ${collectionName} (in-memory), ID: ${id}`);
      
      return {
        success: true,
        insertedId: id,
        document: docWithTimestamp
      };
    }
    
    const collection = getCollection(collectionName);
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
    if (useFallback) {
      // In-memory fallback
      return inMemoryDB[collectionName] || [];
    }
    
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
