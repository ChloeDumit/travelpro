import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiration: '1d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  database: {
    url: process.env.DATABASE_URL
  }
}; 