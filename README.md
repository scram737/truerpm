# TrueRPM™ — Realistic YouTube Earnings & Geo-Traffic Engine

A web application designed for creators and marketers to calculate realistic YouTube AdSense earnings with **zero manual work**. Unlike traditional tools that assume blanket US CPM rates across all views, **TrueRPM** factors in **localized country purchasing power (60+ countries)**, **content niche multipliers**, **video duration mid-rolls**, **YouTube Shorts dilution**, and **AdBlock / Unpaid views filtering**.

---

## 🚀 Instant Local Run

TrueRPM includes a built-in Python live YouTube intelligence server:

```bash
# 1. Open terminal in the TrueRPM directory
cd d:\Movies\Antigavity\Lesson1\TrueRPM

# 2. Run the intelligence server
python server.py

# 3. Open in your browser:
http://127.0.0.1:8080/index.html
```

---

## ✨ Core Features

- **🔍 Zero-Manual-Work Live YouTube Channel Audit**:
  - Enter any channel name, handle (e.g. `@wildboybalu`, `@CarryMinati`), Channel ID, or URL.
  - Automatically extracts subscriber count, lifetime views, and monthly view velocity.
  - Checks public YouTube Partner Program (YPP) monetization status.
- **🌍 Intelligent Geographic Traffic & Script Detection**:
  - Detects regional language scripts (Telugu, Hindi, Tamil, Arabic, etc.) and cultural keywords to infer actual audience geography even when YouTube location tags are omitted.
- **⚡ Live Format Traffic Split (Long-Form vs Shorts)**:
  - Scrapes `/videos` and `/shorts` tabs to differentiate 60-second micro-RPM Shorts from high-RPM mid-roll videos.
- **🛡️ AdBlock & Unpaid Views Filter Engine**:
  - Removes adblocked and zero-ad impressions (0% to 60% adjustable slider + toggle).
  - Automatically defaults to niche-specific rates (Gaming: 45%, Tech: 42%, Entertainment: 25%, Kids: 12%).
  - Models realistic mobile vs desktop adblocking behavior.
- **🧮 Step-by-Step Mathematical Proof (The Fantasy vs. The True Payout)**:
  - Contrasts generic trackers ($0.25–$4.00 flat US rate) against real YouTube Studio math.
  - Shows exact formulas, views, deductions, and revenue step-by-step.
- **🌐 60+ Country Tiers & Purchasing Power**: Tier 1A ($4.50–$18.50 RPM) down to Tier 3 ($0.20–$0.90 RPM).
- **💼 Multi-Stream Creator Revenue**: Projects Brand Sponsorships, Channel Memberships/SuperChats, and Affiliate revenue.
- **💱 Multi-Currency Support**: Instant conversion across USD ($), INR (₹), EUR (€), GBP (£), CAD, AUD, and BRL.

---

## 📂 Project Structure

```
TrueRPM/
├── index.html          # Main responsive web application
├── style.css           # Glassmorphic dark-theme design system
├── server.py           # Python backend (live YouTube crawler & API)
├── README.md           # Documentation & setup guide
├── test_browser.py     # Playwright automated end-to-end verification
├── test_real_fetch.py  # Standalone YouTube scraper test script
└── js/
    ├── data.js         # 60+ country database, RPMs, niches, presets
    ├── engine.js       # Core mathematical revenue engine
    ├── resolver.js     # Channel resolution & API client
    └── app.js          # Main UI controller & state manager
```

---

## 🌐 Deployment & Self-Hosting Guide

TrueRPM is designed to run in two modes:
1. **Full-Stack Mode (Python Backend + Live YouTube Crawler API)**: Unlocks live real-time scraping of any YouTube channel, dynamic Shorts-split calculation, and public monetization status verification.
2. **Static Mode (Client-Only)**: Runs directly from any static host with no server needed, powered by the verified 60+ channel database, regional heuristic engine, and dynamic math calculation.

---

### Option 1: Docker & Docker Compose (Recommended for Self-Hosting / VPS)

Run the complete full-stack TrueRPM container anywhere with zero dependencies:

```bash
# Clone or navigate to the TrueRPM directory
cd TrueRPM

# Build and launch with Docker Compose
docker compose up -d

# Access your self-hosted instance:
http://localhost:8080
```

Or using plain Docker:
```bash
docker build -t truerpm .
docker run -d -p 8080:8080 --name truerpm-app truerpm
```

---

### Option 2: 100% Free Cloud PaaS (Render.com / Railway)

Get a permanent public URL with the full Python live crawler active:

#### Deploy to Render.com (Recommended Free Cloud Host):
1. Push this repository to GitHub.
2. Log into [Render.com](https://render.com) and click **New +** → **Blueprint**.
3. Connect your repository — Render will automatically detect [`render.yaml`](render.yaml) and configure the Python web service.
4. Click **Apply**. Render will deploy TrueRPM at `https://truerpm-engine.onrender.com`.

#### Deploy to Railway / Heroku:
- TrueRPM already contains [`Procfile`](Procfile) (`web: python server.py`). Connect your GitHub repo on [Railway.app](https://railway.app) to deploy in 60 seconds.

---

### Option 3: Traditional Linux VPS / Raspberry Pi (systemd + Nginx)

Run TrueRPM as a persistent system background service on Ubuntu / Debian / Rocky:

```bash
# 1. Create a systemd service file
sudo nano /etc/systemd/system/truerpm.service
```

Paste the following:
```ini
[Unit]
Description=TrueRPM YouTube Intelligence Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/truerpm
ExecStart=/usr/bin/python3 /var/www/truerpm/server.py
Restart=always
Environment=PORT=8080
Environment=HOST=127.0.0.1

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now truerpm
```

Configure Nginx reverse proxy with SSL (`certbot --nginx`):
```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### Option 4: Instant Public URL from Local Machine (Cloudflare Tunnel)

To instantly share your local TrueRPM server with anyone on the internet without port forwarding:

```bash
# Download cloudflared or run via package manager
cloudflared tunnel --url http://127.0.0.1:8080
```
Cloudflare will generate a free, encrypted `https://xxxx.trycloudflare.com` URL pointing directly to your TrueRPM instance.

---

### Option 5: Static Hosting (GitHub Pages / Vercel / Netlify)

- **GitHub Pages**: Go to **Settings** → **Pages** → Source: `main` / `(root)` → **Save**.
- **Vercel**: Run `vercel` or link repository (uses included [`vercel.json`](vercel.json)).
- **Netlify**: Drag & drop the TrueRPM folder or link Git repo (uses included [`netlify.toml`](netlify.toml)).

