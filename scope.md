# Majestic Sports — Project Scope

## 1. Concept Overview

**Majestic Sports** is a premium badminton accessories e-commerce **showcase** website.
It is NOT a transactional site — there is no cart, checkout, or payment gateway.
The purpose is to display products beautifully and drive purchase inquiries directly via WhatsApp.

### Core Goals
- Showcase badminton products (rackets, shoes, bags, shuttlecocks, accessories)
- Allow visitors to contact / buy via WhatsApp
- Let users subscribe for updates (Google Auth + WhatsApp number capture)
- Give the admin full control via a secure dashboard (add/edit/delete products & categories)
- Broadcast WhatsApp messages to all subscribers from the admin panel
- All product data syncs in real-time between admin and public site

---

## 2. Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Frontend         | React (Vite) + HTML + CSS + JS      |
| Authentication   | Firebase Auth (Google Sign-In)      |
| Database         | Firebase Firestore (real-time)      |
| Image Storage    | Cloudinary                          |
| Hosting          | Cloudflare Pages                    |
| Fonts            | Archivo Narrow + Inter (Google)     |
| Routing          | React Router DOM                    |

---

## 3. Credentials & Configuration

### Firebase
```js
const firebaseConfig = {
  apiKey: "AIzaSyChCSViSCgCKA7ykASLjOKEJhrdxY7NU4w",
  authDomain: "majestic1-879ea.firebaseapp.com",
  projectId: "majestic1-879ea",
  storageBucket: "majestic1-879ea.firebasestorage.app",
  messagingSenderId: "1070926167777",
  appId: "1:1070926167777:web:4b882ddef06d2282f581a0"
};
```

### Admin
```
Admin UID : 1uXFRjwJkFfX1PO7HXbRbTCl4Om2
```

### Cloudinary
```
Cloud Name    : dath9ga29
Upload Preset : majestic1
Upload URL    : https://api.cloudinary.com/v1_1/dath9ga29/image/upload
```

---

## 4. Design System (from DESIGN.md)

### Colors
```css
--primary:            #000000;   /* Elite Navy/Black — headings, primary buttons */
--secondary:          #0050cc;   /* Performance Blue — CTA, action buttons */
--secondary-bright:   #0266ff;   /* Hover state for secondary */
--background:         #f8f9fa;   /* Pro White — page background */
--surface:            #ffffff;   /* Card background */
--surface-container:  #edeeef;   /* Gray container / section bg */
--on-surface:         #191c1d;   /* Primary text */
--on-surface-variant: #44474d;   /* Secondary text / labels */
--outline:            #75777e;   /* Borders, dividers */
--outline-variant:    #c5c6cd;   /* Subtle dividers */
--error:              #ba1a1a;   /* Error states only */
```

### Typography
```
Headings / Buttons : Archivo Narrow (700, condensed, uppercase for buttons)
Body / Labels      : Inter (400–600, generous line-height)

Display   : Archivo Narrow 48px / 700 / lh 1.1 / ls -0.02em
H1        : Archivo Narrow 32px / 700 / lh 1.2
H2        : Archivo Narrow 24px / 600 / lh 1.3
H3        : Archivo Narrow 20px / 600 / lh 1.4
Body LG   : Inter 18px / 400 / lh 1.6
Body MD   : Inter 16px / 400 / lh 1.5
Body SM   : Inter 14px / 400 / lh 1.5
Button    : Archivo Narrow 16px / 600 / UPPERCASE / ls 0.02em
```

### Spacing (8pt rhythm)
```
xs: 8px | sm: 16px | md: 24px | lg: 48px | xl: 80px
Gutter: 24px | Mobile margin: 16px | Desktop margin: 64px
```

### Border Radius
```
Buttons / Inputs / Cards : 4px
Section containers       : max 8px
Pills / Tags             : 9999px
```

### Shadows
```
Default cards  : none
Card hover     : 0px 4px 20px rgba(10, 25, 47, 0.05)
Modals / Float : 0px 4px 20px rgba(10, 25, 47, 0.05)
NO blur/glow effects
```

### Grid
```
Desktop 1440px+ : 12-col, 1120px max-width, 24px gutters, 64px margins
Tablet 768-1024 : 8-col, fluid, 24px margins
Mobile <768px   : 4-col, fluid, 16px margins
```

