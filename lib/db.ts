import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in environment variables")

const uri: string = MONGODB_URI

declare global {
  
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined
}

const cached = (global.mongooseCache ??= { conn: null, promise: null })

export async function connectDB() {
  if (cached.conn) {
    console.log("MongoDB is already connected")
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log("MongoDB connected")
      return m
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
