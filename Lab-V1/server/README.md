# Express.js Backend for React Lab

## Overview

This Express.js backend provides REST API endpoints for managing experiments data through Supabase integration.

## Features

- ✅ RESTful API endpoints for experiments CRUD operations
- ✅ Supabase integration with environment variable configuration
- ✅ CORS support for frontend communication
- ✅ Request logging with Morgan
- ✅ Security headers with Helmet
- ✅ Error handling middleware
- ✅ Health check endpoint

## API Endpoints

### Experiments

- `GET /api/experiments` - Get all experiments
- `GET /api/experiments/:id` - Get experiment by ID
- `POST /api/experiments` - Create new experiment
- `PUT /api/experiments/:id` - Update experiment
- `DELETE /api/experiments/:id` - Delete experiment
- `GET /api/experiments/category/:category` - Get experiments by category
- `GET /api/experiments/difficulty/:difficulty` - Get experiments by difficulty
- `GET /api/experiments/search/:query` - Search experiments
- `POST /api/experiments/seed` - Seed database with sample data

### System

- `GET /health` - Health check endpoint
- `GET /api` - API information

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Setup & Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in your Supabase credentials.

3. **Start the server:**

Development mode with auto-restart:

```bash
npm run dev
```

Production mode:

```bash
npm run server
```

4. **Run both frontend and backend:**

```bash
npm run dev:full
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "count": 10
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Security Features

- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Environment variable configuration
- Input validation and sanitization
- Error handling without exposing internal details

## Development

The server uses ES modules and supports hot reloading with nodemon in development mode.
