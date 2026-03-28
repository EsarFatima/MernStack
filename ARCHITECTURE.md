# MERN Stack Architecture & How It Works

This document explains the Creature Collector application architecture and the flow of data through the system.

## System Architecture

```
┌─────────────────────────┐
│   React Frontend        │
│   (Port 3000)           │
│  - Login Component      │
│  - Register Component   │
│  - Dashboard Component  │
└────────────┬────────────┘
             │ HTTP Requests
             │ (with Cookies)
             │
┌────────────▼────────────┐
│  Express Backend        │
│  (Port 5000)            │
│  - Auth Routes          │
│  - Creature Routes      │
│  - Middleware           │
└────────────┬────────────┘
             │ Queries
             │
┌────────────▼────────────┐
│  MongoDB Database       │
│  (Port 27017)           │
│  - Users Collection     │
│  - Creatures Collection │
└─────────────────────────┘
```

## Authentication Flow

### 1. User Registration
```
User Form (React)
    ↓
POST /auth/register { username, password }
    ↓
Backend (Express)
    - Validate input
    - Hash password with bcrypt
    - Save to MongoDB
    ↓
Response: { message: "User registered successfully" }
```

**Code Flow:**
```javascript
// Frontend: src/components/Register.js
const result = await apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});

// Backend: controllers/authController.js
exports.register = async (req, res) => {
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashed });
  await newUser.save();
};
```

### 2. User Login (Session + JWT Combined)
```
Login Form (React)
    ↓
POST /auth/login { username, password }
    ↓
Backend (Express)
    - Find user in MongoDB
    - Compare password with bcrypt
    - Create JWT token
    - Set HTTP-only cookie with JWT
    - Create session variable
    ↓
Response: { message: "Login successful" }
Set-Cookie: token=<JWT_TOKEN>; HttpOnly
Session: { userId: <USER_ID> }
```

**Code Flow:**
```javascript
// Frontend: src/components/Login.js
const result = await apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
if (result.message === 'Login successful') {
  onLogin(); // Navigate to Dashboard
}

// Backend: controllers/authController.js
exports.login = async (req, res) => {
  const match = await bcrypt.compare(password, user.password);
  
  // Create JWT
  const token = jwt.sign({ userId: user._id }, 'jwt-secret-key');
  
  // Set cookie
  res.cookie('token', token, { httpOnly: true });
  
  // Create session
  req.session.userId = user._id;
  
  res.json({ message: 'Login successful' });
};
```

## Key Concepts Explained

### 1. HTTP-only Cookies
- **What**: A cookie that JavaScript cannot read (protection against XSS attacks)
- **Why**: Prevents malicious scripts from stealing authentication tokens
- **Where**: Browser automatically sends it with every request to the backend
- **Code**: `res.cookie('token', token, { httpOnly: true });`

### 2. Sessions vs JWTs (Both Used for Learning)
| Aspect | Session | JWT |
|--------|---------|-----|
| **Storage** | Server memory | Client (cookie) |
| **Stateless** | No (stateful) | Yes |
| **Scalability** | Limited | Better for distributed systems |
| **Cookie Size** | Small (just ID) | Larger (contains data) |
| **Used Here** | `req.session` | HTTP-only cookie |
| **Purpose** | Demonstrate server-side auth | Demonstrate token-based auth |

### 3. Password Hashing with bcrypt
```javascript
// Never store plain passwords!
const hashed = await bcrypt.hash(password, 10);
// 10 = rounds (higher = more secure but slower)

// To verify:
const match = await bcrypt.compare(plainPassword, hashedPassword);
```

## API Endpoints Explained

### Authentication Endpoints

