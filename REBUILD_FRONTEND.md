# How to See Your Frontend Changes in Docker

Since you've added new dependencies and updated the code, you need to rebuild the frontend container.

## Steps to Apply Changes:

### 1. Stop the current frontend container:
```bash
docker compose stop frontend
```

### 2. Rebuild the frontend container (to install new dependencies):
```bash
docker compose build frontend
```

### 3. Start the frontend container:
```bash
docker compose up -d frontend
```

### OR - Do it all in one command:
```bash
docker compose up -d --build frontend
```

## What Changed:

1. **Added Volume Mounts**: The frontend code is now mounted as a volume, so future code changes will be automatically reflected via Vite's Hot Module Replacement (HMR).

2. **New Dependencies**: The container needs to be rebuilt to install:
   - Redux Toolkit
   - Socket.IO
   - Tailwind CSS
   - Framer Motion
   - React Router
   - And all other new dependencies

## After Rebuild:

- Code changes will be automatically reflected (HMR)
- New dependencies are installed
- The dev server will restart automatically
- Visit http://localhost:3000 to see your changes

## Troubleshooting:

If you see errors about missing modules:
```bash
# Enter the container
docker exec -it bridgelearn-frontend sh

# Install dependencies manually
npm install

# Exit container
exit
```

## View Logs:

To see the Vite dev server logs:
```bash
docker compose logs -f frontend
```

