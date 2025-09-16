import Database from 'better-sqlite3';

async function test() {
  try {
    // Use verbose logging for debugging
    const db = new Database('/root/temp_backup/app/prisma/tournament.db', { verbose: console.log });
    console.log('✅ DB opened OK');

    // Query to list all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('✅ Tables:', tables);

    db.close();
  } catch (e: any) {
    console.error('❌ Error:', e.message);
  }
}

test();
