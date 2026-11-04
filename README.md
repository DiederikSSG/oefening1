# E-commerce Checkout API

## What is this API

A small Express-based REST API for e-commerce checkout. It exposes four core endpoints — **register**, **login**, **cart**, and **checkout** — plus product listing and Swagger documentation. Data is stored in memory (JavaScript variables), so everything resets when the server restarts.

## How to install

Requirements: Node.js 18+ and npm.

```bash
npm install
```

## How to run

```bash
npm start
```

The server listens on `http://localhost:3000` by default (override with the `PORT` environment variable).

For development with auto-reload:

```bash
npm run dev
```

### Quick smoke test

```bash
# Login as Alice
curl -s -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"username\":\"alice\",\"password\":\"alice123\"}"

# Use the returned token for cart / checkout
curl -s http://localhost:3000/cart -H "Authorization: Bearer <TOKEN>"

curl -s -X POST http://localhost:3000/checkout -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d "{\"paymentMethod\":\"cash\"}"
```

## Test data

### Users

| Username | Password  | Email             | Pre-filled cart                                      |
|----------|-----------|-------------------|------------------------------------------------------|
| alice    | alice123  | alice@example.com | 1× Wireless Headphones (`prod-1`)                    |
| bob      | bob123    | bob@example.com   | 2× USB-C Hub (`prod-2`), 1× Mechanical Keyboard (`prod-3`) |
| carol    | carol123  | carol@example.com | Empty                                                |

### Products

| ID     | Name                 | Price  |
|--------|----------------------|--------|
| prod-1 | Wireless Headphones  | 99.99  |
| prod-2 | USB-C Hub            | 49.99  |
| prod-3 | Mechanical Keyboard  | 129.99 |

## Business rules

1. **Authentication** — `/cart` and `/checkout` require a Bearer token from `/login`.
2. **Checkout payment discount**
   - `cash` → **10% discount** on the cart subtotal
   - `creditcard` → **no discount**
3. **Empty cart** — checkout is rejected if the cart has no items.
4. **Cart cleared** — after a successful checkout, the user's cart is emptied.
5. **In-memory storage** — users, products, carts, and sessions live in process memory and are lost on restart.

## Important URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000/ | API info |
| http://localhost:3000/docs | Swagger UI (renders the OpenAPI YAML) |
| http://localhost:3000/swagger.yaml | Raw OpenAPI YAML specification |
| http://localhost:3000/products | List products |
| http://localhost:3000/register | `POST` — register a new user |
| http://localhost:3000/login | `POST` — login and get a token |
| http://localhost:3000/cart | `GET` / `POST` — view or update cart (auth) |
| http://localhost:3000/checkout | `POST` — checkout with `cash` or `creditcard` (auth) |
