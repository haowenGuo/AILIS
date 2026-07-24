# AILIS User System Launch Plan

This document defines the production user, membership, payment, and API-access system for AILIS.
Do not store API keys, Stripe secrets, webhook secrets, or customer payment details in this file.

## Product Boundary

AILIS has two layers:

- Open-source client/runtime: public download and source access.
- Cloud membership service: account login, paid membership, model API access, and TTS API access.

The frontend can be static, but the following must live on the backend:

- User identity and sessions
- Password hashing and secret pepper
- Stripe Checkout Session creation
- Stripe webhook verification
- Membership status updates
- Model API and TTS API access checks
- Usage logging, quota checks, and abuse controls

## Current Backend Surface

Implemented endpoints:

- `GET /api/account/status`
- `GET /api/account/me`
- `POST /api/account/register`
- `POST /api/account/login`
- `POST /api/account/logout`
- `GET /api/admin/users`
- `GET /api/admin/users/{user_id}`
- `GET /api/admin/users/{user_id}/payments`
- `PATCH /api/admin/users/{user_id}/membership`
- `POST /api/admin/users/{user_id}/membership/revoke`
- `GET /api/stripe/config`
- `POST /api/stripe/checkout-session`
- `POST /api/stripe/customer-portal`
- `GET /api/stripe/session-status`
- `POST /api/stripe/webhook`

Protected member APIs:

- `POST /api/chat`
- `POST /api/chat/tts`
- `POST /api/chat/text`

Current membership logic:

- New accounts start as `free`.
- `payment` Checkout mode grants a time-limited membership controlled by `APP_ONE_TIME_MEMBERSHIP_DAYS`.
- `subscription` Checkout mode grants active subscription membership.
- Stripe webhooks keep subscription status in sync after checkout.
- Customer Portal lets logged-in users manage their Stripe subscription and payment method.
- API usage is recorded monthly for model and TTS calls.

## Required Production Features

### Identity

- Email/password registration and login.
- Password hashing with `APP_PASSWORD_PEPPER`.
- Login session expiration with `APP_SESSION_TTL_DAYS`.
- `GET /api/account/me` for frontend account state.
- Future: email verification, password reset, OAuth login, and session device management.

### Membership

- Store `membership_status`, `membership_plan`, and `membership_expires_at`.
- Store Stripe customer ID per user.
- Store every Checkout Session and subscription update.
- Gate model/TTS APIs through backend membership checks.
- Future: customer self-service billing portal, plan upgrades/downgrades, refunds, coupons, trials.

### API Entitlements

- Free accounts can log in but cannot call paid model/TTS endpoints when `APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS=true`.
- Paid accounts can call model/TTS endpoints.
- Future: usage ledger per user, monthly quotas, rate limits, abuse flags, and admin overrides.

### Admin Operations

Minimum admin console/API before public launch:

- Search users by email.
- View user membership status and Stripe customer ID.
- Manually revoke/grant membership for support cases.
- View recent payments and webhook events.
- Re-send or reconcile Stripe subscription state.
- Disable abusive accounts.

Current admin API access is controlled by `APP_ADMIN_EMAILS`.
Register/login with one of those emails before calling `/api/admin/*`.

### Security

- Never put `STRIPE_SECRET_KEY`, model keys, or TTS keys in frontend code.
- Use HTTPS-only production domains.
- Set `CORS_ALLOW_ORIGINS` to exact frontend origins, not `*`.
- Rotate any secret that has been pasted into chat or logs.
- Separate test and live Stripe keys/prices/webhooks.
- Keep `STRIPE_WEBHOOK_SECRET` configured in Render.
- Log high-level event IDs, not raw card/payment data.

### Data

- Production database: Render Postgres.
- Local/demo database: SQLite is acceptable.
- Before public launch, add migrations instead of relying only on `Base.metadata.create_all`.
- Enable automated Postgres backups and test restore once.

## Render Deployment Variables

Set these on the Render backend service:

```text
APP_SESSION_COOKIE_NAME=ailis_session
APP_SESSION_TTL_DAYS=30
APP_SESSION_COOKIE_SECURE=true
APP_SESSION_COOKIE_SAMESITE=lax
APP_SESSION_COOKIE_DOMAIN=
APP_PASSWORD_PEPPER=<generated long random value>
APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS=true
APP_ONE_TIME_MEMBERSHIP_DAYS=30
APP_ADMIN_EMAILS=owner@example.com,support@example.com
APP_MONTHLY_MODEL_CALL_LIMIT=300
APP_MONTHLY_TTS_CALL_LIMIT=100

CORS_ALLOW_ORIGINS=https://your-frontend-domain.example
DATABASE_URL=<Render Postgres connection string>
CHROMA_PERSIST_DIR=/opt/render/project/src/backend/data/chroma

LLM_API_BASE=<model provider base URL>
LLM_API_KEY=<secret>
LLM_MODEL_NAME=<model name>

ELEVENLABS_API_KEY=<secret>
ELEVENLABS_VOICE_ID=<voice id>

STRIPE_API_VERSION=2026-05-27.dahlia
STRIPE_PUBLISHABLE_KEY=<pk_live_or_pk_test>
STRIPE_SECRET_KEY=<sk_live_or_sk_test>
STRIPE_PAYMENT_PRICE_ID=<one-time membership price>
STRIPE_SUBSCRIPTION_PRICE_ID=<monthly membership price>
STRIPE_RETURN_URL=https://your-frontend-domain.example/about-ailis.html?payment=return&session_id={CHECKOUT_SESSION_ID}
STRIPE_CUSTOMER_PORTAL_RETURN_URL=https://your-frontend-domain.example/about-ailis.html
STRIPE_AUTOMATIC_TAX_ENABLED=false
STRIPE_WEBHOOK_SECRET=<whsec_...>
```

Stripe webhook endpoint:

```text
https://your-render-backend-domain.example/api/stripe/webhook
```

Recommended webhook events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Launch Checklist

- Render backend runs against Postgres, not SQLite.
- Frontend points to the production backend URL.
- `CORS_ALLOW_ORIGINS` includes only the production frontend domain.
- Account sessions use `HttpOnly` cookies.
- For best cookie reliability, put frontend and backend under the same site, for example `ailis.example` and `api.ailis.example`.
- If frontend and backend remain cross-site, use `APP_SESSION_COOKIE_SAMESITE=none` and `APP_SESSION_COOKIE_SECURE=true`, then add CSRF protection before public launch.
- Stripe live prices are created and configured.
- Stripe live webhook is configured and verified.
- Model/TTS keys are set only on Render.
- Free account receives `402` on paid APIs.
- Paid test account receives access to model/TTS APIs.
- Logged-in Stripe customer can open the Customer Portal.
- Admin email listed in `APP_ADMIN_EMAILS` can list users and adjust membership.
- Admin/support path exists for user lookup and membership reconciliation.
- Database backup and restore have been tested.
