# Google OAuth Setup Guide

## Getting Real Google OAuth Credentials

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Create Project**
3. Enter project name: `Headless Blog` (or your preferred name)
4. Click **Create**

### Step 2: Enable Google OAuth API

1. In Google Cloud Console, navigate to **APIs & Services** > **Enabled APIs & services**
2. Click **+ ENABLE APIS AND SERVICES**
3. Search for **Google+ API** or **Google Identity**
4. Click **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. If prompted, click **CONFIGURE CONSENT SCREEN** first:
   - Choose **External** for User Type
   - Fill in required fields (App name, User support email, Developer contact)
   - Click **Save and Continue**
4. Back to OAuth client ID creation:
   - Application type: **Web application**
   - Name: `Headless Blog Local`
   - Add **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click **Create**

### Step 4: Copy Your Credentials

1. You'll see your credentials displayed:
   - **Client ID**: Copy this
   - **Client Secret**: Copy this
2. Click the download icon to save a JSON file as backup

### Step 5: Update `.env.local`

Replace the placeholder values in `.env.local`:

```env
# Real credentials from Google Cloud Console
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE
NEXTAUTH_SECRET=my-super-secret-key-for-development-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=file:./dev.db

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 6: Restart Development Server

```bash
npm run dev
```

Now Google OAuth should work correctly!

---

## Troubleshooting

### "Error 401: invalid_client"
- Verify Client ID and Secret are copied correctly
- Check that redirect URI is exactly `http://localhost:3000/api/auth/callback/google`
- Restart the development server after updating `.env.local`

### "The OAuth client was not found"
- Make sure you enabled the Google+ API
- Check the Google Cloud Console for any error messages
- Verify the credentials are active (not deleted)

### Testing Without OAuth (Development Only)

If you want to skip OAuth temporarily, edit `/app/components/GoogleLogin.tsx` to use local testing:

```typescript
// For testing only - remove in production
const handleClick = async () => {
  // Store test session
  localStorage.setItem('test-session', JSON.stringify({
    user: { name: 'Test User', email: 'test@example.com' }
  }));
  router.push('/admin');
};
```
