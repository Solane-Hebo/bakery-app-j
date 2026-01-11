// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// TypeScript-safe check
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in environment variables");

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ MongoDB already connected");
    return cached.conn;
  }

  if (!cached.promise) {
   
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((m) => {
        console.log("✅ MongoDB connected");
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
