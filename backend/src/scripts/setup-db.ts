import dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "../db/init.js";

async function setup_database() {
  try {
    console.log("=== Database Setup ===\n");

    
    await initializeDatabase();

    console.log("\n=== Setup Complete ===");
    process.exit(0);
  } catch (error) {
    console.error("\n=== Setup Failed ===");
    console.error(error);
    process.exit(1);
  }
}


setup_database();