---

## 5. Firestore Data Model

```
firestore/
├── users/
│   └── {uid}/
│       ├── name          : string
│       ├── email         : string
│       ├── whatsappNo    : string
│       ├── photoURL      : string
│       └── subscribedAt  : timestamp
│
├── categories/
│   └── {categoryId}/
│       ├── name          : string   (e.g. "Rackets")
│       ├── slug          : string   (e.g. "rackets")
│       └── createdAt     : timestamp
│
└── products/
    └── {productId}/
        ├── name          : string
        ├── description   : string
        ├── price         : number
        ├── brand         : string
        ├── categoryId    : string
        ├── categoryName  : string
        ├── imageURL      : string   (Cloudinary URL)
        ├── cloudinaryId  : string
        ├── isNew         : boolean
        └── createdAt     : timestamp
```

---

## 6. Firebase Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null &&
             request.auth.uid == "1uXFRjwJkFfX1PO7HXbRbTCl4Om2";
    }

    function isOwner(uid) {
      return request.auth != null && request.auth.uid == uid;
    }

    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /users/{uid} {
      allow read, write: if isOwner(uid);
      allow read: if isAdmin();
    }
  }
}
```

---

## 7. Site Routes

| Route    | Page               | Access             |
|----------|--------------------|---------------------|
| `/`      | Home               | Everyone            |
| `/shop`  | Shop (with filters)| Everyone            |
| `/admin` | Admin Dashboard    | Admin UID only      |

---

## 8. Pages & Sections Breakdown

### Public Site — Home (`/`)
1. Navbar — Logo, nav links, Sign In button
2. Hero — Headline, tagline, WhatsApp CTA + Shop Now
3. Featured Products — Top 8 products (real-time)
4. About Us — Brand story, mission
5. Contact — WhatsApp, phone, email, address
6. Footer — Logo, links, socials, copyright

### Shop Page (`/shop`)
- Category Tabs (top): All, Rackets, Shuttlecocks, Shoes, Bags, Accessories
- Left Sidebar: Brand checkboxes, Price slider, New Arrivals toggle
- Product Area: Sort By dropdown, Grid/List toggle, Product cards

### Admin Dashboard (`/admin`)
- Auth guard (redirect if not admin UID)
- Sidebar: Categories | Products | Subscribers | Broadcast
- Categories panel: List + Add + Edit + Delete
- Products panel: List + Add (Cloudinary upload) + Edit + Delete
- Subscribers panel: Table of all users + WhatsApp numbers
- Broadcast panel: Message box + progress + wa.me opener

---

## 9. WhatsApp Broadcast Flow

```
Admin types message
    → clicks "Start Broadcast"
    → fetch all users with whatsappNo from Firestore
    → build wa.me links array
    → show first subscriber: name + number
    → "Open Chat" → window.open(wa.me link)
    → "Next →" → currentIndex++
    → progress: "3 / 24"
    → repeat until done
    → show "Broadcast Complete!"
```

---

## 10. File Structure

```
/majestic sports/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   └── ContactSection.jsx
│   │   ├── shop/
│   │   │   ├── CategoryTabs.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ViewToggle.jsx
│   │   ├── auth/
│   │   │   ├── SubscribeModal.jsx
│   │   │   └── AuthButton.jsx
│   │   └── admin/
│   │       ├── AdminSidebar.jsx
│   │       ├── CategoriesPanel.jsx
│   │       ├── ProductsPanel.jsx
│   │       ├── SubscribersPanel.jsx
│   │       └── BroadcastPanel.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   └── Admin.jsx
│   ├── firebase/
│   │   └── config.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useProducts.js
│   │   ├── useCategories.js
│   │   └── useSubscribers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 11. Build Phases

> Rule: Each phase = UI first (static/hardcoded) then wire JS/Firebase.
> Do NOT start next phase until current phase is complete and verified.

---

### PHASE 1 — Project Setup
**Goal:** Working React + Vite app with design system CSS

