# ⚡ BidBlitz (Titan Edition)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-white?style=flat-square&logo=socket.io)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

BidBlitz is a high-performance, real-time auction platform engineered for elite collectors. Built with a "Flash and Finance" philosophy, it combines military-grade security with sub-100ms synchronization across its global auction network.

## 🚀 Key Features

### 💎 Elite Showcase Engine
- **Luxury Design System:** A stunning glassmorphic interface featuring a 3D animated "Premium Showcase" carousel for featured assets.
- **Dynamic Atmosphere:** Interactive aurora backgrounds and micro-animations that respond to user presence.
- **Sub-100ms Sync:** Powered by a specialized Socket.IO layer for instant bid updates and participant tracking.

### 🛡️ Secure Financial Ecosystem
- **Automated Escrow Payments:** The moment an auction hits zero, the final bid is automatically deducted from the winner and transferred to the seller.
- **Virtual Wallet:** A built-in currency system with pre-bid balance validation to eliminate "non-paying" winning bids.

### ⚡ Advanced Auction Modes
- **Rapid Mode:** High-intensity flash auctions (10–60 seconds) with no extensions—perfect for high-demand collectibles.
- **Anti-Snipe Shield:** For regular auctions, a proprietary algorithm adds +60s to the clock if a bid is placed in the final 30s, ensuring the highest legitimate bidder always wins.

### 💬 Transaction Channels
- **P2P Private Chat:** A secure, real-time communication channel that unlocks exclusively for the winner and seller to arrange fulfillment.
- **Verified History:** Full persistence of bidirectional messages and bid logs.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, Framer Motion, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js (Express), Socket.IO |
| **Database** | MongoDB with Mongoose (ODM) |
| **Auth** | JWT-based stateless authentication & Bcrypt hashing |
| **Styling** | Vanilla CSS (Modern CSS Properties) |

## 📂 Project Structure

```text
├── client/              # Next.js Frontend
│   ├── app/             # App Router components & pages
│   ├── components/      # Reusable UI components
│   ├── context/         # Auth & Socket contexts
│   └── hooks/           # Custom React hooks
└── server/              # Express Backend
    ├── src/
    │   ├── controllers/ # Request handlers
    │   ├── models/      # Mongoose schemas
    │   ├── routes/      # API endpoints
    │   ├── socket/      # Real-time logic
    │   └── scripts/     # Database seeding scripts
```

## 🏁 Getting Started

### 📦 Prerequisites
- Node.js v18+
- MongoDB (Local or Atlas)

### 🖥️ Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create `.env.local`):
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
Runs at `http://localhost:3000`

### ⚙️ Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create `.env`):
   ```bash
   cp .env.example .env
   ```
4. Seed the database with premium products:
   ```bash
   npx ts-node src/scripts/seed.ts
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
Runs at `http://localhost:5001`

## 🧪 Environment Variables

### Server (`.env`)
- `PORT`: Server port (default: 5001)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `CLIENT_URL`: URL of the frontend application

### Client (`.env.local`)
- `NEXT_PUBLIC_API_URL`: URL of the backend API

---
**BidBlitz – Precision-engineered for the modern collector.**