#### POST /auth/register
**Request:**
```json
{
  "username": "ash",
  "password": "pikachu"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

**What Happens:**
1. Backend receives username and password
2. Checks if username already exists
3. Hashes the password (bcrypt with 10 rounds)
4. Creates new User document in MongoDB
5. Returns success message

#### POST /auth/login
**Request:**
```json
{
  "username": "ash",
  "password": "pikachu"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Headers Set:**
```
Set-Cookie: token=eyJhbGc...; HttpOnly; Path=/
```

**What Happens:**
1. Backend finds user by username
2. Compares password with bcrypt
3. If valid: Creates JWT token with `userId`
4. Sets HTTP-only cookie with token
5. Creates session with userId
6. Frontend React should navigate to Dashboard

#### POST /auth/logout
**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**What Happens:**
1. Clears the JWT cookie
2. Destroys the session
3. Frontend navigates back to login

### Creature Endpoints (All Require Authentication)

#### GET /creatures
**Request:** No body (cookie is sent automatically)

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Pikachu",
    "power": "Electric",
    "owner": "507f1f77bcf86cd799439011",
    "createdAt": "2024-03-29T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Charmander",
    "power": "Fire",
    "owner": "507f1f77bcf86cd799439011",
    "createdAt": "2024-03-29T11:00:00Z"
  }
]
```

**Authorization:**
```javascript
const userId = req.session.userId; // Check session
if (!userId) return res.status(401).json({ error: 'Not logged in' });

