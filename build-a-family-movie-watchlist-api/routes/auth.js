import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "node:fs";

try {
  process.loadEnvFile();
} catch {}

const router = Router();

const users = JSON.parse(
  fs.readFileSync(new URL("../data/users.json", import.meta.url), "utf8"),
);

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const valid = await bcrypt.compare(String(password), user.passwordHash);

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.status(200).json({ token });
});

export default router;