Steps:
1. Scaffold Vite + React project in `/majestic sports/`
2. Install: react-router-dom, firebase
3. Set up `index.css` with all CSS variables from DESIGN.md
4. Import Google Fonts (Archivo Narrow + Inter) in `index.html`
5. Create `src/firebase/config.js` with all credentials
6. Set up `App.jsx` with React Router (3 routes)

Deliverable: Blank app with routes and design tokens ready

---

### PHASE 2 — Navbar & Footer UI + JS
**Goal:** Pixel-perfect Navbar and Footer, fully interactive

UI Steps:
1. Build Navbar.jsx — Logo left, nav links center, Sign In button right
2. Sticky navbar on scroll (CSS position: sticky)
3. Mobile hamburger menu
4. Build Footer.jsx — Logo, nav links, social icons, copyright

JS Steps:
1. useState for mobile menu open/close
2. Active link highlight via useLocation()
3. Sign In button placeholder onClick

Deliverable: Sticky navbar with hamburger + footer on all pages

---

### PHASE 3 — Home Page UI + JS
**Goal:** Full Home page with all sections

UI Steps:
1. Hero.jsx — Full-width, headline, tagline, two CTA buttons
2. FeaturedProducts.jsx — 8 hardcoded product cards, 4-col grid
3. ProductCard.jsx — image, brand chip, name, price, Buy Now button
4. AboutSection.jsx — two-column layout, text + image
5. ContactSection.jsx — WhatsApp link, phone, email, address
6. Assemble in Home.jsx
/
JS Steps:
1. Shop Now → navigate('/shop')
2. Buy Now → window.open('https://wa.me/91XXXXXXXXXX', '_blank')
3. Contact WhatsApp → window.open(waLink, '_blank')

Deliverable: Fully styled, clickable Home page with static data

---

### PHASE 4 — Shop Page UI + JS
**Goal:** Complete Shop page with working filters on static data

UI Steps:
1. CategoryTabs.jsx — horizontal scrollable pill tabs
2. FilterSidebar.jsx — brand checkboxes, price slider, new arrivals toggle
3. ProductGrid.jsx — 3-col grid of ProductCards
4. ProductList.jsx — full-width row list layout
5. ViewToggle.jsx — Grid/List icon buttons
6. Sort By dropdown
7. Assemble in Shop.jsx

JS Steps:
1. Category tab → useState activeCategory, filter products
2. Brand checkbox → useState selectedBrands[], filter
3. Price slider → useState [min, max], filter by range
4. New Arrivals → useState boolean, filter by isNew
5. View toggle → useState 'grid'|'list'
6. Sort dropdown → useState, sort array
7. useMemo → combined filtered + sorted product list

Deliverable: Fully interactive Shop with filters on hardcoded data

---

### PHASE 5 — Auth UI + Firebase Auth
**Goal:** Google Sign-In working, WhatsApp capture to Firestore

UI Steps:
1. AuthButton.jsx — Sign In button / signed-in user avatar dropdown
2. SubscribeModal.jsx — step 1: Google Sign-In, step 2: WhatsApp input, step 3: Success
3. Subscribe button in Hero and Footer
4. User dropdown — name, avatar, Sign Out

JS Steps:
1. AuthContext.jsx — onAuthStateChanged listener, provide user context
2. signInWithPopup(GoogleAuthProvider) → sign in
3. signOut() → sign out
4. On sign-in → check if Firestore user doc exists
5. If no whatsappNo → show modal step 2
6. setDoc users/{uid} — save name, email, photoURL, whatsappNo, subscribedAt
7. Admin check: user.uid === ADMIN_UID → show Dashboard link in navbar

Deliverable: Google Auth working, user data saved to Firestore

---

### PHASE 6 — Admin Dashboard UI + Auth Guard
**Goal:** Full Admin Dashboard layout, UI panels, protected route

UI Steps:
1. Admin.jsx — full-page dashboard with left sidebar
2. AdminSidebar.jsx — nav: Categories, Products, Subscribers, Broadcast, Logout
3. CategoriesPanel.jsx — table, Add form, inline edit mode
4. ProductsPanel.jsx — table with thumbnail, Add/Edit form with image upload area
5. SubscribersPanel.jsx — table: avatar, name, email, WhatsApp, date
6. BroadcastPanel.jsx — textarea, count badge, Start button, progress tracker, complete screen

