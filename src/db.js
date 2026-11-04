/**
 * In-memory database. All data lives in these variables and resets on restart.
 */

const users = [
  {
    id: "user-1",
    username: "alice",
    email: "alice@example.com",
    password: "alice123",
  },
  {
    id: "user-2",
    username: "bob",
    email: "bob@example.com",
    password: "bob123",
  },
  {
    id: "user-3",
    username: "carol",
    email: "carol@example.com",
    password: "carol123",
  },
];

const products = [
  {
    id: "prod-1",
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones",
    price: 99.99,
  },
  {
    id: "prod-2",
    name: "USB-C Hub",
    description: "7-in-1 multiport adapter",
    price: 49.99,
  },
  {
    id: "prod-3",
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard",
    price: 129.99,
  },
];

/** @type {Record<string, Array<{ productId: string, quantity: number }>>} */
const carts = {
  "user-1": [{ productId: "prod-1", quantity: 1 }],
  "user-2": [
    { productId: "prod-2", quantity: 2 },
    { productId: "prod-3", quantity: 1 },
  ],
  "user-3": [],
};

/** @type {Record<string, string>} token -> userId */
const sessions = {};

module.exports = {
  users,
  products,
  carts,
  sessions,
};
