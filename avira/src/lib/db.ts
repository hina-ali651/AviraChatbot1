import mongoose from "mongoose";

declare global {
  var _mongoose: Promise<typeof mongoose> | undefined;
  var _mongoClientPromise: Promise<unknown> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/avira";

// A lazily-created connection cached on `global` so warm serverless
// invocations reuse it. If a connection attempt fails, the cache is cleared
// so the next request retries instead of every future request in this
// instance failing forever with the same stale rejection.
export default function connectDB(): Promise<typeof mongoose> {
  if (!global._mongoose) {
    global._mongoose = mongoose.connect(MONGODB_URI, { dbName: "avira" }).catch((err) => {
      global._mongoose = undefined;
      throw err;
    });
  }
  return global._mongoose;
}
