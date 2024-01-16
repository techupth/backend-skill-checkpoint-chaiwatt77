// Todo: Setup database connection here
// Set up db connection here
import { MongoClient } from "mongodb";
const connectionString = "mongodb://127.0.0.1:27017";

export const client = new MongoClient(connectionString, {
    useUnifiedTopology: true, // เป็นการใช้ Connection management engine ตัวใหม่
  });

  export const db = client.db("beCpDb");