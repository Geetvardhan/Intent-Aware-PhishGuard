# Intent-Aware PhishGuard

Intent-Aware PhishGuard is a **privacy-first Chrome extension** that prevents phishing by
intervening **exactly at the moment of user risk** — when a user is about to enter
sensitive information such as passwords, OTPs, payment details, or documents.

Unlike traditional phishing tools that continuously scan URLs or rely on blocklists,
PhishGuard activates **only when user intent is detected**, dramatically reducing false
positives and alert fatigue.

---

## 🔐 Core Principles

- **Intent-Aware** — activates only on risky user actions
- **Explainable** — every alert includes clear human-readable reasons
- **Privacy-First** — no backend, no telemetry, no data leaves the browser
- **Deterministic + ML Hybrid** — transparent rules enhanced with lightweight ML
- **Chrome MV3 Safe** — store-compliant, review-friendly

---

## 🧠 What It Detects

- Password entry
- OTP submission
- Payment information entry
- Document uploads

---

## 🔍 Signals Used

- Form action vs page domain mismatch
- IP-based domains
- Suspicious URL keywords
- Subdomain depth
- Redirect behavior
- Cross-domain & hidden iframes
- Domain structure heuristics (length, hyphens, numeric ratio)
- Suspicious TLDs
- Domain reputation bucket (Banking / Social / Govt / Unknown)

---

## ⚙️ Architecture Overview
    User Intent (Focus Input)
↓
Content Script (Intent + Signals)
↓
Service Worker (Risk Engine)
↓
Explainability Engine
↓
In-Page Warning Modal
↓
Local Insights Dashboard


---

## 📊 Insights Dashboard

- Recent alerts (local only)
- Common risk factors
- Impersonated brand aggregation
- Domain reputation summary
- Learning-oriented explanations

---

## 🚫 What PhishGuard Does NOT Do

- ❌ No browsing history upload
- ❌ No backend servers
- ❌ No external APIs
- ❌ No continuous page scanning

---

## 🚀 Installation (Developer Mode)

1. Clone the repository
2. Open `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the `extension/` folder

---

## 📦 Chrome Web Store

This project is **submission-ready** and compliant with Chrome Web Store policies.

---

## 🛡️ License

MIT License

