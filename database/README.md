# 🗄️ REC Campus Companion — Database Architecture

## Overview
The **REC Campus Companion** platform utilizes a lightweight, high-performance persistent JSON database system (`db.json`) combined with an in-memory JSON state manager (`server/data/store.js`).

## Collections Breakdown

| Collection | Path | Description | Key Features |
| :--- | :--- | :--- | :--- |
| **Users** | `db.json -> users` | Campus roster & authentications | `@rajalakshmi.edu.in` domain validation, role privileges (Student, Hosteller, Staff, Admin, Club Lead). |
| **Timetable** | `db.json -> timetable` | Period schedules & vacant rooms | Departmental timetable lookup for CSE, ECE, IT, MECH, EEE, AI&DS, Biotech + Vacant lecture hall locator. |
| **Events** | `db.json -> events` | Campus hackathons & workshops | Venue RSVP tracking, attendee counters, and instant QR Code Entry Pass generator. |
| **Lost & Found** | `db.json -> lostFoundItems` | Missing belongings bulletin board | Base64 image file upload support, campus location tags, claim/resolve status toggles. |
| **Clubs** | `db.json -> clubAnnouncements` | Recognized REC clubs & notices | Member recruitment drives, notices for Coding Club, Rotaract, IEEE REC & EDC. |
| **Mess** | `db.json -> mess` | Hosteller meal schedules & ratings | Menus for 5 Hostels (Pearl, Ruby, Emerald, Sapphire, Diamond), live rush gauge, dish ratings. |
| **Canteen** | `db.json -> canteen` | Food court outlets & reviews | Artisanal menus for 4 Outlets (HUT CAFE, REC CAFE, 6th Sense Garden, Blackbuck Cafe), crowd meter. |
| **Transport** | `db.json -> transport` | Bus fleet routes & schedules | 130 bus routes across Chennai, morning & evening trip schedules, driver contacts. |

## 🔄 Real-Time Multi-User Sync Engine
* **Polling Endpoint**: `/api/sync/poll`
* **Mechanism**: 3-second background polling cycle syncs actions performed by any user across all active browser sessions automatically without page reloads.
