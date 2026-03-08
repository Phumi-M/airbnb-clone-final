# Backend – MongoDB + Mongoose

Express API with MongoDB via Mongoose: auth (JWT), listings CRUD, and reservations.

**Full API reference:** [../docs/API.md](../docs/API.md) – request/response shapes, status codes, and examples for all endpoints.

## Setup

1. **MongoDB**  
   Run MongoDB locally (e.g. `mongod`) or set `MONGODB_URI` to your Atlas/local URL.

2. **Environment**  
   Copy `.env.example` to `.env` and set:
   - `MONGODB_URI` (default: `mongodb://localhost:27017/airbnb_clone`)
   - `JWT_SECRET` (use a strong secret in production)

3. **Install and run**
   ```bash
   cd backend
   npm install
   npm run server
   ```
   Server: `http://localhost:5000`

## API

- **POST /login** – `{ "email", "password" }` → `{ "user": { "id", "name", "email" }, "token" }`
- **POST /register** – `{ "name", "email", "password" }` → same as login
- **GET /listings** – list all listings (from MongoDB)
- **GET /listings/:id** – one listing
- **POST /listings** – create (body: listing fields)
- **PUT /listings/:id** – update
- **DELETE /listings/:id** – delete
- **GET /reservations** – list current user’s reservations (requires `Authorization: Bearer <token>`)
- **POST /reservations** – create (protected)

## Models (Mongoose)

- **User** – name, email (unique), hashed password, phone
- **Listing** – title, location, description, type, bedrooms, bathrooms, guests, price, images, amenities, categories, `createdBy` → User
- **Reservation** – `user` → User, `listing` → Listing, startDate, endDate, guests, total

Relationships use `ref: "User"` / `ref: "Listing"` and `populate()` where needed.
