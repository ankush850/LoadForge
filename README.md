# 🚀 LoadForge — Website Stress Testing & Analyzer Tool

LoadForge is a **full-stack performance testing platform** designed to simulate controlled load on websites and APIs while providing **real-time analytics and historical insights**.

It enables developers to evaluate system reliability, identify bottlenecks, and understand performance characteristics under varying traffic conditions — all through an intuitive, modern dashboard.

---

## ✨ Overview

Modern web systems must handle unpredictable traffic patterns. LoadForge provides a lightweight yet powerful way to:

* Simulate concurrent user load
* Measure latency and throughput
* Analyze performance trends visually
* Store and revisit past test runs

Built with a focus on **usability + observability**, LoadForge bridges the gap between simple testing tools and complex enterprise-grade solutions.

---

## ⚙️ Core Features

### 🧪 Configurable Load Testing

* Target any HTTP endpoint (websites or APIs)
* Adjustable parameters:

  * Total Requests
  * Concurrency Level
  * Test Modes:

    * **Normal** → steady load
    * **Spike** → sudden burst
    * **Ramp** → gradual increase
  * Ramp-up duration control

---

### 📊 Real-Time Performance Metrics

* Success & Failure counts
* Average, Minimum, Maximum latency
* Requests Per Second (RPS)
* Latency Percentiles:

  * P50 (median)
  * P90
  * P95
  * P99

---

### 📈 Interactive Visualizations

* **Latency Over Time** (trend analysis)
* **Success vs Failure Distribution**
* Smooth chart rendering for quick insights

---

### 🗂️ Test History & Analysis

* Persistent in-app test history
* Select and inspect previous runs
* Compare behavior across tests
* Delete unwanted records

---

### 🎨 Modern UI/UX

* Floating glass-style navbar (iOS-inspired)
* Dark themed dashboard
* Custom dropdowns (no native UI inconsistencies)
* Animated interactions (Framer Motion)
* Clean card-based layout

---

### ⚡ Smart UX Enhancements

* Automatic `https://` detection for URLs
* Responsive design across screen sizes
* Non-intrusive validation flows

---

## 🏗️ System Architecture

LoadForge follows a **client–server architecture**:

```text
Frontend (React)
      ↓
REST API (FastAPI)
      ↓
Load Testing Engine (asyncio + aiohttp)
      ↓
Metrics Processing & Storage
```

### Flow:

1. User configures a test via UI
2. Frontend sends request to backend API
3. Backend simulates concurrent load using async workers
4. Metrics are collected in real time
5. Results are returned and visualized
6. Test data is stored for future analysis

---

## 🧰 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* Chart.js

### Backend

* FastAPI
* Python asyncio
* aiohttp (for concurrent requests)

### Communication

* REST APIs (JSON-based)

---

## 📁 Project Structure

```
load-force/
│
├── backend/
│   ├── api/                # FastAPI routes
│   ├── engine/             # Load testing logic
│   ├── models/             # Data schemas
│   ├── storage/            # History management
│   ├── data/               # Runtime data (optional)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mayur-Shashidhar.git
cd load-force
```

---

### 2. Setup Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Open Application

```
http://localhost:5173
```

---

## 📸 Screenshots

<img width="1512" height="982" alt="Screenshot 2026-04-20 at 11 43 18 AM" src="https://github.com/user-attachments/assets/912fdfd9-dca9-40b9-8c5b-df1794d34fdb" />
<img width="1512" height="982" alt="Screenshot 2026-04-20 at 11 44 43 AM" src="https://github.com/user-attachments/assets/6a2804cf-ede9-47e7-82fb-1991e6979c27" />

---

## 🧪 Example Use Cases

* Testing API performance under load
* Benchmarking backend scalability
* Identifying latency spikes
* Simulating traffic bursts (e.g., product launches)

---

## 🔮 Future Enhancements

* Persistent database (PostgreSQL / SQLite)
* User authentication & profiles
* Distributed load testing (multi-node)
* Export reports (PDF / CSV)
* CI/CD integration for automated testing
* Rate limiting & safety guards

---

## 🏁 Final Note

LoadForge is designed as a **practical performance testing tool**, combining simplicity with meaningful insights.

It demonstrates:

* Full-stack system design
* Async backend processing
* Data visualization
* Real-world problem solving

---

> If you found this useful, consider starring ⭐ the repo!
