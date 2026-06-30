# ecom-user — Next.js frontend (TypeScript + Tailwind)

This repository is the Next.js frontend for the ecom-user project. It implements a customer-facing ecommerce UI (landing, product listing, product detail) and a secure server-side proxy pattern for protected endpoints (orders, cart, profile) using an HttpOnly cookie for authentication.

Quick status
- Branch: feat/products-listing contains the landing, product listing, product details, auth proxy, and a sample protected endpoint (my-orders).
- Auth test credentials (staging): phone = `0130000001`, OTP = `1234` (used only for development/testing).

Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS for styling
- React Query (TanStack) for client-side data fetching
- Zod for runtime validation of API responses
- react-hook-form + zodResolver for forms
- Native fetch (credentials: 'include') for network calls

Key architecture notes (useful for indexing and automation)
- Public API base (client-side): NEXT_PUBLIC_API_BASE (default: `https://ecommerce.bdboibazer.com/api/v1`)
- Server proxy base (server-side): API_BASE (default: `https://ecommerce.bdboibazer.com/api/v1`)
- Authentication flow:
  - POST /api/auth/login (Next.js server API) proxies credentials to Laravel /customer-login
  - On success the server extracts the token and sets an HttpOnly cookie named `ecom_token` (HttpOnly, Secure in production, SameSite=lax)
  - Protected client requests call Next.js proxy routes under `/api/proxy/*` which read the `ecom_token` cookie server-side and forward requests to the Laravel API with the header `Authorization: Bearer <token>`

Files and important locations for indexing
- Zod schemas (primary source-of-truth for response shapes):
  - `src/features/products/schemas.ts` — Product and ProductList schemas
  - `src/features/banner/banner.api.ts` — Banner schemas & helpers
- API helpers:
  - `src/lib/api/axiosClient.ts` — fetchJson helper (centralized fetch wrapper with credentials: 'include')
  - `src/features/products/product.api.ts` — product fetching functions (getProducts, getProductById)
- Server proxy helper:
  - `src/pages/api/_proxy.ts` — generic createProxyHandler used by proxy routes
  - `pages/api/proxy/my-orders.ts` — example protected proxy route
- Pages:
  - `app/page.tsx` — landing page (banners, featured, new arrivals; ISR = 60s)
  - `app/products/page.tsx` — product listing (client-side, React Query)
  - `app/products/[id]/page.tsx` — product detail (server component)
  - `app/auth/login/page.tsx` — phone + OTP login UI (includes "Use test creds" button for staging)

How to run locally
1. Clone and checkout the feature branch:
   git clone https://github.com/fuedevs/ecom-user.git
   cd ecom-user
   git checkout feat/products-listing

2. Create `.env.local` file with the following (defaults):

```
API_BASE=https://ecommerce.bdboibazer.com/api/v1
NEXT_PUBLIC_API_BASE=https://ecommerce.bdboibazer.com/api/v1
NODE_ENV=development
```

3. Install & run:
```
npm install
npm run dev
```

4. Open pages:
- Landing: http://localhost:3000/
- Login: http://localhost:3000/auth/login (Use the "Use test creds" to autofill staging creds)
- Products: http://localhost:3000/products
- Product detail: http://localhost:3000/products/<id>

Notes for automated indexing (AI / tooling)
- The Zod schemas are the best single source for generating API contracts. Tools or bots that index the repo should prioritize `src/features/**/schemas.ts` to infer types and shapes.
- If you want a machine-readable OpenAPI spec, consider one of these approaches:
  - Generate OpenAPI from the Laravel backend (recommended). Then commit the OpenAPI JSON/YAML into `/openapi` so tooling can ingest it directly.
  - Use a zod-to-openapi converter in this frontend (for client-side expected shapes) and commit the generated spec.
  - Add a `docs/openapi.json` or `docs/postman_collection.json` to the repo as a canonical contract.
- For search/indexing, include a short index file (e.g., `PROJECT_INDEX.md`) mapping features → entrypoints. This repository already includes `PROJECT_INDEX.md`.

Security and best-practices notes
- The token is stored only in an HttpOnly cookie (`ecom_token`). The frontend never reads it directly.
- Protected requests must be routed through Next.js proxy endpoints which attach `Authorization: Bearer <token>` server-side.
- The proxy clears the cookie if the backend returns 401/403, and forwards the backend status and message to the client.

Next steps I can take for you
- Finalize Zod schemas and product UI using live API responses (I have the staging test creds: phone=0130000001, otp=1234)
- Implement cart and checkout proxy endpoints and frontend flows (Add-to-cart, cart page, checkout page)
- Generate a committed OpenAPI spec (from Laravel or synthesized from Zod) so any AI or tool can index a single canonical contract.

If you want, I can generate an OpenAPI JSON from the live backend and commit it to `docs/openapi.json` so indexing and codegen are trivial for downstream tools. Reply `generate openapi` and I will fetch the API responses, synthesize the most important endpoints into OpenAPI, and push the file to the branch.
