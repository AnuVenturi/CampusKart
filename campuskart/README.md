# 🛒 CampusKart — Student Marketplace

A full-stack student-only buy, sell, exchange, and give-away marketplace starter built with React + Vite, Express, MongoDB, JWT authentication, and Socket.IO. Clothes are intentionally excluded.

## Prerequisites
- Node.js 20+ and npm
- MongoDB Atlas connection string **or** MongoDB running locally on port 27017

## Run locally (Windows / macOS / Linux)

1. In `server`, copy `.env.example` to `.env`. Set `MONGO_URI` and a random `JWT_SECRET` of at least 32 characters. Leave `CLIENT_ORIGIN=http://localhost:5173` for local testing.
2. In `client`, copy `.env.example` to `.env`. Keep `VITE_API_URL=http://localhost:5000/api` for local testing.
3. From project root run:

```bash
npm install
npm run install:all
npm run dev
```

Open **http://localhost:5173**. Backend health: **http://localhost:5000/api/health**. The root backend URL is not a frontend page.

### Make an admin
Register your account first on the website. In a second terminal:

```bash
cd server
node src/make-admin.js your-registered-email@college.edu
```

Log out and back in. The Admin link will appear. Approve the first listing through Admin → Items.

## Features available in this starter
- Student registration, login, student ID, department/year fields, JWT and hashed passwords
- Browse/search/filter listings (category, price, condition, free, exchange)
- Submit listings for admin approval, update reservation/sold status, remove listings
- Wishlist and price-change notifications
- Buyer–seller chats with live Socket.IO push plus persisted message history
- Buy-interest requests, free claims, exchange requests, seller acceptance and completion
- Reporting, blocking, admin student verification/suspension and moderation
- Admin summary statistics and mobile-responsive UI

## Important scope and limitations
- **College-email restriction is optional** via `COLLEGE_EMAIL_DOMAIN` (e.g. `example.edu`). **Email ownership verification is not implemented**; a student is not automatically marked verified. Admin can manually verify a user after checking ID. For production, add OTP/email confirmation or SSO.
- **Image URL input only**; full Cloudinary file upload integration is not included. Provide public `https://` links (up to five). For production, sign uploads on the server and moderate file types.
- Chat messages are persisted in MongoDB; Socket.IO pushes new messages to the other user in real time. This implementation does not include read receipts/typing indicators.
- No payment gateway or courier/shipping. Students arrange campus meetups themselves.
- Seller can mark items sold via My Listings; completing an accepted request will also mark sold.
- Admin category management, verified email workflows, full rating/review subsystem, transaction dispute resolution, and automatic matching are **future enhancements**, not built in this ZIP.
- For a public deployment add stronger payload validation, message limits/pagination, content moderation, spam controls, audit logging, CSRF strategy if cookies are used, and proper authorization/privacy tests.

## Deployment guidance
**Render (API)**: Root directory `server`; Build command `npm install`; Start command `npm start`. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN=https://your-frontend.vercel.app`, optional `COLLEGE_EMAIL_DOMAIN`. Do not set secrets in Vite variables.

**Vercel (frontend)**: Root directory `client`; framework Vite; build command `npm run build`; output `dist`; set public variable `VITE_API_URL=https://your-render-service.onrender.com/api`. This URL is necessarily public in the browser; never put secrets in `VITE_` variables.

For SPA direct-route refresh, the included `client/vercel.json` rewrites paths to `index.html`.

**Phone use**: Never leave `VITE_API_URL` set to `http://localhost:5000/api` after deploying. `localhost` on your phone means the phone itself, not your laptop.

## Folder structure
- `client/src/pages` — Home, item details, sell, wishlist, chats, requests, notifications, admin, auth
- `client/src/components` — Navbar and cards
- `server/src/models` — MongoDB schemas
- `server/src/routes` — REST API routes
- `server/src/middleware` — JWT authorization

## Suggested improvements
Add institutional email OTP, image upload endpoint, reviews, role-based audits, seller profile pages, category CRUD, push notifications, university-specific tenants, listing pagination, safer content validation and automated tests.
