# StreetWear Web Application

## Quick Start (Run in VS Code)

Open this `Web app 2` folder in VS Code, then choose **Terminal > New Terminal**.

```powershell
npm.cmd run dev
```

Open the Local URL printed in the terminal (normally `http://localhost:3000` or `http://localhost:5173`).
Keep the terminal running while using the app. Press `Ctrl+C` to stop it.

You can also press `F5` in VS Code and select **Run StreetWear (Vite)**.

---

## Authentication & Features

### 1. Ready-to-use Local Mode (Default)
The app now operates seamlessly out of the box without needing an external Supabase server:
- **Sign Up**: You can register any new account with your username, email, and password (at least 6 characters).
- **Log In**: You can log in with any newly created account, or use the pre-configured demo account:
  - **Email**: `demo@streetwear.com`
  - **Password**: `password123`
  - *Tip: Click the "Use Demo Account" button on the login screen to auto-fill these credentials.*
- **Session Persistence**: Login state is saved in `localStorage`, so refreshing the page maintains your login session.
- **Product Catalog**: Automatically loads the complete 12-item streetwear collection with prices, categories, and stock numbers.
- **Cart & Checkout**: Adding to cart, changing quantities, removing items, and placing orders persist locally.
- **Contact Form**: Submitting the contact form gives immediate feedback and saves inquiries locally.

---

### 2. Optional: Connecting a Live Supabase Backend
If you want to connect your own live Supabase project:

1. Copy `WEB APP E- COMMERCE/.env.example` to `WEB APP E- COMMERCE/.env.local`.
2. Add your active Supabase URL and public publishable/anon key:
   ```env
   VITE_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ACTUAL_ANON_KEY
   ```
3. Restart the dev server (`Ctrl+C` then `npm.cmd run dev`).

When a custom Supabase URL is present, the app automatically connects to Supabase Auth. If the network or remote server is unreachable, it automatically falls back to local mode so you are never locked out.
