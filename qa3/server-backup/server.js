
'use strict';
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const stripe     = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Stripe Price ID map ────────────────────────────────────────────────────
const PRICES = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    annual:  process.env.STRIPE_PRICE_STARTER_ANNUAL,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  ultra: {
    monthly: process.env.STRIPE_PRICE_ULTRA_MONTHLY,
    annual:  process.env.STRIPE_PRICE_ULTRA_ANNUAL,
  },
};

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    // Allow Chrome extensions and your domain
    const allowed = [
      process.env.FRONTEND_URL,   // chrome-extension://YOUR_ID
      'http://localhost:3000',
      'https://yourdomain.com',   // swap for your real domain
    ];
    if (!origin || allowed.some(o => origin.startsWith(o))) {
      cb(null, true);
    } else {
      cb(new Error('CORS blocked: ' + origin));
    }
  },
  credentials: true,
}));

// ── Webhook MUST come before express.json() ────────────────────────────────
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send('Webhook Error: ' + err.message);
  }

  console.log('Webhook received:', event.type);

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub  = event.data.object;
      const meta = sub.metadata || {};
      console.log('Subscription active:', meta.extensionUserId, sub.status);
      // TODO: Update your database here
      // e.g. db.users.update({ extensionId: meta.extensionUserId }, { plan: meta.plan, active: true })
      break;
    }
    case 'customer.subscription.deleted': {
      const sub  = event.data.object;
      const meta = sub.metadata || {};
      console.log('Subscription cancelled:', meta.extensionUserId);
      // TODO: Downgrade user to free plan in your database
      break;
    }
    case 'invoice.payment_failed': {
      const inv  = event.data.object;
      console.log('Payment failed for customer:', inv.customer);
      // TODO: Notify user, retry logic
      break;
    }
    case 'invoice.payment_succeeded': {
      const inv  = event.data.object;
      console.log('Payment succeeded:', inv.amount_paid / 100, inv.currency);
      break;
    }
  }

  res.json({ received: true });
});

// ── JSON body parsing (after webhook route) ────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Rate limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── POST /api/create-subscription ─────────────────────────────────────────
// Called when user clicks "Pay Now" in the extension popup
// Body: { paymentMethodId, plan, billing, email, name, extensionUserId }
app.post('/api/create-subscription', async (req, res) => {
  const { paymentMethodId, plan, billing, email, name, extensionUserId } = req.body;

  // Validate
  if (!paymentMethodId || !plan || !billing || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!['starter','pro','ultra'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan.' });
  }
  if (!['monthly','annual'].includes(billing)) {
    return res.status(400).json({ error: 'Invalid billing period.' });
  }

  const priceId = PRICES[plan][billing];
  if (!priceId) {
    return res.status(500).json({ error: 'Price not configured for this plan.' });
  }

  try {
    // 1. Create or retrieve Stripe customer
    const existingList = await stripe.customers.list({ email, limit: 1 });
    let customer;
    if (existingList.data.length > 0) {
      customer = existingList.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        metadata: { extensionUserId: extensionUserId || '' },
      });
    }

    // 2. Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });

    // 3. Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // 4. Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        plan,
        billing,
        extensionUserId: extensionUserId || '',
      },
    });

    const invoice       = subscription.latest_invoice;
    const paymentIntent = invoice.payment_intent;

    // 5. Return result to extension
    if (subscription.status === 'active') {
      // Payment succeeded immediately (e.g. free trial or already paid)
      res.json({
        success:        true,
        subscriptionId: subscription.id,
        customerId:     customer.id,
        plan,
        billing,
        status:         'active',
      });
    } else if (paymentIntent && paymentIntent.status === 'requires_action') {
      // 3D Secure required — send client_secret back for confirmation
      res.json({
        requiresAction:  true,
        clientSecret:    paymentIntent.client_secret,
        subscriptionId:  subscription.id,
        customerId:      customer.id,
        plan,
        billing,
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      res.json({
        success:        true,
        subscriptionId: subscription.id,
        customerId:     customer.id,
        plan,
        billing,
        status:         'active',
      });
    } else {
      res.status(400).json({
        error:  'Payment failed.',
        status: subscription.status,
        piStatus: paymentIntent ? paymentIntent.status : 'unknown',
      });
    }
  } catch (err) {
    console.error('create-subscription error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/cancel-subscription ─────────────────────────────────────────
// Body: { subscriptionId }
app.post('/api/cancel-subscription', async (req, res) => {
  const { subscriptionId } = req.body;
  if (!subscriptionId) return res.status(400).json({ error: 'Missing subscriptionId.' });
  try {
    // Cancel at period end (user keeps access until billing cycle ends)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    res.json({ success: true, cancelAt: subscription.cancel_at });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/get-subscription ─────────────────────────────────────────────
// Body: { email }  — check active subscription status
app.post('/api/get-subscription', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email.' });
  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (!customers.data.length) return res.json({ plan: 'free', active: false });

    const customer = customers.data[0];
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });
    if (!subs.data.length) return res.json({ plan: 'free', active: false });

    const sub  = subs.data[0];
    const meta = sub.metadata || {};
    res.json({
      plan:           meta.plan || 'pro',
      billing:        meta.billing || 'monthly',
      active:         true,
      subscriptionId: sub.id,
      currentPeriodEnd: sub.current_period_end,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/create-portal-session ───────────────────────────────────────
// Opens Stripe Customer Portal for managing billing / cancellation
// Body: { email, returnUrl }
app.post('/api/create-portal-session', async (req, res) => {
  const { email, returnUrl } = req.body;
  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (!customers.data.length) return res.status(404).json({ error: 'Customer not found.' });

    const session = await stripe.billingPortal.sessions.create({
      customer:   customers.data[0].id,
      return_url: returnUrl || 'https://yourdomain.com',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`QuickApply server running on port ${PORT}`);
  console.log(`Stripe mode: ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'LIVE' : 'TEST'}`);
});
