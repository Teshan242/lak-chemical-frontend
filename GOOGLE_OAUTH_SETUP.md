# Google OAuth Setup Instructions

## Steps to Enable Google Login

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: Lak Chemical & Hardware
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: Lak Chemical Hardware Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:8080`
   - Authorized redirect URIs:
     - `http://localhost:5173`
     - `http://localhost:8080/api/auth/google`
7. Copy the **Client ID** that is generated

### 2. Update Frontend Configuration

Open `frontend/src/pages/LoginPage.tsx` and replace:

```typescript
client_id: 'YOUR_GOOGLE_CLIENT_ID'
```

With your actual Google Client ID:

```typescript
client_id: '1234567890-abc123def456.apps.googleusercontent.com'
```

### 3. Update Backend Configuration

Open `src/main/resources/application.properties` (or `application.yml`) and add:

```properties
google.oauth.client-id=YOUR_GOOGLE_CLIENT_ID
google.oauth.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

### 4. Test the Login Flow

1. Start the backend server (port 8080)
2. Start the frontend dev server (port 5173)
3. Navigate to http://localhost:5173/login
4. Click the Google Sign-In button
5. Complete the Google authentication
6. You should be redirected to the homepage as a logged-in user

## Security Notes

- Never commit your Client ID or Client Secret to version control
- Use environment variables for production deployments
- Add your production domain to authorized origins before deploying

## Troubleshooting

**Issue: "popup_closed_by_user" error**
- Solution: Make sure popup blockers are disabled for localhost

**Issue: "redirect_uri_mismatch" error**  
- Solution: Verify that http://localhost:5173 is added to authorized origins in Google Console

**Issue: Login button not appearing**
- Solution: Check browser console for errors and ensure Google API script is loaded in index.html
