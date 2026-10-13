# India Data Dashboard 🇮🇳

Interactive single-page socio-economic & education intelligence dashboard for India, built with **HTML5, Tailwind CSS, Vanilla JavaScript, Leaflet.js (OpenStreetMap), and Google AI Studio Gemini API**.

Designed specifically as a 100% serverless static web application for free hosting on **GitHub Pages** with custom domain binding.

---

## 🌟 Modules Implemented

### 1. Layout & Core UI Shell (Module 1)
- Sleek dark theme using Tailwind CSS.
- Real-time indicator ticker with national totals (1.48M+ schools, 2.65 Cr annual admissions, 77.7% literacy, 268.4 crime index).
- 6 Key Performance Indicator (KPI) metric cards updating dynamically with regional filters.
- Responsive navigation switching between Dashboard, Leaflet Map, Analytics, and Data Matrix.

### 2. Socio-Economic JSON Dataset (Module 2)
- Structured dataset covering all **28 States and 8 Union Territories** (`src/data/indiaSocioEconomicData.js`).
- Key metrics:
  - Crime Rate (per 1 Lakh population from NCRB)
  - Total Recognized Schools (Govt + Private from UDISE+)
  - Annual Fresh Admissions (in Lakhs)
  - Schools Closed / Merged (under rationalization)
  - Overall Literacy Rate (%) & Female Literacy Rate (%)
  - Pupil-Teacher Ratio (PTR)
  - Secondary School Dropout Rate (%)
  - Representative district hubs for major states (e.g. Mumbai, Pune, Lucknow, Bengaluru Urban, Patna, etc.).

### 3. Leaflet.js Interactive India Map (Module 3)
- Rendered using Leaflet.js with Dark CartoDB / OpenStreetMap tile layers.
- Dynamic circle markers with proportional radius and choropleth color ramp based on the selected metric.
- Interactive hover tooltips displaying state name, capital, and active metric values.
- Smooth click-to-fly zoom with automatic district marker clustering and state inspector panel updates.

### 4. Dynamic Data Tables & Chart Visualizations (Module 4)
- Chart.js integration:
  - **Chart 1:** Annual Admissions vs Schools Closed by State.
  - **Chart 2:** Crime Rate vs Literacy Rate Correlation.
- State Leaderboards: Top 5 in Literacy, Highest Admissions Capacity, and Safest States.
- Sortable, searchable table with 1-click CSV export functionality.

### 5. Google AI Studio Gemini API Integration (Module 5)
- Direct client-side `fetch` calls to Google Gemini API (`gemini-2.5-flash`).
- In-browser safe API key storage in `localStorage`.
- Built-in capabilities:
  - **1-Click State AI Briefing:** Comprehensive policy synthesis for any selected state.
  - **School Closures Anomaly Detection:** Pinpoints divergence between closures and student enrollments.
  - **Natural Language Query Assistant:** Ask questions like *"Which state has the lowest PTR?"* or *"Analyze crime vs literacy in Kerala"*.
  - **Built-in Offline Intelligence Engine:** Delivers data-grounded policy briefings even without an API key!

---

## 🚀 Module 6: GitHub Pages Deployment & Custom Domain Setup

### Step 1: Push Project to GitHub
1. Create a new repository on [GitHub](https://github.com) named `india-data-dashboard` (Public).
2. Push your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: India Data Dashboard"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/india-data-dashboard.git
   git push -u origin main
   ```

### Step 2: Build Static Files (if using Vite build) or Host Directly
Run:
```bash
npm run build
```
This produces a production-ready static `dist` folder.

### Step 3: Enable GitHub Pages
1. Go to your GitHub repository -> **Settings** -> **Pages**.
2. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select `main` (or `gh-pages`) and folder `/dist` or `/root` -> Click **Save**.
3. Within 1-2 minutes, your dashboard will be live at:
   `https://<YOUR-USERNAME>.github.io/india-data-dashboard/`

### Step 4: Configure Your Custom Paid Domain (e.g., `indiadata.org` or `indiastats.com`)
1. In GitHub repository **Settings** -> **Pages**:
   - In the **Custom domain** field, enter your purchased domain: `indiadata.org` (or `dashboard.indiadata.org`).
   - Click **Save**. GitHub will create a `CNAME` file in your repository.
2. Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, Google Domains):
   - **For Apex Domain (`indiadata.org`):** Add 4 `A` records pointing to GitHub Pages IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **For Subdomain (`www` or `dashboard`):** Add a `CNAME` record pointing to:
     - `<YOUR-USERNAME>.github.io`
3. Back in GitHub Settings -> Pages, check **Enforce HTTPS** (free SSL certificate provisioned by Let's Encrypt automatically).