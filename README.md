# CoachShare

Campus peer-to-peer weekly meal plans: students subscribe to a cook’s weekly plan or order individual meals for pickup.

## Repository layout

```text
330final/
├── frontend/          # React + Vite SPA
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
└── backend/           # Django + SQLite REST API
    ├── api/
    ├── manage.py
    └── requirements.txt
```

## Run the frontend

Requires **Node.js 20.19+** or **22.12+**.

```bash
cd frontend
nvm use 20          # optional, if you use nvm
npm install
npm run dev
```

Open **http://localhost:5173/**

Production build:

```bash
cd frontend
npm run build
npm run preview     # serves the built app (default http://localhost:4173)
```

### Frontend features

- Browse and filter weekly meal plans
- Cook profiles with weekly menu, reviews, and pickup schedule
- Weekly subscription checkout (login required)
- Cart and one-time meal orders
- My Orders: active subscriptions (skip / cancel) and meal order history
- Become a Student Cook application form
- Static pages: Guidelines, Safety, Terms, Support
- Login, catalog, subscriptions, and orders via **Django API**; cart/pending plan in localStorage

## Run the backend

Requires **Python 3.9+** and pip.

**First time** (install deps, create DB, load sample cooks/plans):

```bash
cd backend
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py seed_data
python3 manage.py runserver 8000
```

**Every time after that** (DB already exists):

```bash
cd backend
python3 manage.py runserver 8000
```

API base URL: **http://127.0.0.1:8000/api/**

Admin (optional): **http://127.0.0.1:8000/admin/** — create a superuser with `python3 manage.py createsuperuser`

Quick check that the server is up:

```bash
curl http://127.0.0.1:8000/api/plans/
```

Register / login example:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@university.edu","password":"demo","name":"Alex"}'
```

Authenticated requests use header: `Authorization: Token <your-token>`

Full endpoint list: [backend/README.md](backend/README.md)

The React app calls the Django API via Vite dev proxy (`/api` → port 8000). **Cart** and **pending plan** stay in localStorage; **login, subscriptions, orders, and catalog** use the API.

## Run frontend and backend together

Use two terminals (frontend will not load plans without the backend):

| Terminal | Command | URL |
|----------|---------|-----|
| 1 | `cd backend && python3 manage.py runserver 8000` | http://127.0.0.1:8000/api/ |
| 2 | `cd frontend && npm run dev` | http://localhost:5173 |

### Automated UI smoke test (optional)

With both servers running:

```bash
cd frontend
npx playwright install chromium   # first time only
npm run test:e2e
```

## Page flow

```text
Home (/)
  └── Find My Weekly Plan → Plans (/plans)

Plans
  ├── Filter chips
  ├── Plan card → Cook Detail (/cook/:id)
  └── Apply to Cook → Become a Cook (/become-cook)

Cook Detail
  ├── Order + → Cart
  └── Reserve Weekly Plan → Confirm (/confirm, login required)

Confirm → Success (/success/:id)
Cart → Cart Checkout (/cart/checkout) → Order Success (/order-success/:id)
```

## Data model

```text
Cook (1) ── has many ── MenuItem, Review, WeeklyPlan
User (1) ── has many ── Subscription, MealOrder, CookApplication
```

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, Vite, lucide-react, custom CSS, History API routing (`useRouter`) |
| Backend | Django 4, Django REST Framework, SQLite, Token auth, django-cors-headers |
| Persistence | API + SQLite (`db.sqlite3`); cart/pending plan in localStorage |

## Frontend project structure

```text
frontend/src/
├── pages/           # Home, Plans, CookDetail, Cart, Confirm, Login, …
├── components/      # Nav, Footer, PaymentForm, OrderModal, Toast, …
├── context/         # AppContext (cart, user, subscriptions, orders)
├── hooks/           # useRouter.js
├── api.js           # HTTP client for Django API
├── data/            # filters, static pages
├── storage.js       # token, cart, pending plan
└── utils/           # payment validation
```
