import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// Tambahkan deklarasi ini 👇 di atas semua kode yang pakai globalThis
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// ⛔️ Hapus error dengan deklarasi properti di globalThis
let client;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
