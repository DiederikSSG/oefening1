const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { carts, products } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const CASH_DISCOUNT_RATE = 0.1;
const VALID_PAYMENT_METHODS = ["cash", "creditcard"];

router.post("/checkout", requireAuth, (req, res) => {
  const { paymentMethod } = req.body || {};

  if (!paymentMethod) {
    return res.status(400).json({ error: "paymentMethod is required" });
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({
      error: 'paymentMethod must be "cash" or "creditcard"',
    });
  }

  const cartItems = carts[req.user.id] || [];
  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const items = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const unitPrice = product ? product.price : 0;
    return {
      productId: item.productId,
      name: product ? product.name : "Unknown",
      unitPrice,
      quantity: item.quantity,
      lineTotal: Number((unitPrice * item.quantity).toFixed(2)),
    };
  });

  const subtotal = Number(
    items.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2)
  );

  const discountRate = paymentMethod === "cash" ? CASH_DISCOUNT_RATE : 0;
  const discount = Number((subtotal * discountRate).toFixed(2));
  const total = Number((subtotal - discount).toFixed(2));

  carts[req.user.id] = [];

  return res.status(200).json({
    orderId: `order-${uuidv4()}`,
    paymentMethod,
    items,
    subtotal,
    discount,
    discountPercent: discountRate * 100,
    total,
    message:
      paymentMethod === "cash"
        ? "Checkout successful. 10% cash discount applied."
        : "Checkout successful. No discount for credit card payments.",
  });
});

module.exports = router;
