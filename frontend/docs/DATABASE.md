# Database Documentation (Prisma)

The application utilizes Prisma ORM connected to a PostgreSQL database. Below are the 7 core models and their relationships.

## 1. User
The core identity model representing both Standard Users and Administrators.
- **Fields:** `id` (UUID), `userId` (String, Unique, e.g. SAT1001), `fullName` (String), `username` (String, Unique), `email` (String, Optional), `password` (String, Bcrypt hashed), `role` (Enum: ADMIN, USER), `status` (Enum: ACTIVE, INACTIVE), `createdAt`, `updatedAt`.
- **Relations:** 
  - `attendances` (1-to-many `Attendance`)
  - `journals` (1-to-many `Journal`)
  - `eventRegistrations` (1-to-many `EventRegistration`)

## 2. Event
Represents a community gathering, workshop, or sabha.
- **Fields:** `id` (UUID), `title` (String), `description` (String), `eventDate` (DateTime), `venue` (String), `createdAt`, `updatedAt`.
- **Relations:**
  - `registrations` (1-to-many `EventRegistration`)

## 3. EventRegistration
A join table handling the many-to-many relationship between Users and Events.
- **Fields:** `id` (UUID), `userId` (String, Foreign Key -> User), `eventId` (String, Foreign Key -> Event), `registeredAt` (DateTime).
- **Constraints:** A User can only register for a specific Event once (`@@unique([userId, eventId])`).

## 4. Attendance
Tracks a user's presence or absence at a specific gathering.
- **Fields:** `id` (UUID), `userId` (String, Foreign Key -> User), `sabhaDate` (DateTime), `sabhaName` (String), `status` (Enum: PRESENT, ABSENT), `startTime` (DateTime, Optional), `endTime` (DateTime, Optional), `createdAt`.
- **Constraints:** A User can only have one attendance record per sabhaDate and sabhaName (`@@unique([userId, sabhaDate, sabhaName])`).

## 5. Notice
Global announcements broadcasted to the community dashboard.
- **Fields:** `id` (UUID), `title` (String), `description` (String), `priority` (Enum: LOW, MEDIUM, HIGH), `createdAt`, `updatedAt`.

## 6. Journal
Private reflections written by a user.
- **Fields:** `id` (UUID), `userId` (String, Foreign Key -> User), `title` (String), `learning` (String), `sabhaDate` (DateTime), `createdAt`, `updatedAt`.
- **Note:** Only the creator (or an Admin via the Admin Journals view) can read these entries.

## 7. Gallery
Image metadata tracking files uploaded to Cloudinary.
- **Fields:** `id` (UUID), `title` (String), `description` (String, Optional), `imageUrl` (String), `publicId` (String, Cloudinary reference for deletion), `createdAt`, `updatedAt`.
