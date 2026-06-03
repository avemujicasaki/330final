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
- Client state persisted in **localStorage** (demo mode)

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

> **Note:** The frontend UI still uses localStorage for demo persistence. The Django API is implemented and can be tested with curl or Postman; wiring the React app to the API is a future integration step.

## Run frontend and backend together

Use two terminals:

| Terminal | Command | URL |
|----------|---------|-----|
| 1 | `cd frontend && npm run dev` | http://localhost:5173 |
| 2 | `cd backend && python3 manage.py runserver 8000` | http://127.0.0.1:8000/api/ |

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
| Persistence (UI demo) | Browser localStorage |
| Persistence (API) | `backend/db.sqlite3` |

## Frontend project structure

```text
frontend/src/
├── pages/           # Home, Plans, CookDetail, Cart, Confirm, Login, …
├── components/      # Nav, Footer, PaymentForm, OrderModal, Toast, …
├── context/         # AppContext (cart, user, subscriptions, orders)
├── hooks/           # useRouter.js
├── data/            # data.js, images.js (seed content for the UI)
├── storage.js       # localStorage helpers
└── utils/           # payment validation
```
