# 🏛️ REC Campus Companion — Official Student & Staff Digital Utility Hub

> **Official Rajalakshmi Engineering College (REC), Chennai Digital Platform**  
> *“Hardwork Beats Talent When Talent Doesn't Work Hard” — Official REC Motto*

---

## 🌐 Live Web Application & Deployment

* **Production Live URL**: [https://rec-campus-companion.vercel.app/](https://rec-campus-companion.vercel.app/)
* **Platform Status**: 🟢 Active & Deployed on Vercel Serverless Network

---

## 📌 Platform Overview

**REC Campus Companion** is an integrated, single-window digital utility hub designed specifically for **Rajalakshmi Engineering College (Thandalam, Chennai)**. The platform unifies daily campus operations, academic schedules, event management, hosteller mess services, canteen food court ordering, and campus transport logistics into a seamless, high-performance web experience.

Engineered with a cohesive design system—combining **Vercel Web Interface Guidelines**, **Refined Aesthetics**, **Deterministic Design Tokens**, **Fluid Micro-Interactions**, and **WCAG AAA/AA Accessible Contrast**—the platform ensures 100% data fidelity, zero friction, and real-time state synchronization across all student and faculty accounts.

---

## 🚀 Core Campus Modules & Feature Highlights

### 1. 📅 Timetable & Vacant Classroom Locator
* Departmental period schedules for **CSE, ECE, IT, MECH, EEE, AI & DS, and Biotech**.
* Filterable schedule lookup by Department, Academic Year (1st–4th), and Section (A/B) for Monday through Friday.
* **Vacant Classroom Finder**: Real-time listing of available lecture halls across **J Block, I Block, A Block, B Block, and K Block** with seat capacity and AC indicators.

### 2. 🎉 Campus Events Feed & Digital QR Entry Pass
* Event announcements and registration for hackathons, cultural festivals, and technical workshops at **Indoor Auditorium, REC CAFE Lawn, and J Block**.
* **Instant Encrypted QR Ticket Pass**: Automatically generates an entry pass upon RSVP for gate check-in and attendee verification.

### 3. 🔍 Lost & Found Bulletin Board
* Report missing items with base64 image file upload support (up to 5MB).
* Location tag indexing covering **HUT CAFE, REC CAFE, 6th Sense Garden, Blackbuck Cafe, J Block, and Hostels**.
* Status tracking with one-click **Mark as Claimed / Resolved** resolution toggles.

### 4. 📢 Club Directory & Announcements Portal
* Verified announcements and recruitment drives for recognized campus chapters including **Coding Club REC, Rotaract, IEEE REC, and EDC**.
* Access control matrix restricting posting privileges to verified club leads, faculty, and administrators.

### 5. 🍲 Hosteller Mess Menu & Dish Ratings
* Weekly food menu schedules across all 5 REC Hostels (**Pearl, Ruby, Emerald, Sapphire, and Diamond**).
* Covers Breakfast, Lunch, Evening Snacks, and Dinner.
* **Live Mess Rush Gauge** + Hosteller dish rating and feedback submission system.

### 6. ☕ Canteen & Food Court Hub
* Menus for 4 Campus Food Courts: **HUT CAFE**, **REC CAFE**, **6th Sense Garden**, and **Blackbuck Cafe**.
* Complete item listings, pricing, and ratings for artisanal mocktails, smoothies, barista coffee brews, paninis, and pasta.
* **Live Canteen Crowd Meter** + student food review feed.

### 7. 🚌 Bus Transport Hub (130+ Routes)
* Complete schedule and route details for 130 REC bus routes operating across Chennai (**Poonamallee, Tambaram, Porur, Guindy, Velachery, etc.**).
* Departure timetables, bus bay positions, driver contact details, and transport coordinator helplines.

---

## 🛠️ Technical Architecture

```
                       ┌────────────────────────────────────────┐
                       │   REC Campus Companion Web Frontend    │
                       │     (React 18 + Vite + Lucide + QR)    │
                       └───────────────────┬────────────────────┘
                                           │
                                    REST API / Polling (3s)
                                           │
                       ┌───────────────────▼────────────────────┐
                       │     Express.js Node Backend Server     │
                       │     (JWT Auth + CORS + Store Sync)     │
                       └───────────────────┬────────────────────┘
                                           │
                       ┌───────────────────▼────────────────────┐
                       │     Persistent JSON Database Engine    │
                       │   (database/db.json & schema.json)     │
                       └────────────────────────────────────────┘
```

* **Frontend**: React 18, Vite 5, Lucide Icons, QRCode.react, CSS Variables Design System.
* **Backend**: Node.js, Express.js, JWT Authentication, CORS Middleware.
* **Database**: Persistent JSON File Engine (`database/db.json`), `store.js` state manager.
* **Synchronization**: Real-time 3-second background polling engine (`/api/sync/poll`).

---

## 📁 Repository Directory Structure

```
.
├── client/                     # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # All 7 Campus Utility Components + Navbar + Sidebar
│   │   ├── context/            # AuthContext & 3s Real-Time Polling Engine
│   │   ├── services/           # Axios API Service Configuration
│   │   └── index.css           # Design Tokens, Micro-Animations & Theme System
│   └── package.json
│
├── server/                     # Node.js + Express Backend Application
│   ├── routes/                 # Modular REST API endpoints (auth, timetable, events, etc.)
│   ├── data/                   # Data store manager & persistent db.json
│   └── server.js               # Express server entry point (Port 5000)
│
├── database/                   # Database Architecture & Schema Documentation
│   ├── db.json                 # Seeded JSON database dump
│   ├── schema.json             # Collection JSON Schema specification
│   └── README.md               # Database & synchronization documentation
│
├── .gitignore                  # Repository hygiene configuration
└── README.md                   # Platform Documentation
```

---

## 💻 Deployment & Local Setup

### 🌐 Live Production Deployment
Experience the live application deployed on Vercel:  
👉 **[https://rec-campus-companion.vercel.app/](https://rec-campus-companion.vercel.app/)**

---

### 🖥️ Local Environment Setup

#### Prerequisites
* Node.js v18.0.0 or higher
* npm v9.0.0 or higher

#### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/Mayanksharma-17/rec-campus-companion.git
cd rec-campus-companion
```

#### 2. Start Backend Server
```bash
cd server
npm install
node server.js
```
*Backend server runs at **`http://localhost:5000`**.*

#### 3. Start Frontend Client
Open a secondary terminal:
```bash
cd client
npm install
npm run dev
```
*Frontend application runs at **`http://localhost:3000`**.*

---

### 🛡️ License & Institutional Compliance
Developed for **Rajalakshmi Engineering College (Thandalam, Chennai)**. All rights reserved.
