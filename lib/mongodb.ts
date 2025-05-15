import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// ✅ Type-safe global untuk TypeScript
declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }

  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// ⛔ Jangan gunakan `var`, gunakan `let` atau langsung assign
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// ✅ Cek dan simpan di globalThis untuk reuse antar-hot-reload
if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

export default clientPromise;
