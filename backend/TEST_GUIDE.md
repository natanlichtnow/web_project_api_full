# API Test Suite Guide

## Overview
Comprehensive API tests for the Around project backend. Tests validate:
- User registration and authentication
- Login and JWT token generation
- Protected routes and authorization
- Card CRUD operations
- Like/unlike functionality
- User profile updates
- Error handling (400, 401, 403, 404, 409)

## Prerequisites

### 1. MongoDB Setup

#### Option A: Local MongoDB (Recommended for Development)
```powershell
# Download and install MongoDB Community Edition from:
# https://www.mongodb.com/try/download/community

# Start MongoDB locally
mongod --dbpath "C:\path\to\data\directory"

# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Update `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aroundb
PORT=3001
JWT_SECRET=your-secret-key
```

### 2. Backend Dependencies
```powershell
cd backend
npm install
```

### 3. Frontend (optional for UI testing)
```powershell
cd frontend
npm install
```

## Running Tests

### Start Backend
```powershell
cd backend
npm run dev
```
Expected output:
```
Servidor rodando na porta 3001
Connected to MongoDB
```

### Run API Tests
```powershell
cd backend
node tests/api.test.js
```

### Expected Output
```
🧪 Running API Tests...

✅ POST /signup - Register new user
✅ POST /signup - Reject duplicate email
✅ POST /signin - Login with valid credentials
✅ POST /signin - Reject invalid credentials
✅ GET /users/me - Requires authentication
✅ GET /users/me - Get current user with token
✅ GET /users - Get all users without token (should fail)
✅ GET /cards - Get all cards requires token
✅ POST /cards - Create card with token
✅ DELETE /cards/:id - Delete own card
✅ DELETE /cards/:id - Cannot delete other user's card
✅ PUT /cards/:id/likes - Like a card
✅ PATCH /users/me - Update profile
✅ PATCH /users/me/avatar - Update avatar
✅ GET /crash-test - Server recovers after error

📊 Results: 15 passed, 0 failed out of 15 tests
```

## Test Cases Covered

### Authentication & Authorization
- ✅ User registration with validation
- ✅ Email uniqueness validation (409 Conflict)
- ✅ User login and JWT token generation
- ✅ Invalid credentials handling (401 Unauthorized)
- ✅ Protected routes require valid token
- ✅ Token verification in Authorization header

### User Operations
- ✅ Get current user info (`GET /users/me`)
- ✅ Update user profile (`PATCH /users/me`)
- ✅ Update avatar (`PATCH /users/me/avatar`)
- ✅ Password is never returned in responses

### Card Operations
- ✅ Create card (`POST /cards`)
- ✅ Get all cards (`GET /cards`)
- ✅ Delete own card (`DELETE /cards/:id`)
- ✅ Cannot delete other user's card (403 Forbidden)
- ✅ Like/unlike cards (`PUT /cards/:id/likes`, `DELETE /cards/:id/likes`)

### Error Handling
- ✅ 400 Bad Request - invalid data
- ✅ 401 Unauthorized - missing/invalid token
- ✅ 403 Forbidden - unauthorized action
- ✅ 404 Not Found - non-existent resource
- ✅ 409 Conflict - duplicate email
- ✅ 500 Server Error handling

## Adding New Tests

Edit `backend/tests/api.test.js`:

```javascript
test('Your test name', async ({ request, setToken }) => {
  const res = await request('POST', '/your-endpoint', {
    /* body */
  }, token);

  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  // Add assertions...
});
```

## Debugging

### Enable debug output
```powershell
$env:DEBUG=1; node tests/api.test.js
```

### Check MongoDB connection
```powershell
mongosh  # or mongo for older versions
use aroundb
db.users.find()
db.cards.find()
```

### View server logs
```powershell
# Request logs
cat backend/request.log | tail -20

# Error logs
cat backend/error.log | tail -20
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB not running - start MongoDB first |
| `PORT already in use` | Change PORT in `.env` or kill process on port 3001 |
| Tests timeout | MongoDB connection slow - check network/MongoDB status |
| `ValidationError` | Invalid data format - check request body schema |
| Token not valid | Ensure JWT_SECRET matches between requests |

## Checklist Requirements Met

According to Project 18 Checklist, the API validates:

- [x] Proper HTTP status codes (400, 401, 403, 404, 409, 500)
- [x] User registration and password hashing
- [x] Unique email validation
- [x] Email format validation
- [x] Login creates JWT with 7-day expiration
- [x] Protected routes require valid JWT
- [x] User cannot delete other user's cards
- [x] User cannot edit other user's profile
- [x] Centralized error handling
- [x] Request and error logging (Winston)
- [x] Server recovers from crashes (nodemon)

## Next Steps

1. ✅ Install MongoDB
2. ✅ Start MongoDB service
3. ✅ Run `npm install` in backend directory
4. ✅ Start backend with `npm run dev`
5. ✅ Run tests with `node tests/api.test.js`
6. ✅ All tests should pass with green checkmarks
