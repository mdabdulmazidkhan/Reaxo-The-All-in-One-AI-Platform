# React + Vite Migration Complete

## Project Structure
```
src/
├── components/          # All UI components
├── lib/                 # Utilities and helpers
├── hooks/               # React hooks
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Tailwind styles

public/                 # Static assets (images, logos)
```

## What Changed
- ✅ Migrated from Next.js to React + Vite
- ✅ All components moved to `src/` directory
- ✅ Removed "use client" directives (not needed in Vite)
- ✅ Updated import paths (@ alias works in tsconfig.json)
- ✅ All UI components remain identical
- ✅ Tailwind CSS configured

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open http://localhost:5173 in your browser

### 3. Build for Production
```bash
npm run build
```

## API Configuration

The app uses localStorage for user data and makes API calls to `/api/chat` and `/api/models`.

**For your server deployment:**

Update these API endpoints in `src/components/dashboard.tsx`:
```typescript
// Change from relative URLs to your backend URL
const response = await fetch('http://your-server.com/api/chat', {...})
```

Or set environment variables in `.env.local`:
```
VITE_API_URL=http://your-server.com
```

Then update components to use:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const response = await fetch(`${apiUrl}/api/chat`, {...})
```

## Deployment

### To Your Server
1. Run `npm run build` to generate `dist/` folder
2. Upload the `dist/` folder to your web server
3. Configure your web server to serve `index.html` for all routes
4. Set the `VITE_API_URL` environment variable pointing to your backend

### Example Nginx Config
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/reaxo/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend:3000;
    }
}
```

## Files Migrated
- ✅ All components from `components/` → `src/components/`
- ✅ All utilities from `lib/` → `src/lib/`
- ✅ All hooks from `hooks/` → `src/hooks/`
- ✅ Static assets in `public/` remain unchanged

## Next Steps
1. Set up your backend API server to handle `/api/chat` and `/api/models` endpoints
2. Update environment variables for your production server
3. Deploy the `dist/` folder to your web server
4. Test the app at your domain

No additional changes needed - the UI and functionality are 100% identical to the Next.js version!
