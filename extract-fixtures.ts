import fs from "fs";
import BetterSqlite3 from "better-sqlite3";

// --- CONFIGURATION ---
// IMPORTANT: Update this path to point to your old database backup file.
const oldDbPath = "/root/temp_backup/app/prisma/tournament.db";
const outputFile = "fixtures.json";

// --- SCRIPT ---

function extractFixtures() {
  console.log(`Attempting to connect to old database at: ${oldDbPath}`);

  let oldDb; // Define db outside try block to access it in finally

  try {
    oldDb = new BetterSqlite3(oldDbPath, { readonly: true });
    console.log("Database connection successful.");

    // As you suggested, this debug step helps confirm the available table names.
    const tables = oldDb
      .prepare("SELECT name FROM sqlite_master WHERE type='table';")
      .all();
    console.log(
      "Available tables:",
      tables.map((t: any) => t.name),
    );

    // Query the Fixture table from the old database.
    // NOTE: This assumes the table is named 'Fixture'. Adjust if necessary.
    const stmt = oldDb.prepare("SELECT * FROM Fixture");
    const fixtures = stmt.all();

    console.log(`Found ${fixtures.length} fixtures in the old database.`);

    const formattedFixtures = fixtures.map((fixture: any) => ({
      // Explicitly convert all ID fields to strings for type safety
      id: String(fixture.id),
      round: fixture.round,
      player1Id: String(fixture.player1Id),
      player2Id: String(fixture.player2Id),
      winnerId: fixture.winnerId ? String(fixture.winnerId) : null,
      scorePlayer1: fixture.scorePlayer1,
      scorePlayer2: fixture.scorePlayer2,
      scheduledTime: fixture.scheduledTime,
      location: fixture.location,
    }));

    // As you recommended, this loop will warn about incomplete data.
    formattedFixtures.forEach((fixture) => {
      if (!fixture.player1Id || !fixture.player2Id) {
        console.warn(
          `Fixture ${fixture.id} is missing player IDs—data might be incomplete.`,
        );
      }
    });

    fs.writeFileSync(outputFile, JSON.stringify(formattedFixtures, null, 2));
    console.log(`Successfully extracted fixtures and saved to ${outputFile}`);
  } catch (error) {
    console.error("An error occurred during fixture extraction:");
    console.error(error);
    process.exit(1);
  } finally {
    // As you suggested, we'll close the connection for cleanliness.
    if (oldDb) {
      oldDb.close();
      console.log("Database connection closed.");
    }
  }
}

extractFixtures();
