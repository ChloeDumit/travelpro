#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

console.log("🚀 Setting up TravelPro Backend...\n");

// Check if .env exists
const envPath = path.join(rootDir, ".env");
if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env file...");
  const envExample = `# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/travelpro_db"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_${Math.random()
    .toString(36)
    .substring(2, 15)}
JWT_EXPIRATION=1d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Security Configuration
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;

  fs.writeFileSync(envPath, envExample);
  console.log("✅ .env file created");
} else {
  console.log("✅ .env file already exists");
}

// Create logs directory
const logsDir = path.join(rootDir, "logs");
if (!fs.existsSync(logsDir)) {
  console.log("📁 Creating logs directory...");
  fs.mkdirSync(logsDir, { recursive: true });
  console.log("✅ Logs directory created");
} else {
  console.log("✅ Logs directory already exists");
}

// Install dependencies
console.log("📦 Installing dependencies...");
try {
  execSync("npm install", { cwd: rootDir, stdio: "inherit" });
  console.log("✅ Dependencies installed");
} catch (error) {
  console.error("❌ Failed to install dependencies:", error.message);
  process.exit(1);
}

// Generate Prisma client
console.log("🔧 Generating Prisma client...");
try {
  execSync("npx prisma generate", { cwd: rootDir, stdio: "inherit" });
  console.log("✅ Prisma client generated");
} catch (error) {
  console.error("❌ Failed to generate Prisma client:", error.message);
  process.exit(1);
}

// Run database migrations
console.log("🗄️ Running database migrations...");
try {
  execSync("npx prisma migrate deploy", { cwd: rootDir, stdio: "inherit" });
  console.log("✅ Database migrations completed");
} catch (error) {
  console.error("❌ Failed to run migrations:", error.message);
  console.log(
    "💡 Make sure your database is running and DATABASE_URL is correct"
  );
  process.exit(1);
}

// Seed database
console.log("🌱 Seeding database...");
try {
  execSync("npm run seed", { cwd: rootDir, stdio: "inherit" });
  console.log("✅ Database seeded");
} catch (error) {
  console.error("❌ Failed to seed database:", error.message);
  console.log("💡 You can run 'npm run seed' manually later");
}

console.log("\n🎉 Setup completed successfully!");
console.log("\n📋 Next steps:");
console.log("1. Update your .env file with correct database credentials");
console.log("2. Run 'npm run dev' to start the development server");
console.log(
  "3. Visit http://localhost:3001/health to verify the server is running"
);
console.log("\n🔗 Useful commands:");
console.log("- npm run dev: Start development server");
console.log("- npm start: Start production server");
console.log("- npm run prisma:studio: Open Prisma Studio");
console.log("- npm run seed: Seed the database");
console.log("\n📚 Documentation: See README.md for more information");
