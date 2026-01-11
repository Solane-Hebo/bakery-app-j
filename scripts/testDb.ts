// scripts/testDb.ts
import "dotenv/config"; // automatically loads your .env
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in your .env file!");
  process.exit(1);
}

async function testConnection() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    const conn = await mongoose.connect(MONGODB_URI as string);
    console.log("✅ MongoDB connection successful!");
    console.log("Database name:", conn.connection.name);
    await conn.disconnect();
    console.log("🔌 MongoDB disconnected. Test complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

testConnection();
