# Hosted Payment Lightbox Integration Example

A sample checkout application showing how to integrate with the [Elavon](https://developer.elavon.com) Hosted Payment Lightbox using a **React** frontend and **Node.js / Express** backend.

The user clicks **Buy Now**, the server creates an order and payment session via the Elavon Converge API, and a lightbox overlay appears on the page for the user to complete payment — no full-page redirect required.

---

## Quick Start

### Prerequisites

| Requirement | Details |
|---|---|
| **Node.js** | v18 or later |
| **npm** | Comes with Node.js |
| **Elavon credentials** | `MERCHANT_ALIAS` and `SECRET_KEY` from the [Elavon Developer Dashboard](https://developer.elavon.com/dashboard) |

### 1. Configure credentials

```bash
cp server/node/.env.example server/node/.env
```

Edit `server/node/.env` and fill in your credentials:

```
MERCHANT_ALIAS=<your_merchant_alias>
SECRET_KEY=<your_secret_key>
```

### 2. Install dependencies & start

**Backend** (runs on port 4000):

```bash
cd server/node
npm install
npm run dev
```

**Frontend** (runs on port 3000 — open a second terminal):

```bash
cd client/react
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Using a Dev Container

> Requires Docker and the **Dev Containers** VS Code extension.

#### Configure credentials

Copy and edit the `.env` file before opening the container:
  ```bash
  cp server/node/.env.example server/node/.env
  # fill in MERCHANT_ALIAS and SECRET_KEY
  ```

#### Open the container

1. Run **Dev Containers: Reopen in Container** from the Command Palette.
2. The container will install dependencies and start both servers automatically.

Port `3000` (frontend) will open in your browser; port `4000` (backend) is forwarded in the background.

If the `.env` file is missing or incomplete the container will print a message asking you to configure it.

---

## Project Structure

```
├── client/react/          # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── App.tsx        # Routes (/, /success)
│   │   ├── pages/
│   │   │   ├── Home.tsx   # Order summary, lightbox launch & "Buy Now" button
│   │   │   └── Success.tsx# Payment success page
│   │   └── App.css
│   ├── public/            # Static assets (product image)
│   ├── vite.config.ts
│   └── package.json
│
├── server/node/           # Express backend
│   ├── server.js          # Order creation & payment session API
│   ├── .env.example       # Template for credentials
│   └── package.json
│
└── .devcontainer/         # Dev Container config
    ├── devcontainer.json
    └── welcome-message.sh
```

## How It Works

```
Browser                   Express Server              Elavon Converge API
  │                            │                              │
  │  GET /payment-session      │                              │
  │ ──────────────────────────>│                              │
  │                            │  POST /orders                │
  │                            │ ────────────────────────────>│
  │                            │         order ID             │
  │                            │ <────────────────────────────│
  │                            │                              │
  │                            │  POST /payment-sessions      │
  │                            │ ────────────────────────────>│
  │                            │       session ID             │
  │                            │ <────────────────────────────│
  │        session ID          │                              │
  │ <──────────────────────────│                              │
  │                            │                              │
  │  Lightbox opens in-page using the Elavon JS library       │
  │ ─────────────────────────────────────────────────────────>│
  │                            │                              │
  │  On completion: lightbox closes & app navigates           │
  │ <─────────────────────────────────────────────────────────│
```

1. **Home page** (`/`) — displays an order summary ($12.00) with a **Buy Now** button and loads the Elavon Lightbox JS library.
2. The button calls `GET /payment-session` on the Express server.
3. The server creates an order via the Converge API, then creates a payment session configured for lightbox mode (`hppType: "lightbox"`).
4. The server returns a session ID; the browser uses it to launch the Elavon Lightbox overlay.
5. The user completes payment inside the lightbox. On success the app navigates to `/success`.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, Axios |
| Backend | Node.js, Express 5, Axios, dotenv, CORS |
| Dev tooling | ESLint, Nodemon, Dev Containers |

## Available Scripts

### Frontend (`client/react/`)

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

### Backend (`server/node/`)

| Script | Description |
|---|---|
| `npm run dev` | Start Express with Nodemon (auto-reload) on port 4000 |

## Troubleshooting

| Problem | Solution |
|---|---|
| *"Merchant credentials are not set"* | Make sure `server/node/.env` exists with valid `MERCHANT_ALIAS` and `SECRET_KEY` values. |
| *"Error starting payment session"* | Verify the backend is running on port 4000 and credentials are correct. |
| Port already in use | Kill the process: `lsof -ti:3000 \| xargs kill` or `lsof -ti:4000 \| xargs kill` |
| Module not found | Delete `node_modules`, run `npm cache clean --force`, then `npm install`. |

## License

ISC
