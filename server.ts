import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import Database from "better-sqlite3";

dotenv.config();

const db = new Database("mjnexus.db");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'client',
    balance REAL DEFAULT 0,
    referral_code TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referrer_id INTEGER,
    referred_id INTEGER,
    reward_amount REAL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id),
    FOREIGN KEY (referred_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- SEO Routes ---
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: https://mjnexus.com/sitemap.xml");
  });

  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://mjnexus.com/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>
  <url><loc>https://mjnexus.com/betting</loc><priority>0.9</priority></url>
  <url><loc>https://mjnexus.com/marketplace</loc><priority>0.9</priority></url>
  <url><loc>https://mjnexus.com/logistics</loc><priority>0.8</priority></url>
  <url><loc>https://mjnexus.com/servisecur</loc><priority>0.8</priority></url>
  <url><loc>https://mjnexus.com/trading</loc><priority>0.7</priority></url>
</urlset>`;
    res.send(sitemap);
  });

  // --- Auth & Referral System ---

  // Bootstrap default admin
  try {
    const adminEmail = "joellmikamm@gmail.com";
    const existingAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
    if (!existingAdmin) {
      const adminReferralCode = "ADMIN001";
      db.prepare(`
        INSERT INTO users (username, email, password, balance, referral_code, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run("admin", adminEmail, "admin123", 1000000, adminReferralCode, "admin");
      console.log("Default admin created: admin / admin123");
    }
  } catch (e) {
    console.error("Error bootstrapping admin:", e);
  }

  app.post("/api/auth/signup", (req, res) => {
    const { username, email, password, referralCode, role } = req.body;

    try {
      // Generate a unique referral code for the new user
      const newUserReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const insertUser = db.prepare(`
        INSERT INTO users (username, email, password, balance, referral_code, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const initialBalance = 0;
      const userRole = role || 'client';
      const result = insertUser.run(username, email, password, initialBalance, newUserReferralCode, userRole);
      const userId = result.lastInsertRowid;

      let rewardMessage = "";

      // Handle referral if code provided
      if (referralCode) {
        const referrer = db.prepare("SELECT id FROM users WHERE referral_code = ?").get(referralCode) as any;
        
        if (referrer) {
          const rewardAmount = 500; // 500 units reward
          
          // Record the referral
          db.prepare(`
            INSERT INTO referrals (referrer_id, referred_id, reward_amount)
            VALUES (?, ?, ?)
          `).run(referrer.id, userId, rewardAmount);

          // Update referrer balance
          db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(rewardAmount, referrer.id);
          
          // Optional: Give reward to the new user too
          const welcomeBonus = 200;
          db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(welcomeBonus, userId);
          
          rewardMessage = `Referral successful! You received a ${welcomeBonus} welcome bonus.`;
        }
      }

      res.json({
        status: "success",
        message: "User created successfully. " + rewardMessage,
        user: {
          id: userId,
          username,
          email,
          role: userRole,
          referralCode: newUserReferralCode,
          balance: referralCode ? 200 : 0
        }
      });
    } catch (error: any) {
      console.error("Signup Error:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // Allow login by email OR username (which is the phone number in our case)
    const user = db.prepare("SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?").get(email, email, password) as any;

    if (user) {
      res.json({
        status: "success",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          balance: user.balance,
          referralCode: user.referral_code
        }
      });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  });

  app.get("/api/user/referral-info/:userId", (req, res) => {
    const { userId } = req.params;
    
    try {
      const user = db.prepare("SELECT referral_code FROM users WHERE id = ?").get(userId) as any;
      if (!user) return res.status(404).json({ status: "error", message: "User not found" });

      const referrals = db.prepare(`
        SELECT r.*, u.username as referred_username 
        FROM referrals r
        JOIN users u ON r.referred_id = u.id
        WHERE r.referrer_id = ?
      `).all(userId) as any[];

      const totalRewards = referrals.reduce((sum, r) => sum + r.reward_amount, 0);

      res.json({
        status: "success",
        referralCode: user.referral_code,
        referralsCount: referrals.length,
        totalRewards,
        referrals
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  // --- Mobile Money API Endpoints (Simulated) ---
  app.post("/api/payments/momo/collect", async (req, res) => {
    res.json({ status: "success", message: "Contactez-nous sur WhatsApp pour finaliser le paiement." });
  });

  app.post("/api/payments/momo/payout", async (req, res) => {
    res.json({ status: "success", message: "Contactez-nous sur WhatsApp pour finaliser le retrait." });
  });

  app.post("/api/payments/webhook", (req, res) => {
    res.status(200).send("OK");
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`MJ NEXUS Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

export const appPromise = startServer();
