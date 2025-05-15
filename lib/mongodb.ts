import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// ✅ Extend globalThis type properly
declare global {
  // This line is key. It tells TypeScript: "globalThis may have this property"
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// ⛔ Prevent duplicate connections in dev
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalThis._mongoClientPromise = client.connect();
}

clientPromise = globalThis._mongoClientPromise;

export default clientPromise;