JS Steps:
1. Admin.jsx useEffect — if not auth OR uid !== ADMIN_UID → navigate('/')
2. Sidebar tab → useState activePanel

Deliverable: Full admin UI visible, protected by UID guard

---

### PHASE 7 — Categories & Products Firebase CRUD
**Goal:** Admin CRUD works; public site shows real Firestore data

JS Steps:
1. useCategories.js hook:
   - onSnapshot → real-time categories list
   - addCategory(name) → addDoc
   - updateCategory(id, name) → updateDoc
   - deleteCategory(id) → deleteDoc
2. Wire CategoriesPanel to hook

3. useProducts.js hook:
   - onSnapshot → real-time products list
   - addProduct(data, imageFile):
     - POST image to Cloudinary upload URL
     - Get imageURL + cloudinaryId back
     - addDoc to Firestore with full data
   - updateProduct(id, data, newImageFile?):
     - If new image → upload to Cloudinary, delete old via Cloudinary API
     - updateDoc Firestore
   - deleteProduct(id, cloudinaryId):
     - DELETE from Cloudinary
     - deleteDoc from Firestore
4. Wire ProductsPanel to hook
5. Replace hardcoded data in Home.jsx with useProducts hook
6. Replace hardcoded data in Shop.jsx with useProducts + useCategories hooks

Deliverable: Full CRUD working; public site shows live data

---

### PHASE 8 — Shop Page Real-Time Filters
**Goal:** All Shop filters work on live Firestore data

JS Steps:
1. Shop.jsx uses useProducts() and useCategories()
2. Category tabs built dynamically from categories collection
3. Brand list extracted dynamically from products
4. Price slider max = max price in products list
5. All filter/sort logic (Phase 4) runs on real data
6. Loading skeleton shown while data loads

Deliverable: Shop page fully dynamic and real-time

---

### PHASE 9 — Subscribers Panel & Broadcast Feature
**Goal:** View all subscribers, run WhatsApp broadcast

JS Steps:
1. useSubscribers.js hook:
   - getDocs from users collection
   - Return sorted subscriber list
2. Wire SubscribersPanel to show real data

3. BroadcastPanel JS:
   - Fetch subscribers with whatsappNo
   - Build wa.me URLs: https://wa.me/{number}?text={encodedMessage}
   - useState array + currentIndex
   - "Open Chat" → window.open(waLinks[currentIndex], '_blank')
   - "Next →" → setCurrentIndex(i => i + 1)
   - currentIndex >= total → show complete screen

Deliverable: Broadcast feature fully functional

---

### PHASE 10 — Polish, Responsive & Deploy
**Goal:** Production-ready, deployed on Cloudflare Pages

Steps:
1. Mobile audit — test 375px, 768px, 1440px
2. Fix layout breaks (sidebar collapse, admin drawer)
3. Page transition animations (CSS fade on route change)
4. Loading skeletons for product grids
5. Toast notifications for admin actions (success/error)
6. Empty states (no products, no subscribers)
7. SEO — title + meta description per page
8. npm run build → generate dist/
9. Deploy dist/ to Cloudflare Pages
10. Verify all features on live URL

Deliverable: Live Majestic Sports site on Cloudflare Pages

---

## 12. Phase Summary

| Phase | Focus                          | Key Output                             |
|-------|--------------------------------|----------------------------------------|
| 1     | Project Setup                  | Vite+React app, CSS design tokens      |
| 2     | Navbar + Footer                | Sticky nav, mobile menu, routing       |
| 3     | Home Page                      | All sections, WhatsApp links working   |
| 4     | Shop Page                      | Filters working on static data         |
| 5     | Auth + Subscribe               | Google sign-in, WhatsApp to Firestore  |
| 6     | Admin Dashboard                | Full UI, protected by UID guard        |
| 7     | Categories + Products CRUD     | Real data, Cloudinary image uploads    |
| 8     | Shop Real-Time Filters         | Dynamic from Firestore                 |
| 9     | Subscribers + Broadcast        | View users, wa.me broadcast            |
| 10    | Polish + Deploy                | Live on Cloudflare Pages               |

---

 