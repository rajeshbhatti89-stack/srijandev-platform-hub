# Hybrid Deployment & DevOps Guide for srijandev.in

This guide details the complete end-to-end architecture and deployment procedure for **srijandev.in**:
- **Frontend Client Dashboard**: Cloudflare Pages (`https://srijandev.in`)
- **Live Tracking & Telemetry Backend**: Render Web Service (`https://api.srijandev.in` / `wss://api.srijandev.in`)

---

## 🏗️ Architecture Overview

```
                        ┌──────────────────────────────┐
                        │      Cloudflare Edge DNS     │
                        └──────────────┬───────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
                ▼                                             ▼
  ┌───────────────────────────┐                 ┌───────────────────────────┐
  │     Cloudflare Pages      │                 │    Render Web Service     │
  │   (Frontend Dashboard)    │                 │   (Node HTTP + WebSockets)│
  │  https://srijandev.in     │                 │  https://api.srijandev.in │
  └───────────────────────────┘                 └───────────────────────────┘
```

---

## 🚀 Step 1: Render Backend Deployment (`api.srijandev.in`)

1. Log into your [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint** (or **Web Service**).
2. Connect your repository (`srijandev_platform_hub`). Render will detect `render.yaml` automatically:
   - **Service Name**: `srijandev-backend`
   - **Region**: Singapore (or nearest region)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

3. **Configure Environment Variables in Render**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `10000` | Port binding for Express/Node |
   | `CORS_ORIGIN` | `https://srijandev.in` | Permits cross-origin requests from frontend |
   | `NEXT_APP_URL` | `https://srijandev.in` | Directs portal redirects to frontend domain |

4. Under **Settings** -> **Custom Domains**, add:
   - Domain: `api.srijandev.in`

---

## ⚡ Step 2: Cloudflare Pages Frontend Deployment (`srijandev.in`)

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** -> **Create Application** -> **Pages**.
2. Connect your Git repository.
3. **Build Settings**:
   - **Framework Preset**: `Next.js (Static Export)`
   - **Build Command**: `cd apps/srijandev-next && npm run build`
   - **Build Output Directory**: `apps/srijandev-next/out` (or `public`)

4. **Environment Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://api.srijandev.in` | Backend REST API endpoint |
   | `NEXT_PUBLIC_WS_URL` | `wss://api.srijandev.in` | WebSocket live telemetry endpoint |

---

## 🌐 Step 3: Cloudflare DNS & SSL Configuration

1. In Cloudflare DNS management for `srijandev.in`, add/verify the following records:

   | Type | Name | Target / Host | Proxy Status |
   | :--- | :--- | :--- | :--- |
   | **CNAME** | `@` | `<your-cloudflare-pages-url>.pages.dev` | 🟠 Proxied |
   | **CNAME** | `www` | `<your-cloudflare-pages-url>.pages.dev` | 🟠 Proxied |
   | **CNAME** | `api` | `srijandev-backend.onrender.com` | 🟠 Proxied |

2. **SSL/TLS Encryption Mode**:
   - Navigate to **SSL/TLS** -> **Overview** in Cloudflare.
   - Set encryption mode to **Full (Strict)**.

3. **WebSocket Proxy Settings**:
   - Navigate to **Network** settings in Cloudflare.
   - Ensure **WebSockets** toggle is **ON** (allows transparent proxying of HTTP `Upgrade` and `Connection` headers).

---

## 🧪 Step 4: Verification & Handover

### 1. Health Probe Verification
```bash
curl -i https://api.srijandev.in/health
# Expected HTTP 200 OK: {"status":"ok","timestamp":"..."}
```

### 2. Live Telemetry WebSocket Test
```javascript
const ws = new WebSocket('wss://api.srijandev.in/ws');
ws.onopen = () => console.log('Connected to live tracking telemetry!');
ws.onmessage = (e) => console.log('Telemetry payload received:', e.data);
```

### 3. Frontend Dashboard Validation
- Open `https://srijandev.in` in your browser.
- Verify sub-second load performance and seamless API connectivity to `https://api.srijandev.in`.
