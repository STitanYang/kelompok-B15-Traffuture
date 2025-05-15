import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// ✅ Extend globalThis type properly
  let _mongoClientPromise: Promise<MongoClient> | undefined;
declare global {
  // This line is key. It tells TypeScript: "globalThis may have this property"
}

// ⛔ Prevent duplicate connections in dev
let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

if (!_mongoClientPromise) {
  client = new MongoClient(uri, options);
  _mongoClientPromise = client.connect();
}

const clientPromise = _mongoClientPromise;

export default clientPromise;
