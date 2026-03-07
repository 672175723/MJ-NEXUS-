import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import axios from "axios";
import Stripe from "stripe";
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

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- Auth & Referral System ---

  app.post("/api/auth/signup", (req, res) => {
    const { username, email, password, referralCode } = req.body;

    try {
      // Generate a unique referral code for the new user
      const newUserReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const insertUser = db.prepare(`
        INSERT INTO users (username, email, password, balance, referral_code)
        VALUES (?, ?, ?, ?, ?)
      `);

      const initialBalance = 0;
      const result = insertUser.run(username, email, password, initialBalance, newUserReferralCode);
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
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;

    if (user) {
      res.json({
        status: "success",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
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

  // --- International Payment Gateway (Stripe) ---

  app.post("/api/payments/stripe/create-checkout-session", async (req, res) => {
    const { amount, currency, paymentMethodTypes, successUrl, cancelUrl } = req.body;

    if (!stripe) {
      return res.status(500).json({ 
        status: "error", 
        message: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables." 
      });
    }

    try {
      // Calculate fees for transparency (simulated)
      const processingFeePercent = 0.029; // 2.9%
      const fixedFee = 0.30; // $0.30
      const internationalFeePercent = 0.01; // 1% for international
      const conversionFeePercent = 0.01; // 1% for conversion

      const totalFees = (amount * (processingFeePercent + internationalFeePercent + conversionFeePercent)) + fixedFee;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: paymentMethodTypes || ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: 'MJ WorldBet Deposit',
                description: `Deposit for MJ WorldBet account. Includes international transaction fees.`,
              },
              unit_amount: Math.round(amount * 100), // Stripe expects cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl || `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${req.headers.origin}/payment-cancel`,
        metadata: {
          amount: amount.toString(),
          currency: currency,
          fees: totalFees.toFixed(2),
        }
      });

      res.json({ 
        status: "success", 
        id: session.id, 
        url: session.url,
        fees: {
          processing: (amount * processingFeePercent).toFixed(2),
          international: (amount * internationalFeePercent).toFixed(2),
          conversion: (amount * conversionFeePercent).toFixed(2),
          fixed: fixedFee.toFixed(2),
          total: totalFees.toFixed(2)
        }
      });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  // --- Mobile Money API Endpoints ---

  // 1. Initiate Payment (Collect money from user)
  app.post("/api/payments/momo/collect", async (req, res) => {
    const { amount, phoneNumber, country, currency, email, name } = req.body;

    try {
      // This is where you would call an aggregator like Flutterwave
      // Example for Flutterwave:
      /*
      const response = await axios.post('https://api.flutterwave.com/v3/charges?type=mobile_money_ghana', {
        amount,
        currency,
        phone_number: phoneNumber,
        email,
        tx_ref: `momo-${Date.now()}`,
        // ... other params
      }, {
        headers: { Authorization: `Bearer ${process.env.PAYMENT_PROVIDER_SECRET_KEY}` }
      });
      */

      console.log(`[MoMo] Initiating collection of ${amount} ${currency} from ${phoneNumber} (${country})`);
      console.log(`[MoMo] Target Official Accounts: UBA(14011000529), MTN(+237699932926), OM(+237672175723)`);
      
      // Simulate successful initiation
      res.json({
        status: "success",
        message: "Payment initiated. Please check your phone for the USSD prompt.",
        transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        provider: "MJ-Aggregator"
      });
    } catch (error) {
      console.error("MoMo Collection Error:", error);
      res.status(500).json({ status: "error", message: "Failed to initiate payment" });
    }
  });

  // 2. Send Money (Payout to user/winner)
  app.post("/api/payments/momo/payout", async (req, res) => {
    const { amount, phoneNumber, country, currency, bankCode } = req.body;

    try {
      console.log(`[MoMo] Initiating payout of ${amount} ${currency} to ${phoneNumber} (${country})`);
      
      // Simulate successful payout
      res.json({
        status: "success",
        message: "Payout processed successfully.",
        transferId: `TR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
    } catch (error) {
      console.error("MoMo Payout Error:", error);
      res.status(500).json({ status: "error", message: "Failed to process payout" });
    }
  });

  // 3. Webhook for Payment Confirmation
  app.post("/api/payments/webhook", (req, res) => {
    const signature = req.headers["x-mj-signature"];
    // Verify signature...
    
    const event = req.body;
    console.log("[Webhook] Received payment event:", event);
    
    // Update user balance in DB...
    
    res.status(200).send("OK");
  });

  // --- Vite Middleware for Development ---
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MJ NEXUS Server running on http://localhost:${PORT}`);
  });
}

startServer();
