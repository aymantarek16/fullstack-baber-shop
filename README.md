# 💈 Barbershop Booking System

A full-stack modern web application for managing barbershop bookings, built with a clean user experience and a powerful admin dashboard.

---

## 🚀 Overview

This project is a real-world booking system for a barbershop that allows customers to easily reserve appointments without friction, while providing the business owner with full control over bookings through an admin panel.

The goal is to deliver:

* A fast and smooth user experience
* A modern premium UI
* A practical system that can be used in production

---

## ✨ Features

### 👤 Customer Side

* Book an appointment without creating an account
* Simple and intuitive booking flow
* Select date and time easily
* Instant booking submission
* Mobile-first responsive design

---

### 🛠 Admin Dashboard

* View all bookings in a structured table
* Booking status management:

  * Pending
  * Confirmed
  * Completed
  * Cancelled
* Delete bookings
* Organized UI for quick actions
* Optimized for real-world daily usage

---

## 🧩 Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Modern component-based architecture

### Backend

* Supabase (Database + Auth + APIs)
* PostgreSQL

### Deployment

* Vercel (Frontend hosting)

---

## 🏗 Architecture

The project follows a clean and scalable structure:

* **App Router (Next.js)** for routing and server rendering
* **Server Components** for fast data fetching
* **Client Components** for interactivity
* **Supabase** for backend services
* Separation between UI, logic, and data

---

## 🔐 Authentication

* Admin access is protected
* Uses Supabase authentication
* Only authorized users can access the dashboard

---

## ⚡ Performance

* Server-side rendering (SSR)
* Optimized data fetching
* Lightweight UI
* Fast load times

---

## 🎨 UI & UX

* Modern, clean, and premium design
* Smooth transitions and interactions
* Responsive across all devices
* Focus on usability and clarity

---

## 🌍 Use Case

This project can be used for:

* Barbershops
* Salons
* Small service businesses
* Appointment-based services

---

## 🧪 Future Improvements

* Online payments integration
* Notifications (WhatsApp / Email)
* Multi-branch support
* Staff management
* Time slot availability system

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/aymantarek16/fullstack-baber-shop>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 4. Run the project

```bash
npm run dev
```

---

## 🧑‍💻 Author

Built with focus on performance, scalability, and real-world usability.

---

## ⭐ Notes

This is not just a demo — it is structured to be production-ready and easily extendable for real clients.
