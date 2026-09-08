# EventHub

EventHub is a full-stack MERN event and ticket booking portal. Organizers can publish events and review ticket sales, while customers can discover events, book tickets, and review their booking history.

The booking workflow uses an atomic inventory update inside a MongoDB transaction to prevent concurrent requests from overselling tickets.

## Live Application

| Resource | URL |
| --- | --- |
| Frontend | [https://event-booking-portal-three.vercel.app](https://event-booking-portal-three.vercel.app) |
| Backend API | [https://eventhub-api-bhadran.onrender.com/api](https://eventhub-api-bhadran.onrender.com/api) |
| API health check | [https://eventhub-api-bhadran.onrender.com/api/health](https://eventhub-api-bhadran.onrender.com/api/health) |
| GitHub repository | [https://github.com/bhadran-ss/event-booking-portal](https://github.com/bhadran-ss/event-booking-portal) |

The backend runs on a free Render instance and may take approximately 50 seconds to wake after a period of inactivity.

## Test Accounts

These accounts are provided only for assessment and demonstration.

| Role | Email | Password |
| --- | --- | --- |
| Organizer | `arjun@gmail.com` | `arjun123` |
| Customer | `rahul@gmail.com` | `rahul123` |

## Features

### Authentication and authorization

- Register as an `ORGANIZER` or `CUSTOMER`.
- Login with email and password.
- Passwords are hashed with bcrypt before storage.
- JWT authentication with persisted frontend session state.
- Role-based API authorization and protected React routes.
- Logout clears the stored session.

### Customer experience

- Browse upcoming events in a responsive grid.
- Filter events by category.
- Search by title, description, or location.
- View real-time remaining-ticket counts.
- View full event information in a modal.
- Calculate booking cost from ticket price and quantity.
- Book tickets as an authenticated customer.
- Receive clear loading, success, sold-out, validation, and authentication feedback.
- Review confirmed and cancelled bookings on the My Bookings page.

### Organizer experience

- Create events with category, date, price, and capacity validation.
- Automatically initialize `availableTickets` from `totalTickets`.
- View only events created by the authenticated organizer.
- Review tickets sold, remaining inventory, and total revenue.
- View an aggregated attendee list for each owned event.
- Prevent access to attendee information for events owned by another organizer.

### Booking safety

- Validates that the requested quantity is a positive whole number.
- Rejects bookings for past events.
- Rejects sold-out events and requests that exceed current availability.
- Atomically decrements ticket inventory only when enough tickets remain.
- Creates the Booking record in the same MongoDB transaction as the inventory update.
- Uses snapshot reads and majority writes for transaction consistency.
- Includes an executable concurrency test proving that competing requests cannot overbook an event.

## Technology Stack

### Frontend

- React 19
- Vite 8
- React Router
- Axios
- Tailwind CSS 4
- React Toastify

### Backend

- Node.js
- Express 5
- MongoDB Atlas
- Mongoose 9
- JSON Web Token
- bcryptjs
- express-validator
- Helmet, CORS, and Morgan

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```text
event-booking-portal/
|-- client/
|   |-- src/
|   |   |-- api/          # Axios client and API functions
|   |   |-- components/   # Auth, event, booking, and organizer UI
|   |   |-- context/      # Authentication state
|   |   |-- hooks/        # Reusable React hooks
|   |   |-- layouts/      # Shared navigation
|   |   |-- pages/        # Authentication and role-based pages
|   |   `-- utils/        # Error and formatting helpers
|   |-- .env.example
|   |-- vercel.json       # SPA route rewrites
|   `-- vite.config.js
|-- server/
|   |-- scripts/
|   |   `-- concurrency-test.js
|   |-- src/
|   |   |-- config/       # MongoDB connection
|   |   |-- constants/    # Roles, categories, and statuses
|   |   |-- controllers/  # HTTP request handlers
|   |   |-- middleware/   # Authentication, authorization, validation
|   |   |-- models/       # User, Event, and Booking schemas
|   |   |-- routes/       # Express routers
|   |   |-- services/     # Transactional booking logic
|   |   |-- utils/        # JWT and password helpers
|   |   `-- validators/   # Request validation rules
|   `-- .env.example
`-- README.md
```

## Local Setup

### Prerequisites

- Node.js `20.19.0` or newer, or `22.12.0` or newer
- npm
- A MongoDB Atlas cluster or a MongoDB deployment that supports transactions
- Git

### 1. Clone the repository

```bash
git clone https://github.com/bhadran-ss/event-booking-portal.git
cd event-booking-portal
```

### 2. Configure and run the backend

```bash
cd server
npm ci
```

Create `server/.env` from `server/.env.example`.

Windows CMD:

```cmd
copy .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Set the following values:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/event_booking?retryWrites=true&w=majority
JWT_SECRET=<a-long-random-secret>
JWT_EXPIRES_IN=7d
```

Generate a suitable JWT secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the development server:

```bash
npm run dev
```

The API is available at `http://localhost:5000/api`. Verify it at [http://localhost:5000/api/health](http://localhost:5000/api/health).

### 3. Configure and run the frontend

Open a second terminal from the repository root:

```bash
cd client
npm ci
```

Create `client/.env` from `client/.env.example`.

Windows CMD:

```cmd
copy .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Set the API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production build

```bash
cd client
npm run build
npm run preview
```

## Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | Runtime environment, normally `development` or `production` |
| `PORT` | No | Express port; defaults to `5000` locally |
| `CLIENT_ORIGIN` | Yes in production | Exact frontend origin allowed by CORS, without a trailing slash |
| `MONGODB_URI` | Yes | MongoDB connection string including the application database |
| `JWT_SECRET` | Yes | Long random secret used to sign JWTs |
| `JWT_EXPIRES_IN` | No | JWT lifetime; defaults to `7d` |

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Backend URL ending in `/api` |

Never commit real `.env` files, database passwords, JWT secrets, or production tokens.

## REST API

API base URL:

```text
https://eventhub-api-bhadran.onrender.com/api
```

Protected endpoints expect this header:

```http
Authorization: Bearer <jwt-token>
```

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a customer or organizer |
| `POST` | `/auth/login` | Public | Authenticate and return a JWT |
| `GET` | `/auth/me` | Authenticated | Return the current user |

Registration body:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

### Events and organizer reports

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/events` | Public | Retrieve upcoming events |
| `GET` | `/events?category=Tech` | Public | Filter upcoming events by category |
| `GET` | `/events?search=keyword` | Public | Search upcoming events |
| `GET` | `/events/:id` | Public | Retrieve current event details and availability |
| `POST` | `/events` | Organizer | Create an event |
| `GET` | `/events/organizer/my-events` | Organizer | Retrieve owned events with sales summaries |
| `GET` | `/events/:id/attendees` | Event owner | Retrieve aggregated confirmed attendees |

Create-event body:

```json
{
  "title": "Technology Conference",
  "description": "A conference for developers and technology enthusiasts.",
  "category": "Tech",
  "date": "2026-12-20T09:30:00.000Z",
  "location": "Kochi, Kerala",
  "ticketPrice": 499,
  "totalTickets": 100
}
```

Supported categories are `Music`, `Tech`, `Workshop`, `Sports`, and `Other`.

### Bookings

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/events/:id/book` | Customer | Atomically book one or more tickets |
| `GET` | `/bookings/my-bookings` | Customer | Retrieve the authenticated customer's bookings |

Booking body:

```json
{
  "requestedTickets": 2
}
```

Common responses include:

- `200` - request completed successfully
- `201` - resource created successfully
- `400` - invalid request data
- `401` - missing, invalid, or expired authentication token
- `403` - authenticated user lacks the required role or ownership
- `404` - event or route not found
- `409` - duplicate account or insufficient ticket inventory

## Concurrency Test

The script at `server/scripts/concurrency-test.js` creates an event with five tickets and sends two simultaneous requests for four tickets each. The test passes only when:

- Exactly one request returns `201`.
- Exactly one request returns `409`.
- The event finishes with one available ticket.
- Exactly one confirmed Booking record exists.
- The attendee report contains one customer with four tickets.

The test creates one event and one confirmed booking in the configured database.

From `server`, set these temporary environment variables with valid test accounts:

```text
API_BASE_URL=http://localhost:5000/api
ORGANIZER_EMAIL=<organizer-email>
ORGANIZER_PASSWORD=<organizer-password>
CUSTOMER_ONE_EMAIL=<first-customer-email>
CUSTOMER_ONE_PASSWORD=<first-customer-password>
CUSTOMER_TWO_EMAIL=<second-customer-email>
CUSTOMER_TWO_PASSWORD=<second-customer-password>
```

Then run:

```bash
node scripts/concurrency-test.js
```

A successful run ends with `CONCURRENCY TEST PASSED`.

## Deployment Notes

### Render backend

- Root directory: `server`
- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/api/health`
- Required production variables: `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_ORIGIN`

### Vercel frontend

- Root directory: `client`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Production variable: `VITE_API_BASE_URL=https://eventhub-api-bhadran.onrender.com/api`

`client/vercel.json` rewrites browser routes to `index.html`, allowing React Router pages such as `/login`, `/my-bookings`, and `/organizer/events` to load directly or after refresh.

After deploying the frontend, set Render's `CLIENT_ORIGIN` to the exact Vercel production origin:

```text
https://event-booking-portal-three.vercel.app
```

## Validation and Security

- Request validation is applied with express-validator.
- Protected requests are authenticated with signed JWTs.
- Authorization is enforced on the server by role and event ownership.
- Passwords are excluded from normal Mongoose queries and responses.
- Helmet adds common HTTP security headers.
- CORS allows only the configured frontend origin.
- Search input is escaped before creating case-insensitive regular expressions.
- `.env`, build output, logs, dependencies, and editor-specific files are excluded from Git.

## Assignment Coverage

- Required User, Event, and Booking schemas
- All specified authentication, public, customer, and organizer endpoints
- Customer event browsing, filtering, searching, booking, and booking history
- Organizer event creation, sales reporting, and attendee reporting
- Loading indicators and toast-based error feedback
- JWT session persistence and logout
- Atomic ticket availability enforcement with a passing concurrency test
- Public GitHub repository and deployed frontend/backend
- Local setup instructions, sample environment keys, and role-based test credentials

