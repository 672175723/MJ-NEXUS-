# Deploying MJ NEXUS to Vercel

This project is a full-stack application using **Express** and **SQLite**. 

## Important: SQLite Limitation on Vercel
Vercel's filesystem is **read-only** and ephemeral. This means:
1.  The `mjnexus.db` file will be reset every time the serverless function restarts.
2.  Data will **NOT** persist across sessions.

**Recommendation:** For production, replace SQLite with a remote database like **Supabase (PostgreSQL)**, **MongoDB Atlas**, or **PlanetScale**.

## Deployment Steps

1.  **Build Command:** `npm run build`
2.  **Output Directory:** `dist`
3.  **Install Command:** `npm install`
4.  **Environment Variables:**
    *   `STRIPE_SECRET_KEY`: Your Stripe secret key.
    *   `GEMINI_API_KEY`: Your Google Gemini API key.
    *   `VERCEL`: Set to `true` (Vercel sets this automatically).

## How to add a Custom Domain (e.g., mjnexus.com)
1.  Go to your project dashboard on [Vercel](https://vercel.com).
2.  Navigate to **Settings** > **Domains**.
3.  Enter your domain name (e.g., `mjnexus.com`) and click **Add**.
4.  Vercel will provide you with **DNS records** (A record or CNAME).
5.  Log in to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains).
6.  Update your DNS settings with the values provided by Vercel.
7.  Wait for propagation (usually 5-30 minutes).

## Vercel Configuration (`vercel.json`)
The project includes a `vercel.json` that routes `/api/*` to the Express server.

## Local Testing
Run `npm run dev` to start the development environment.
