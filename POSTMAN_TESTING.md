# Postman Testing Guide

This guide shows how to test the Creature Collector API using Postman without the frontend.

## Setup Postman

1. Download Postman from https://www.postman.com/downloads/
2. Open Postman
3. Create a new Workspace (optional but recommended)
4. Create a new Collection called "Creature Collector"

## Testing Checklist

Follow these steps in order. Each test depends on the previous one.

### Test 1: Registration (POST)

**Endpoint:** `POST http://localhost:5000/auth/register`

**Headers:**
| Key | Value |
|-----|-------|
| Content-Type | application/json |

**Body (JSON):**
```json
{
  "username": "ash",
  "password": "pikachu"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Test Again With:**
```json
{
  "username": "brock",
  "password": "onix"
}
```

**Test Error Case:**
Try registering the same username again. Should get 400 error:
```json
{
  "error": "Username already exists"
}
```

---

### Test 2: Login (POST)

**Endpoint:** `POST http://localhost:5000/auth/login`

**Headers:**
| Key | Value |
|-----|-------|
| Content-Type | application/json |

**Body (JSON):**
```json
{
  "username": "ash",
  "password": "pikachu"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Check the Cookie:**
1. After login, go to **Cookies** tab in Postman (at bottom)
2. You should see a `token` cookie with the JWT value
3. This cookie will be sent with all future requests automatically

**Note:** The cookie is **HTTP-only** so you can see it in Postman's cookie manager, but JavaScript on the web cannot access it.

---

### Test 3: Get Creatures (GET) - Protected Route

**Endpoint:** `GET http://localhost:5000/creatures`

**Headers:**
| Key | Value |
|-----|-------|
| Content-Type | application/json |

**Body:** None (GET requests don't have bodies)

**Expected Response (200):**
```json
[]
```

Empty array because we haven't added any creatures yet.

**Important:** Postman automatically includes the `token` cookie because it was saved during login.

**Test Error Case:**
1. Create a new request to GET /creatures
2. Go to **Cookies** and uncheck the `token` cookie
3. Send the request
4. Should get 401 error:
```json
{
  "error": "Not logged in"
}
```

Then re-check the cookie to re-enable it.

---

### Test 4: Add Creature (POST) - Protected Route

**Endpoint:** `POST http://localhost:5000/creatures`

**Headers:**
| Key | Value |
|-----|-------|
| Content-Type | application/json |

**Body (JSON):**
```json
{
  "name": "Pikachu",
  "power": "Electric"
}
```

**Expected Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Pikachu",
  "power": "Electric",
  "owner": "507f1f77bcf86cd799439011",
  "createdAt": "2024-03-29T10:00:00.000Z"
}
```

**Add More Creatures:**
```json
{
  "name": "Charmander",
  "power": "Fire"
}
```

```json
{
  "name": "Bulbasaur",
  "power": "Grass"
}
```

**Copy the _id values** from responses - you'll need them for deletion.

---

### Test 5: Get Creatures Again (GET)

**Endpoint:** `GET http://localhost:5000/creatures`

**Expected Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Pikachu",
    "power": "Electric",
    "owner": "507f1f77bcf86cd799439011",
    "createdAt": "2024-03-29T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Charmander",
    "power": "Fire",
    "owner": "507f1f77bcf86cd799439011",
    "createdAt": "2024-03-29T10:05:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Bulbasaur",
    "power": "Grass",
    "owner": "507f1f77bcf86cd799439011",
    "createdAt": "2024-03-29T10:10:00.000Z"
  }
]
```

Should now show all 3 creatures.

---

### Test 6: Delete Creature (DELETE) - Protected Route

**Endpoint:** `DELETE http://localhost:5000/creatures/507f1f77bcf86cd799439012`

Replace `507f1f77bcf86cd799439012` with the actual `_id` from your response.

**Headers:**
| Key | Value |
|-----|-------|
| Content-Type | application/json |

**Expected Response (200):**
```json
{
  "message": "Creature deleted successfully"
}
```

**Verify Deletion:**
1. Send GET /creatures again
2. Pikachu should be gone, only 2 creatures remain

**Delete All Creatures:**
Repeat the DELETE test with the _id of the remaining creatures.

---

### Test 7: Error Cases

**Test: Missing Required Field**
- Endpoint: POST /creatures
- Body: `{ "power": "Electric" }` (no name)
- Expected: 400 error with message about name required

**Test: Invalid Creature ID**
- Endpoint: DELETE /creatures/invalid-id-here
- Expected: 404 error (Creature not found)

**Test: Wrong Password**
- Endpoint: POST /auth/login
- Body: `{ "username": "ash", "password": "wrongpassword" }`
- Expected: 400 error (Invalid credentials)

---

### Test 8: Logout (POST)

**Endpoint:** `POST http://localhost:5000/auth/logout`

**Expected Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**What Happens:**
1. Cookie is cleared
2. Session is destroyed
3. Next request to protected route will fail

**Verify:**
1. Send GET /creatures
2. Should get 401 error (Not logged in)

---

## Postman Collection Export

To save these tests for later:

1. Right-click on collection "Creature Collector"
2. Select "Export"
3. Choose format (usually JSON)
4. Save file

To import later:
1. File → Import
2. Select the exported file

---

## Environment Variables (Optional)

Set up Postman Environment to make testing easier:

1. Click "Environment" (gear icon in top-right)
2. Create new environment called "Creature Collector"
3. Add variable: `base_url` = `http://localhost:5000`

Then use `{{base_url}}/auth/login` instead of full URL.

---

## Troubleshooting Postman Tests

### Issue: "Could not get any response"
- Backend server not running
- Start: `npm run dev` in backend folder

### Issue: 401 Unauthorized on creatures endpoint
- Cookie not being sent
- Make sure you logged in first
- Check Cookies tab in Postman
- Make sure "token" cookie exists

### Issue: Cookie not saving
- Go to Settings (gear icon)
- Scroll to "COOKIES"
- Enable "Automatically persist cookies"

### Issue: "CORS error" in Postman
- Postman should handle CORS correctly
- If issues, check backend has CORS enabled
- Look in `server.js` - CORS should be configured

---

## Manual Testing vs Frontend

**Postman Benefits:**
- Test protected endpoints without UI
- Inspect raw responses
- Check HTTP status codes
- Verify cookies and headers

**Frontend Benefits:**
- Test full user experience
- Verify UI updates
- Test error messages
- See what real users see

Use both for complete testing!

---

## Testing with Frontend

Once Postman tests pass, test with the React frontend:

1. Keep backend running (`npm run dev`)
2. In new terminal, start frontend (`npm start`)
3. Browser opens to localhost:3000
4. Register and login through forms
5. Add/delete creatures through UI
6. Check DevTools (F12) Network tab to see API calls

---

## Progressive Testing Flow

### Phase 1: Authentication
- ✅ Register new user
- ✅ Login with credentials
- ✅ Error on duplicate username
- ✅ Error on wrong password

### Phase 2: Protected Routes
- ✅ GET creatures (should be empty list)
- ✅ GET creatures fails without login

### Phase 3: Create Operations
- ✅ Add one creature
- ✅ GET creatures returns list
- ✅ Add multiple creatures
- ✅ All creatures list correctly

### Phase 4: Delete Operations  
- ✅ Delete a creature
- ✅ Creature removed from list
- ✅ Error on invalid ID

### Phase 5: Authorization
- ✅ Can't access endpoints without login
- ✅ User can only see their own creatures

### Phase 6: Edge Cases
- ✅ Logout clears session
- ✅ Can login again after logout
- ✅ Empty creature name fails
- ✅ Power field is optional
