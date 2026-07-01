# SFACL Jalthal — User Panel
## sfacljalthal.com.np | React + Vite + Tailwind CSS

Full public-facing website for Shree Falaam Agro Cooperative Limited, Jalthal.

---

## Project Structure
```
user_panel/
├── src/
│   ├── api/config.js             # All API calls to backend
│   ├── components/
│   │   ├── Header.jsx             # Top bar, logo, navigation, mobile menu
│   │   ├── Footer.jsx             # Contact, social, copyright
│   │   ├── HeroSlider.jsx         # Auto-play hero slider
│   │   ├── NoticeBoard.jsx        # Latest 5 notices (dynamic)
│   │   ├── BlogsSection.jsx       # Latest news/blogs cards (dynamic)
│   │   └── CalendarModule.jsx     # Event calendar with dots
│   ├── pages/
│   │   ├── HomePage.jsx           # Full home with all sections
│   │   ├── AboutPage.jsx          # Mission, Vision, Objectives
│   │   ├── NoticesPage.jsx        # Notice list + single post
│   │   ├── BlogsPage.jsx          # Blog list + single post
│   │   ├── GalleryPage.jsx        # Gallery + lightbox + filter
│   │   ├── DairyPage.jsx          # Dairy description + products
│   │   ├── FinancialPage.jsx      # Deposits, loans, documents
│   │   ├── ContactPage.jsx        # Form, address, map
│   │   └── LoginPage.jsx          # Member login
│   ├── utils/dateUtils.js
│   ├── App.jsx                    # All routes
│   ├── main.jsx
│   └── index.css                  # Tailwind + custom styles
├── index.html
├── tailwind.config.js
├── vite.config.js
└── .env.example
```

---

## Setup

### 1. Install
```bash
npm install
```

### 2. Configure .env
```bash
cp .env.example .env
# Set: VITE_API_URL=http://localhost:5000/api
```

### 3. Run Dev
```bash
npm run dev   # http://localhost:3000
```

### 4. Build Production
```bash
npm run build   # output in /dist
```

---

## Routes

| Route | Content |
|-------|---------|
| `/` | Home (slider, notices, calendar, blogs) |
| `/about` | About, Mission, Vision, Objectives |
| `/notices` | Notice list (dynamic) |
| `/notices/:id` | Single notice post |
| `/blogs` | News/blogs list (dynamic) |
| `/blogs/:id` | Single blog post |
| `/gallery` | Photo gallery (dynamic) |
| `/dairy` | Dairy industry + product catalog |
| `/financial` | Deposits, loans, documents |
| `/contact` | Contact form + map |
| `/login` | Member login |

---

## Backend API Endpoints Used

```
GET  /api/getnoticepagination?limit=5&page=1
GET  /api/getnotice?id=<id>
GET  /api/getallpressrelease?limit=5&page=1
GET  /api/getpressrelease?id=<id>
GET  /api/gallery
GET  /api/geteventpagination?limit=50&page=1
POST /api/auth/login
GET  /api/getgalleryimage/<filename>
```

---

## Deployment (Nginx)

```nginx
server {
    listen 80;
    server_name sfacljalthal.com.np www.sfacljalthal.com.np;
    root /var/www/sfacljalthal/dist;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    location /api { proxy_pass http://localhost:5000; }
}
```

---

## Customization

- **Static content** (dairy products, loan rates, deposits): Edit respective page files
- **Contact details**: Update Header.jsx, Footer.jsx, ContactPage.jsx
- **Social media links**: Search facebook.com in Header/Footer
- **Google Map**: Replace iframe src in ContactPage.jsx
- **Logo/Organization name**: Update Header.jsx and Footer.jsx
