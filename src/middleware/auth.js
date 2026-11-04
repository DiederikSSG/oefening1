const { sessions, users } = require("../db");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token || !sessions[token]) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  const user = users.find((u) => u.id === sessions[token]);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized. Invalid session." });
  }

  req.user = user;
  req.token = token;
  next();
}

module.exports = { requireAuth };
