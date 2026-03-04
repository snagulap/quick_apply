# QuickApply Server — Stripe Payment Backend

## Setup in 5 minutes

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Open .env and fill in your Stripe keys
```

### 3. Create Stripe Products & Prices
Go to https://dashboard.stripe.com/products and create:

| Product  | Monthly Price | Annual Price |
|----------|---------------|--------------|
| Starter  | $7.99/mo      | $4.99/mo (billed $59.88/yr) |
| Pro      | $14.99/mo     | $8.99/mo (billed $107.88/yr) |
| Ultra    | $29.99/mo     | $17.99/mo (billed $215.88/yr) |

Copy each Price ID (starts with `price_`) into your `.env` file.

### 4. Set your Extension ID in CORS
After loading the extension in Chrome, copy the ID from chrome://extensions
and put it in `.env` as:
```
FRONTEND_URL=chrome-extension://abcdefghijklmnopabcdefghijklmnop
```

### 5. Set up Stripe Webhook (for production)
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/webhook
# Copy the webhook secret into .env as STRIPE_WEBHOOK_SECRET
```

### 6. Run the server
```bash
npm start           # production
npm run dev         # development (auto-reload)
```

## Deploy to Production

### Render.com (free tier available)
1. Push to GitHub
2. Create new Web Service on render.com
3. Set environment variables in Render dashboard
4. Update FRONTEND_URL with your extension's Chrome ID

### Railway.app
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### VPS (DigitalOcean / AWS)
```bash
# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name quickapply-server
pm2 startup && pm2 save
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/create-subscription | Create Stripe subscription |
| POST | /api/cancel-subscription | Cancel at period end |
| POST | /api/get-subscription | Check active subscription |
| POST | /api/create-portal-session | Open Stripe billing portal |
| POST | /webhook | Stripe webhook handler |
| GET  | /health | Server health check |

## Update Extension with Server URL
After deploying, update `SERVER_URL` in `popup/popup.js`:
```js
const SERVER_URL = 'https://your-server.onrender.com';
```
