import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import axios from "axios";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

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
