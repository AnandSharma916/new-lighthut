# LightHut — Luxury Architectural Lighting Catalog & Admin CMS

LightHut is a modern full-stack web application designed for luxury architectural luminaires, designer chandeliers, wall sconces, magnetic track lighting, and bespoke lighting fixtures.

---

## 🌟 Key Architecture & Features

### 1. Public Storefront
- **Dynamic Homepage:** Hero marquee, luxury slide showcase, curated categories, featured luminaires, architectural portfolio projects, and customer review sections.
- **Interactive Lighting Catalog:** High-density catalog grid with real-time text search, category taxonomy filtering, price tags, and quick inquiry modals.
- **Product Specification PDP:** Rich 15-attribute engineering spec sheets (Wattage, Voltage, CCT, Lumens, Beam Angle, IP Rating, Finish, Dimensions, Materials, Photometrics).
- **Project Quotation Form:** Direct inquiry and trade quote request forms with instant dispatch.

### 2. Administrative Management Console (`/admin`)
- **Executive Dashboard:** Live metrics counter for active luminaires, collections, and new client inquiries.
- **Product Catalog Manager:** Full CRUD with image uploader, instant publish/draft toggles, luminaire duplication, and search.
- **Categories Manager:** Add, reorder, edit, and categorize lighting typologies with cover imagery.
- **Homepage CMS:** Live editor for hero banners, headlines, subheadlines, badges, and CTA buttons.
- **Media Asset Library:** Drag-and-drop cloud/local file uploader with one-click URL copying.
- **Client Inquiries CRM:** Centralized lead management with status workflows (`new` ➔ `contacted` ➔ `resolved`).
- **Global Settings:** Modify brand metadata, telephone, WhatsApp business link, address, GST number, and default SEO tags.

---

## 🚀 Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Framer Motion, React Router v6
- **Backend:** Node.js, Express.js, Mongoose (MongoDB), Multer, JWT, bcryptjs, Helmet, CORS
- **Database:** MongoDB Atlas (Cloud) / Embedded In-Memory fallback for local development

---

## 🛠️ Quick Start Locally

### 1. Clone the Repository
```bash
git clone https://github.com/AnandSharma916/new-lighthut.git
cd new-lighthut
```

### 2. Install Dependencies
```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 3. Configure Environment
Copy `server/.env.example` to `server/.env` and update your `MONGODB_URI`.

### 4. Run Development Servers
```bash
# Terminal 1: Backend API (Port 5000)
cd server && npm run dev

# Terminal 2: Frontend Client (Port 3000)
cd client && npm run dev
```

### 5. Admin Access
- **URL:** `http://localhost:3000/admin/login`
- **Email:** `admin@lighthut.com`
- **Password:** `admin123456`

---

## 🌐 Production Deployment Guide

### Deploying Backend (Render / Railway / VPS)
1. Set Root Directory to `server`.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Environment Variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=<Your MongoDB Atlas connection string>`
   - `JWT_SECRET=<Secure JWT Secret>`
   - `CLIENT_URL=<Your live frontend URL>`

### Deploying Frontend (Vercel)
1. Set Root Directory to `client`.
2. Framework: `Vite`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Connect your GoDaddy custom domain in Vercel settings.
