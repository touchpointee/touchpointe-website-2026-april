import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __touchpointeMongoose: MongooseCache | undefined;
}

const globalCache = global.__touchpointeMongoose || {
  connection: null,
  promise: null
};

global.__touchpointeMongoose = globalCache;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI.");
  }

  if (globalCache.connection) {
    return globalCache.connection;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
  }

  try {
    globalCache.connection = await globalCache.promise;
  } catch (err) {
    // Clear cached failed promise so next request retries fresh
    globalCache.promise = null;
    globalCache.connection = null;
    throw err;
  }

  return globalCache.connection;
}

