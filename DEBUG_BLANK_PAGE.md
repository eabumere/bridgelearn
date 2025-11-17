# Debugging Blank Page Issue

## Steps to Debug:

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors.

### 2. Check Network Tab
Verify that all files are loading correctly (no 404 errors).

### 3. Common Issues and Fixes:

#### Issue: JavaScript Errors
- Check browser console for error messages
- Look for missing imports or module errors

#### Issue: Tailwind CSS Not Loading
- Verify `tailwind.config.js` exists
- Check `postcss.config.js` exists
- Ensure `index.css` has `@tailwind` directives

#### Issue: React Router Not Working
- Check if URL changes when navigating
- Verify routes are defined correctly

#### Issue: Redux Store Errors
- Check if store is initialized correctly
- Verify all slices are exported properly

### 4. Quick Test:

1. Open browser console (F12)
2. Type: `localStorage.getItem('authToken')`
3. Check for any error messages
4. Look at the Network tab to see if files are loading

### 5. Verify Docker Container:

```bash
# Check if container is running
docker ps | grep frontend

# Check logs
docker logs bridgelearn-frontend

# Check if node_modules are installed
docker exec -it bridgelearn-frontend ls -la /app/node_modules
```

### 6. Common Fixes:

#### Reinstall Dependencies:
```bash
docker exec -it bridgelearn-frontend npm install
```

#### Restart Container:
```bash
docker compose restart frontend
```

#### Rebuild Container:
```bash
docker compose up -d --build frontend
```

## Expected Behavior:

1. **Not Authenticated**: Should see login page at `/login`
2. **After Login**: Should redirect to dashboard based on user role
3. **Error**: Should see error boundary with error message

## Current Changes Made:

1. Added ErrorBoundary to catch React errors
2. Added inline styles to login page (bypasses Tailwind)
3. Added better error handling in login function
4. Added root element checks

## Next Steps:

1. Check browser console for specific errors
2. Verify all dependencies are installed
3. Check if Vite dev server is running correctly
4. Verify Tailwind CSS is being processed

