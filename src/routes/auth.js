const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { users, carts, sessions } = require("../db");

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username, email and password are required" });
  }

  const exists = users.some(
    (u) => u.username === username || u.email === email
  );
  if (exists) {
    return res
      .status(409)
      .json({ error: "User with this username or email already exists" });
  }

  const user = {
    id: `user-${uuidv4()}`,
    username,
    email,
    password,
  };

  users.push(user);
  carts[user.id] = [];

  return res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = uuidv4();
  sessions[token] = user.id;

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

module.exports = router;
