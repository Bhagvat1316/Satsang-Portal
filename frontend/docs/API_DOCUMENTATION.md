# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/auth`)

### 1. Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "userId": "SAT1001",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbG...",
    "user": { "userId": "SAT1001", "role": "ADMIN" }
  }
  ```
- **Errors:** `400` (Missing fields), `401` (Invalid credentials), `403` (Inactive account).

### 2. Change Password
- **URL:** `/auth/change-password`
- **Method:** `PUT`
- **Auth:** Required (JWT)
- **Request Body:**
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newPassword456"
  }
  ```
- **Response (200 OK):** `{"success": true, "message": "Password changed successfully."}`
- **Errors:** `400` (Incorrect current password / Invalid length).

---

## Users (`/users`)

### 1. Get Current User Profile
- **URL:** `/users/me`
- **Method:** `GET`
- **Auth:** Required (JWT)
- **Response (200 OK):** `{"success": true, "data": { ...user }}`

### 2. Update Current User Profile
- **URL:** `/users/me`
- **Method:** `PUT`
- **Auth:** Required (JWT)
- **Request Body:** `{"username": "...", "fullName": "...", "email": "..."}`
- **Response (200 OK):** `{"success": true, "data": { ...updatedUser }}`

### 3. Admin CRUD (Require `ADMIN` Role)
- **GET `/users`**: Fetch all users.
- **GET `/users/:id`**: Fetch specific user.
- **POST `/users`**: Create a new user.
- **PUT `/users/:id`**: Update user details.
- **PATCH `/users/:id/status`**: Toggle ACTIVE/INACTIVE status.
- **DELETE `/users/:id`**: Delete a user.

---

## Events (`/events`)

- **GET `/events`**: Fetch all paginated events.
- **GET `/events/:id`**: Get specific event.
- **POST `/events`** (Admin): Create event.
- **PUT `/events/:id`** (Admin): Update event.
- **DELETE `/events/:id`** (Admin): Delete event.
- **POST `/events/:id/register`**: Register current user for event.
- **GET `/events/:id/registrations`** (Admin): Fetch list of participants.

---

## Attendance (`/attendance`)

- **POST `/attendance/bulk-present`** (Admin): 
  - Payload: `{ "sabhaDate", "sabhaName", "userIds": [...] }`
- **POST `/attendance/bulk-absent`** (Admin): 
  - Payload: `{ "sabhaDate", "sabhaName", "userIds": [...] }`
- **GET `/attendance/user/:userId/history`**: Get paginated attendance history for a specific user.

---

## Notices (`/notices`)

- **GET `/notices`**: Get all active notices.
- **POST `/notices`** (Admin): Create notice.
- **PUT `/notices/:id`** (Admin): Edit notice.
- **DELETE `/notices/:id`** (Admin): Remove notice.

---

## Journals (`/journals`)

- **GET `/journals/my`**: Get current user's paginated journals.
- **GET `/journals`** (Admin): Get all journals across the platform.
- **POST `/journals`**: Create a new journal entry.
- **PUT `/journals/:id`**: Update own journal entry.
- **DELETE `/journals/:id`**: Delete own journal entry.

---

## Gallery (`/gallery`)

- **GET `/gallery`**: Fetch all images.
- **POST `/gallery`** (Admin): Upload image (multipart/form-data).
- **DELETE `/gallery/:id`** (Admin): Delete image from Cloudinary and Database.
