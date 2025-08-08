import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/avira";
const options = {};

let client: MongoClient | undefined;
const clientPromise: Promise<MongoClient> = (() => {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise as Promise<MongoClient>;
})();

export default clientPromise;