// Get only this user's creatures
const creatures = await Creature.find({ owner: userId });
```

#### POST /creatures
**Request:**
```json
{
  "name": "Bulbasaur",
  "power": "Grass"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "Bulbasaur",
  "power": "Grass",
  "owner": "507f1f77bcf86cd799439011",
  "createdAt": "2024-03-29T12:00:00Z"
}
```

**What Happens:**
1. Extract userId from session
2. Check if user is logged in
3. Validate creature name is provided
4. Create new Creature linked to userId
5. Save to MongoDB
6. Return the created creature

#### DELETE /creatures/:id
**Request:** `/creatures/507f1f77bcf86cd799439014`

**Response:**
```json
{
  "message": "Creature deleted successfully"
}
```

**Authorization:**
```javascript
// Only delete if creature belongs to this user
const creature = await Creature.findOneAndDelete({ 
  _id: id, 
  owner: userId 
});
```

## Request/Response Flow Example

### Complete Flow: Add a Creature

**1. Frontend (React)**
```javascript
// Dashboard.js
const addCreature = async e => {
  e.preventDefault();
  const newCreature = await apiRequest('/creatures', {
    method: 'POST',
    body: JSON.stringify({ name: 'Pikachu', power: 'Electric' })
  });
  setCreatures([...creatures, newCreature]);
};
```

**2. API Helper (Sends Credentials)**
```javascript
// api/api.js
export async function apiRequest(path, options = {}) {
  const response = await fetch(`http://localhost:5000${path}`, {
    credentials: 'include', // Important: sends cookies!
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return response.json();
}
```

**3. Network Request**
```
POST http://localhost:5000/creatures HTTP/1.1
Cookie: token=eyJhbGc...
Content-Type: application/json
Content-Length: 49

{"name":"Pikachu","power":"Electric"}
```

**4. Backend (Express) - Middleware**
```javascript
// server.js - Middleware runs first
app.use(cookieParser()); // Parses cookie into req.cookies
app.use(session(...)); // Creates req.session from session ID
```

**5. Backend - Route Handler**
```javascript
// routes/creatures.js
router.post('/', creatureCtrl.addCreature);

// controllers/creatureController.js
exports.addCreature = async (req, res) => {
  const userId = req.session.userId; // From session middleware
  
  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  
  const { name, power } = req.body;
  const newCreature = new Creature({ name, power, owner: userId });
  await newCreature.save();
  
  res.status(201).json(newCreature);
};
```

**6. Database (MongoDB)**
```javascript
// Mongoose saves document
db.creatures.insert({
  _id: ObjectId("507f1f77bcf86cd799439014"),
  name: "Pikachu",
  power: "Electric",
  owner: ObjectId("507f1f77bcf86cd799439011"),
  createdAt: ISODate("2024-03-29T10:30:00Z")
});
```

**7. Response Back to Frontend**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "_id": "507f1f77bcf86cd799439014",
  "name": "Pikachu",
  "power": "Electric",
  "owner": "507f1f77bcf86cd799439011",
  "createdAt": "2024-03-29T10:30:00Z"
}
```

**8. Frontend Updates UI**
```javascript
// React updates state with new creature
setCreatures([...creatures, newCreature]);
// Component re-renders with the new creature in the list
```

## File Structure & Responsibilities

### Backend Components

**models/User.js** - Defines MongoDB User schema
- Stores username (unique) and hashed password
- Mongoose validates and creates indexes

**models/Creature.js** - Defines MongoDB Creature schema
- name: creature's name
- power: creature's ability (optional)
- owner: reference to User._id (relationship)

**controllers/authController.js** - Authentication logic
- `register()`: Hash password, create user
- `login()`: Verify credentials, issue JWT, create session
- `logout()`: Clear cookie and session

**controllers/creatureController.js** - Creature operations
- `getCreatures()`: Return user's creatures
- `addCreature()`: Create new creature
- `deleteCreature()`: Remove creature (if owned by user)

**routes/auth.js** - Auth API routes
- Maps HTTP methods to controller functions
- POST /register → authCtrl.register
- POST /login → authCtrl.login
- POST /logout → authCtrl.logout

**routes/creatures.js** - Creature API routes
- GET / → creatureCtrl.getCreatures
- POST / → creatureCtrl.addCreature
- DELETE /:id → creatureCtrl.deleteCreature

**server.js** - Express app entry point
- Sets up middleware (CORS, cookies, sessions, JSON parsing)
- Connects to MongoDB
- Mounts routes
- Starts server on port 5000

### Frontend Components

**api/api.js** - HTTP request helper
- Wraps fetch with credentials: 'include'
- Ensures cookies are sent with requests
- Centralizes API calls

**components/Login.js** - Login form
- Takes username and password
- Calls POST /auth/login
- Calls onLogin() callback on success

**components/Register.js** - Registration form
- Takes username and password
- Calls POST /auth/register
- Shows success message

**components/Dashboard.js** - Main app after login
- Fetches creatures with useEffect
- Shows list of user's creatures
- Form to add new creatures
- Delete buttons for each creature
- Logout button

**App.js** - Main app component
- Routes between Login/Register/Dashboard
- Maintains userLoggedIn state
- Shows authentication forms or dashboard

## Common Questions

### Q: Why use both JWT and Sessions?
**A:** This lab demonstrates both for learning:
- **JWT** (in cookie): Stateless, modern approach, scalable
- **Session** (server-side): Stateful, traditional approach, revokable
- In production, choose one based on your needs

### Q: Why is the JWT in a cookie?
**A:** Cookies can be set to HTTP-only:
- JavaScript cannot access it (XSS protection)
- Browser sends it automatically with each request
- More secure than storing in localStorage

### Q: Can I see the JWT contents?
**A:** JWTs are not encrypted, just signed. You can decode at https://jwt.io but:
- Never expose in production
- The signature proves it wasn't tampered with
- Real secrets (like JWT_SECRET) must stay private

### Q: What happens if I delete MongoDB?
**A:** All data is lost. In production, use proper backups and testing databases.

### Q: Can I use this in production?
**A:** Not directly, you would need to:
- Use environment variables properly
- Set secure: true for cookies (requires HTTPS)
- Use a proper session store (not memory)
- Add input validation and sanitization
- Add rate limiting
- Use database authentication
- Set up proper error handling
- Add logging and monitoring

## Next Steps

1. Try to understand each file's purpose
2. Add console.logs to see the data flow
3. Use browser DevTools to inspect:
   - Network requests and responses
   - Cookies (Application → Cookies)
   - Local storage
4. Modify the code and see what breaks
5. Add new features (image URLs, creature stats, etc.)
