# CoachShare Backend (Django + SQLite)

REST API aligned with the CoachShare frontend: cooks, weekly plans, auth, subscriptions, meal orders, and cook applications.

## Run the server

From the repo root:

```bash
cd backend
```

**First-time setup:**

```bash
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py seed_data
python3 manage.py runserver 8000
```

**Later runs** (skip install/migrate/seed unless you reset the database):

```bash
python3 manage.py runserver 8000
```

- API: http://127.0.0.1:8000/api/
- Admin: http://127.0.0.1:8000/admin/ (run `python3 manage.py createsuperuser` first)

## Verify

```bash
curl http://127.0.0.1:8000/api/plans/
```

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu","password":"demo"}'
```

Use the returned `token` in later requests:

```text
Authorization: Token <token>
```

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register/` | No | `{email, password, name?}` → token + user |
| POST | `/api/auth/login/` | No | `{email, password}` → token + user |
| GET | `/api/me/` | Token | Current user |
| GET | `/api/cooks/` | No | List cooks |
| GET | `/api/cooks/<id>/` | No | Cook detail (menu + reviews) |
| GET | `/api/plans/` | No | Weekly plans |
| GET | `/api/plans/<id>/` | No | Single plan |
| GET/POST | `/api/subscriptions/` | Token | List / create subscription |
| POST | `/api/subscriptions/<sub_id>/action/` | Token | `{action: "skip" \| "cancel"}` — e.g. `sub-1` |
| GET/POST | `/api/orders/` | Token | Meal orders |
| POST | `/api/cook-applications/` | Optional | Submit cook application |

JSON field names match the frontend (`planId`, `cookName`, `mealsPerWeek`, etc.).

## Reset database

```bash
rm db.sqlite3
python3 manage.py migrate
python3 manage.py seed_data
```
