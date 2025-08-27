## Database Setup Instructions

The developers API has been created but requires the `developers` table to be set up in your Supabase database.

### Option 1: Create Table via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL command:

```sql
-- Create developers table
CREATE TABLE IF NOT EXISTS developers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_developers_email ON developers(email);
```

### Option 2: Test the API Endpoints

Once the table is created, you can test the API endpoints:

#### Register a new developer:

```bash
curl -X POST http://localhost:3002/api/developers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

#### Login:

```bash
curl -X POST http://localhost:3002/api/developers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Get Profile (requires token from login response):

```bash
curl -X GET http://localhost:3002/api/developers/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Integration

The frontend components have been updated to use the real API:

- **Login Component**: Now connects to `/api/developers/login`
- **Register Component**: Now connects to `/api/developers/register`
- **Profile Component**: Now connects to `/api/developers/profile`

### Features Implemented

✅ **Database Table**: `developers` with all required fields
✅ **Registration API**: POST `/api/developers/register`
✅ **Login API**: POST `/api/developers/login`
✅ **Profile API**: GET `/api/developers/profile`
✅ **Update Profile API**: PUT `/api/developers/profile`
✅ **JWT Authentication**: Secure token-based authentication
✅ **Password Hashing**: Using bcrypt for secure password storage
✅ **Input Validation**: Server-side validation for all endpoints
✅ **Error Handling**: Comprehensive error responses
✅ **Frontend Integration**: All components updated to use real API

### Table Schema

```sql
developers (
  id SERIAL PRIMARY KEY,           -- Auto-incrementing ID
  name VARCHAR(255) NOT NULL,      -- First name (required)
  last_name VARCHAR(255),          -- Last name (optional)
  email VARCHAR(255) UNIQUE NOT NULL, -- Email (required, unique)
  password VARCHAR(255) NOT NULL,  -- Hashed password (required)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

After creating the table, the authentication system will be fully functional!
