<div align="center">

<br />

# SubGuilt

### *You subscribed. You forgot. We didn't.*

**A full-stack subscription awareness platform — browser extension, intelligent backend, and analytics dashboard — built to drag your forgotten recurring charges into the light and make you feel deeply, personally responsible for them.**

<br />

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

<br />

</div>

---

## 📖 Overview

You're paying for Prime Video and you haven't opened it in eight months. You have three different "cloud storage" plans. You genuinely cannot remember signing up for that one. **SubGuilt** knows. SubGuilt always knew.

SubGuilt is a three-part ecosystem built around a simple premise: subscription services rely on your forgetfulness to make money. This project fights back. A **browser extension** silently detects subscription activity as you browse, a **backend API** stores and processes everything it catches, and an **analytics dashboard** lays out your financial crimes in clean, unignorable charts. The name is a feature, not a bug — it's specifically engineered to make you feel something about that $14.99/month you haven't used since the pandemic.

---

## ✨ Features

- 🕵️ **Passive Detection** — The browser extension watches silently as you browse, logging subscription activity without you lifting a finger. You don't even have to admit you signed up for it.
- 📊 **Visual Analytics Dashboard** — A clean, data-rich dashboard that visualises your subscription portfolio, spending trends, and upcoming renewals. It's like a mirror, but for your bank account, and you can't look away.
- 🧠 **Intelligent Backend** — A structured API layer manages subscription records, persists user data, and serves the dashboard with processed insights. It remembers so you can't pretend you forgot.
- 🗂️ **Structured Data Models** — Clearly defined schemas ensure consistency between every layer of the stack. Every subscription, logged. Every excuse, invalid.
- ⚡ **Modern Stack** — Built with TypeScript, Python, Tailwind CSS, and vanilla JS across a modular multi-layer architecture. Overengineered? Maybe. But so is paying for four streaming platforms.

---

## 🏗️ Architecture

SubGuilt is composed of four tightly integrated layers:

```
subguilt/
├── subguilt_extension/   # Chrome/browser extension — detects & logs subscription signals
├── api/                  # RESTful API layer — routes, controllers, request handling
├── backend/              # Core server logic — business rules, data processing, service layer
├── models/               # Data models & schemas — shared definitions across the system
└── dashboard/            # Frontend analytics UI — visualises subscription data
```

### How It Flows

```
You visit a subscription page (again)
              │
              ▼
  [subguilt_extension]  ──── "oh we see you" — detects & logs the event
              │
              ▼ HTTP
          [api/]        ──── receives, validates, routes the confession
              │
              ▼
        [backend/]      ──── processes the data, holds it accountable
              │
              ▼
        [models/]       ──── persists it forever. FOREVER.
              │
              ▼
      [dashboard/]      ──── renders the truth, beautifully, inescapably
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Browser Extension | JavaScript, HTML, CSS, Chrome Extension APIs |
| API | JavaScript / TypeScript, Node.js |
| Backend | Python, JavaScript |
| Data Models | Python / JavaScript schemas |
| Dashboard | TypeScript, Tailwind CSS, HTML |
| Styling | Tailwind CSS v4, PostCSS, Autoprefixer |

---

## 🚀 Getting Started

Look, if you're going to be confronted with your financial decisions, you might as well set it up properly.

### Prerequisites

- **Node.js** v18 or higher
- **Python** 3.9 or higher
- **npm** or **yarn**
- A Chromium-based browser (Chrome, Edge, Brave) for the extension
- The emotional resilience to see your subscriptions listed in one place

### 1. Clone the Repository

```bash
git clone https://github.com/ProdByRnV/subguilt.git
cd subguilt
```

### 2. Setup the Backend & Train the Judge

```bash
cd backend
pip install -r requirements.txt
python ml_engine.py  # Trains the Random Forest model on your sins
python -m uvicorn main:app --reload
```

### 3. Launch the Dashboard

Open a new terminal window to start the Next.js frontend:

```bash
cd dashboard
npm install
npm run dev
```

### 4. Load the Browser Extension

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer Mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `subguilt-extension/` folder
5. The SubGuilt icon will appear in your toolbar — it's watching now. It's always watching.

---

## ⚙️ Configuration

Create a `.env` file in the root or `backend/` directory and populate the following:

```env
# Server
PORT=3000

# Database
DB_URI=your_database_connection_string

# Auth (if applicable)
JWT_SECRET=your_jwt_secret

# Add any other service keys here
```

> ⚠️ Never commit your `.env` file. It's already included in `.gitignore`.

---

## 📁 Project Structure (Detailed)

```
subguilt/
│
├── api/                    # API entry points and route handlers
│
├── backend/                # Business logic, middleware, server config
│
├── dashboard/              # Frontend UI for subscription visualisation
│   └── (TypeScript + Tailwind)
│
├── models/                 # Data schemas shared across the stack
│
├── subguilt_extension/     # Browser extension source
│   ├── manifest.json       # Extension manifest (permissions, entry points)
│   └── (content scripts, popup, background worker)
│
├── package.json            # Node.js dependencies & scripts
├── .gitignore
└── README.md
```

---

## 🗺️ Roadmap

- [ ] Firefox extension support *(for people who also haven't cancelled their Firefox Premium)*
- [ ] Email/push reminders for upcoming renewals — a gentle nudge, like a friend who knows your salary
- [ ] AI-powered "you probably forgot about this" nudges, personalised and devastating
- [ ] Spending category breakdown — *"Entertainment: £94/month. You watched 2 films."*
- [ ] Export to CSV / PDF, so you can attach it to your therapy notes
- [ ] Mobile companion app, for guilt on the go

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👤 Author

**ProdByRnV**

- GitHub: [@ProdByRnV](https://github.com/ProdByRnV)

---

<div align="center">

*Built with the quiet fury of someone who just discovered they've been paying for Headspace for two years and have opened it exactly once.*

</div>
