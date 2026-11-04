const express = require("express");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const router = express.Router();
const swaggerPath = path.join(__dirname, "..", "..", "swagger.yaml");

function loadSwaggerDoc() {
  const raw = fs.readFileSync(swaggerPath, "utf8");
  return yaml.load(raw);
}

router.get("/swagger.yaml", (_req, res) => {
  res.type("text/yaml");
  res.sendFile(swaggerPath);
});

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "/swagger.yaml",
    },
    customSiteTitle: "E-commerce Checkout API Docs",
  })
);

// Eager-load once so startup fails fast if YAML is invalid
loadSwaggerDoc();

module.exports = router;
