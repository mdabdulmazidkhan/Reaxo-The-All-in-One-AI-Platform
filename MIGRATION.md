# Migration from Next.js to React + Vite

## Steps to Complete Migration

### 1. Copy Files to `src/` Directory
Run these commands in your terminal:

```bash
# Copy components
cp -r components src/

# Copy lib
cp -r lib src/

# Copy public folder
cp -r public src/public
```

### 2. Update Component Imports
In `src/components/**/*.tsx` files, update imports:

**Before (Next.js):**
```tsx
import Image from 'next/image'
```

**After (React):**
```tsx
// Remove Image imports and use <img> tags instead
```

### 3. Remove Server Component References
Remove `"use client"` directives - they're not needed in Vite/React.

### 4. Update API Calls
If using API routes, update the fetch calls to point to your backend server:

```tsx
// Example: change from relative paths to absolute URLs
const response = await fetch('/api/chat', { ... })
// To:
const response = await fetch('http://your-backend-url/api/chat', { ... })
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Run Development Server
```bash
npm run dev
```

## Key Differences from Next.js

- **No SSR/SSG** - Everything is client-side rendered
- **No Image optimization** - Use regular `<img>` tags
- **No built-in API routes** - Use a separate backend server
- **Manual routing** - Consider adding React Router if needed
- **No environment variable prefixing** - Use `VITE_` prefix for client-side env vars

## UI Components
All shadcn/ui components remain identical - no changes needed!
