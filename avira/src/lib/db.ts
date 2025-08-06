import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: Promise<typeof mongoose> | undefined;
  var _mongoClientPromise: Promise<any> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/avira";

if (!global._mongoose) {
  global._mongoose = mongoose.connect(MONGODB_URI, {
    dbName: "avira",
  });
}

export default global._mongoose;
