const express = require("express");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");
const docsRoutes = require("./routes/docs");
const { products } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "E-commerce Checkout API",
    version: "1.0.0",
    docs: "/docs",
    swaggerYaml: "/swagger.yaml",
  });
});

app.get("/products", (_req, res) => {
  res.json(products);
});

app.use(authRoutes);
app.use(cartRoutes);
app.use(checkoutRoutes);
app.use(docsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`E-commerce Checkout API running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/docs`);
  console.log(`Swagger YAML: http://localhost:${PORT}/swagger.yaml`);
});

module.exports = app;
