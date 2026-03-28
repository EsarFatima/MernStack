# Creature Collector - MERN Stack Application

A full-stack web application where users can register, login, and manage a collection of creatures (Pokémon-inspired).

## Project Structure

```
mernstacklab/
├── creature-collector-backend/     # Node.js/Express backend
│   ├── controllers/                # Request handlers
│   │   ├── authController.js       # Authentication logic
│   │   └── creatureController.js   # Creature CRUD operations
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js                 # User model
│   │   └── Creature.js             # Creature model
│   ├── routes/                     # API routes
│   │   ├── auth.js                 # Auth endpoints
│   │   └── creatures.js            # Creature endpoints
│   ├── server.js                   # Express app entry point
│   ├── package.json                # Backend dependencies
│   └── .env                        # Environment variables
└── creature-collector-client/      # React frontend
    ├── public/                     # Static files
    ├── src/
    │   ├── api/
    │   │   └── api.js              # API request helper
    │   ├── components/             # React components
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Auth.css
    │   │   └── Dashboard.css
    │   ├── App.js                  # Main app component
    │   ├── App.css                 # App styles
    │   ├── index.js                # React entry point
    │   └── index.css               # Global styles
    └── package.json                # Frontend dependencies
```

## Prerequisites

- **Node.js**: v18 or later (download from https://nodejs.org/)
- **MongoDB**: Either local installation or MongoDB Atlas cloud database
- **npm**: Comes with Node.js
- **Code Editor**: VS Code recommended

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd creature-collector-backend

# Install dependencies
npm install

# Update .env file with your MongoDB connection string if needed
# Edit .env:
# MONGODB_URI=mongodb://localhost:27017/creatureDB
# JWT_SECRET=your-secret-key
# SESSION_SECRET=your-session-secret
# PORT=5000

# Start the server (development mode with nodemon)
npm run dev
# Or start without auto-reload:
npm start

# Server should be running at http://localhost:5000
```

### 2. Frontend Setup

In a new terminal:

```bash
# Navigate to frontend directory
cd creature-collector-client

# Install dependencies
npm install

# Start the React development server
npm start

# Browser should open at http://localhost:3000
```

## API Endpoints

### Authentication

- **POST /auth/register**
  - Request: `{ username: string, password: string }`
  - Response: `{ message: "User registered successfully" }`

- **POST /auth/login**
  - Request: `{ username: string, password: string }`
  - Response: `{ message: "Login successful", userId: string }`
  - Sets HTTP-only cookie with JWT token

- **POST /auth/logout**
  - Response: `{ message: "Logged out successfully" }`

### Creatures (All require authentication)

- **GET /creatures**
  - Response: Array of creature objects `[{ _id, name, power, owner, createdAt }, ...]`

- **POST /creatures**
  - Request: `{ name: string, power?: string }`
  - Response: Created creature object with `_id`

- **DELETE /creatures/:id**
  - Response: `{ message: "Creature deleted successfully" }`

## Testing with Postman

1. **Register a User**
   - Method: POST
   - URL: `http://localhost:5000/auth/register`
   - Body (JSON): `{ "username": "ash", "password": "pikachu" }`

2. **Login**
   - Method: POST
   - URL: `http://localhost:5000/auth/login`
   - Body (JSON): `{ "username": "ash", "password": "pikachu" }`
   - Important: Postman will automatically save the token cookie

3. **Get Creatures**
   - Method: GET
   - URL: `http://localhost:5000/creatures`
   - Cookies: Should be automatically included from login

4. **Add Creature**
   - Method: POST
   - URL: `http://localhost:5000/creatures`
   - Body (JSON): `{ "name": "Pikachu", "power": "Electric" }`

5. **Delete Creature**
   - Method: DELETE
   - URL: `http://localhost:5000/creatures/{creature_id}`

## Technology Stack

### Backend
- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcrypt**: Password hashing
- **express-session**: Server-side session management
- **cookie-parser**: Cookie parsing middleware
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **React Hooks**: State management (useState, useEffect)
- **Fetch API**: HTTP requests

## Key Features

✅ User Registration and Login
✅ JWT Authentication with HTTP-only Cookies
✅ Server-side Session Management
✅ Creature CRUD Operations (Create, Read, Delete)
✅ User-specific creature collections
✅ Responsive UI
✅ Error handling

## Security Notes

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens are stored in HTTP-only, secure cookies (XSS protection)
- CSS and JavaScript cannot access the authentication cookie
- Session IDs are used alongside JWT for demonstration purposes
- In production, update environment variables and set `secure: true` for cookies with HTTPS

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas: Update `MONGODB_URI` in `.env`

### CORS Error
- The frontend and backend URLs are configured correctly in both `server.js` and `api.js`
- Make sure backend is running on port 5000 and frontend on port 3000

### Cookie Not Saving
- Ensure you set `credentials: 'include'` in fetch requests (already done in api.js)
- Check browser DevTools -> Application -> Cookies

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Set `PORT=3001 npm start`

## Stretch Goals

1. Add creature images with image URL field
2. Search/filter functionality for creatures
3. Edit creature details
4. Creature statistics and leveling
5. Creature trading between users
6. Admin dashboard

## References

- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- React Hooks: https://react.dev/reference/react/hooks
- JWT Best Practices: https://tools.ietf.org/html/rfc7519
