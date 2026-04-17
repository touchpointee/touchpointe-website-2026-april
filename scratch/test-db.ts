import { connectToDatabase } from "./lib/mongodb";

async function test() {
  try {
    console.log("Testing connection with new port...");
    const conn = await connectToDatabase();
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
  } catch (err) {
    console.error("FAILED to connect:", err);
    process.exit(1);
  }
}

test();
