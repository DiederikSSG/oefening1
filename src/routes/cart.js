const express = require("express");
const { carts, products } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function buildCartResponse(userId) {
  const items = carts[userId] || [];
  const detailed = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      name: product ? product.name : "Unknown",
      unitPrice: product ? product.price : 0,
      quantity: item.quantity,
      lineTotal: product ? Number((product.price * item.quantity).toFixed(2)) : 0,
    };
  });

  const subtotal = Number(
    detailed.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2)
  );

  return { items: detailed, subtotal };
}

router.get("/cart", requireAuth, (req, res) => {
  return res.status(200).json(buildCartResponse(req.user.id));
});

router.post("/cart", requireAuth, (req, res) => {
  const { productId, quantity } = req.body || {};

  if (!productId || quantity === undefined) {
    return res
      .status(400)
      .json({ error: "productId and quantity are required" });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: "quantity must be a positive integer" });
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (!carts[req.user.id]) {
    carts[req.user.id] = [];
  }

  const existing = carts[req.user.id].find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    carts[req.user.id].push({ productId, quantity: qty });
  }

  return res.status(200).json(buildCartResponse(req.user.id));
});

module.exports = router;
