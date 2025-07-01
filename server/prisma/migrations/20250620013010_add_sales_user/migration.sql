-- This is an empty migration.

-- Add sales user
INSERT INTO "User" ("id", "username", "email", "password", "role", "createdAt")
VALUES (
  gen_random_uuid(),
  'sales',
  'sales@travelpro.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'password'
  'sales',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;