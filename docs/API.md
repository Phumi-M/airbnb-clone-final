# API Documentation

REST API for the Airbnb clone. Base URL: **http://localhost:5000** (or set via `PORT`).

---

## Table of contents

1. [Authentication](#authentication)
2. [Auth endpoints](#auth-endpoints)
3. [Listings endpoints](#listings-endpoints)
4. [Reservations endpoints](#reservations-endpoints)
5. [Error responses](#error-responses)

---

## Authentication

Endpoints that require a logged-in user expect the JWT in the **Authorization** header:

```http
Authorization: Bearer <your_jwt_token>
```

The token is returned from **POST /login** or **POST /register** and is valid for 7 days. If the token is missing, invalid, or expired, the server responds with **401 Unauthorized**.

---

## Auth endpoints

### POST /login

Authenticate with email and password. Returns a user object and JWT.

**Request**

- **Content-Type:** `application/json`
- **Body:**

| Field    | Type   | Required | Description        |
| -------- | ------ | -------- | ------------------ |
| `email`  | string | Yes      | User email         |
| `password` | string | Yes    | User password      |

**Example**

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response (200 OK)**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error responses**

| Status | Meaning                          | Body example                                  |
|--------|----------------------------------|-----------------------------------------------|
| 400    | Missing email or password       | `{ "message": "Email and password are required" }` |
| 401    | Invalid credentials              | `{ "message": "Invalid email or password" }`  |
| 500    | Server error                     | `{ "message": "Login failed" }`                |

---

### POST /register

Create a new user account. Email must be unique. Returns the same shape as login (user + token).

**Request**

- **Content-Type:** `application/json`
- **Body:**

| Field      | Type   | Required | Description                |
| ---------- | ------ | -------- | -------------------------- |
| `name`     | string | Yes      | Display name               |
| `email`    | string | Yes      | Unique email               |
| `password` | string | Yes      | Min 6 characters           |

**Example**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response (201 Created)**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error responses**

| Status | Meaning                    | Body example                                                |
|--------|----------------------------|-------------------------------------------------------------|
| 400    | Validation or duplicate     | `{ "message": "An account with this email already exists" }` |
| 500    | Server error               | `{ "message": "Registration failed" }`                      |

---

## Listings endpoints

Listings are accommodations (properties). All listing responses use string `id` (MongoDB ObjectId as string).

### GET /listings

Return all listings. Public; no auth required. Each listing may include a `createdBy` object (id, name, email) when populated.

**Response (200 OK)**

```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "title": "Cozy Apartment",
    "location": "Cape Town",
    "description": "A beautiful place...",
    "descriptionShort": "4 guests · 2 bedrooms",
    "type": "Apartment",
    "bedrooms": 2,
    "bathrooms": 1,
    "guests": 4,
    "price": 1500,
    "priceDisplay": "R1 500 / night",
    "img": "https://...",
    "images": [],
    "amenities": ["Wifi", "Kitchen"],
    "categories": ["beach", "popular"],
    "weeklyDiscount": 10,
    "cleaningFee": 200,
    "serviceFee": 0,
    "occupancyTaxes": 0,
    "star": 4.5,
    "reviewCount": 12,
    "total": "",
    "createdBy": { "id": "...", "name": "Host", "email": "host@example.com" },
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

---

### GET /listings/:id

Return a single listing by ID.

**Parameters**

| Name | Type   | Description      |
| ---- | ------ | ---------------- |
| `id` | string | Listing ObjectId |

**Response (200 OK)**  
Same shape as one element in the array above.

**Error responses**

| Status | Meaning         | Body example                    |
|--------|-----------------|---------------------------------|
| 404    | Listing not found | `{ "message": "Listing not found" }` |
| 500    | Server error    | `{ "message": "..." }`          |

---

### POST /listings

Create a new listing. No auth required by default; can be protected in production.

**Request**

- **Content-Type:** `application/json`
- **Body:** Listing fields. Required: `title`, `location`, `price`. Others optional.

| Field            | Type     | Required | Description                          |
| ---------------- | -------- | -------- | ------------------------------------ |
| `title`          | string   | Yes      | Max 100 chars                        |
| `location`       | string   | Yes      | e.g. city or area                    |
| `price`          | number   | Yes      | Price per night (≥ 0)                |
| `description`    | string   | No       | Max 500 chars                        |
| `descriptionShort` | string | No       | Short summary                        |
| `type`           | string   | No       | One of: Apartment, House, Cabin, Villa, Loft, Studio, Other |
| `bedrooms`       | number   | No       | Default 0                            |
| `bathrooms`      | number   | No       | Default 0                            |
| `guests`         | number   | No       | Default 1                            |
| `priceDisplay`   | string   | No       | e.g. "R1 500 / night"                |
| `img`            | string   | No       | Main image URL                      |
| `images`         | string[] | No       | Additional image URLs               |
| `amenities`      | string[] | No       | e.g. ["Wifi", "Kitchen"]            |
| `categories`     | string[] | No       | e.g. ["beach", "popular"]           |
| `weeklyDiscount`  | number   | No       | 0–100                                |
| `cleaningFee`    | number   | No       | Default 0                            |
| `serviceFee`     | number   | No       | Default 0                            |
| `occupancyTaxes` | number   | No       | Default 0                            |
| `star`           | number   | No       | 0–5                                  |
| `reviewCount`    | number   | No       | Default 0                            |
| `total`          | string   | No       | Display total text                  |

**Response (201 Created)**  
Created listing object (same shape as GET /listings/:id).

**Error responses**

| Status | Meaning       | Body example                    |
|--------|---------------|---------------------------------|
| 400    | Validation    | `{ "message": "Title is required" }` |
| 500    | Server error  | `{ "message": "..." }`          |

---

### PUT /listings/:id

Update an existing listing. Partial updates supported; only sent fields are updated.

**Parameters**

| Name | Type   | Description      |
| ---- | ------ | ---------------- |
| `id` | string | Listing ObjectId |

**Request**

- **Content-Type:** `application/json`
- **Body:** Any subset of the listing fields from POST /listings (same types and rules).

**Response (200 OK)**  
Updated listing object.

**Error responses**

| Status | Meaning          | Body example                    |
|--------|------------------|---------------------------------|
| 400    | Validation       | `{ "message": "..." }`          |
| 404    | Listing not found | `{ "message": "Listing not found" }` |
| 500    | Server error     | `{ "message": "..." }`          |

---

### DELETE /listings/:id

Delete a listing.

**Parameters**

| Name | Type   | Description      |
| ---- | ------ | ---------------- |
| `id` | string | Listing ObjectId |

**Response (204 No Content)**  
No body.

**Error responses**

| Status | Meaning          | Body example                    |
|--------|------------------|---------------------------------|
| 404    | Listing not found | `{ "message": "Listing not found" }` |
| 500    | Server error     | `{ "message": "..." }`          |

---

## Reservations endpoints

Reservations require a valid JWT (see [Authentication](#authentication)).

### GET /reservations

List reservations for the currently authenticated user. Sorted by start date (newest first).

**Headers**

- **Authorization:** `Bearer <token>`

**Response (200 OK)**

```json
[
  {
    "id": "507f1f77bcf86cd799439014",
    "user": "507f1f77bcf86cd799439011",
    "listing": { "_id": "...", "title": "...", "location": "...", "img": "...", "price": 1500 },
    "userEmail": "user@example.com",
    "listingId": "507f1f77bcf86cd799439013",
    "title": "Cozy Apartment",
    "location": "Cape Town",
    "img": "https://...",
    "priceDisplay": "R1 500 / night",
    "startDate": "2026-03-20T00:00:00.000Z",
    "endDate": "2026-03-25T00:00:00.000Z",
    "guests": 2,
    "total": 8500,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

**Error responses**

| Status | Meaning     | Body example                    |
|--------|-------------|---------------------------------|
| 401    | Not authorized | `{ "message": "Not authorized" }` |
| 500    | Server error | `{ "message": "..." }`          |

---

### POST /reservations

Create a reservation for the current user.

**Headers**

- **Authorization:** `Bearer <token>`

**Request**

- **Content-Type:** `application/json`
- **Body:**

| Field          | Type   | Required | Description        |
| -------------- | ------ | -------- | ------------------ |
| `listingId` or `listing` | string | Yes | Listing ObjectId   |
| `startDate`   | string/Date | Yes | Check-in (ISO date) |
| `endDate`     | string/Date | Yes | Check-out (ISO date) |
| `total`       | number | Yes      | Total price        |
| `guests`      | number | No       | Default 1          |
| `title`       | string | No       | Listing title copy |
| `location`    | string | No       | Listing location   |
| `img`         | string | No       | Listing image      |
| `priceDisplay`| string | No       | Display price      |
| `userEmail`   | string | No       | Filled from token  |

**Response (201 Created)**  
Created reservation object.

**Error responses**

| Status | Meaning     | Body example                    |
|--------|-------------|---------------------------------|
| 400    | Validation  | `{ "message": "..." }`          |
| 401    | Not authorized | `{ "message": "Not authorized" }` |
| 500    | Server error | `{ "message": "..." }`          |

---

## Error responses

- **400 Bad Request** – Invalid or missing input; `message` describes the error.
- **401 Unauthorized** – Missing or invalid/expired JWT; `message` e.g. "Not authorized".
- **404 Not Found** – Resource (e.g. listing) not found; `message` e.g. "Listing not found".
- **500 Internal Server Error** – Server-side error; `message` may contain details.

All error bodies are JSON: `{ "message": "string" }`.

---

## Health check

### GET /health

Returns `{ "ok": true }`. Use for liveness/readiness checks.

**Response (200 OK)**

```json
{ "ok": true }
```
