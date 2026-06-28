# Deployment Checklist

Follow this strict checklist when rolling the Statsang Portal into a production environment (e.g., VPS, AWS EC2, Render, Heroku).

## 1. Environment Verification
- [ ] **`DATABASE_URL`**: Verified connection string pointing to a stable PostgreSQL production instance.
- [ ] **`JWT_SECRET`**: Set to a cryptographically secure, long random string. DO NOT use the development secret.
- [ ] **`PORT`**: Correctly mapped (e.g., 5000) and exposed through firewalls.
- [ ] **Cloudinary Keys**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are present and valid for production image hosting.
- [ ] **CORS Settings**: Backend `app.js` is configured to only allow origins from your specific production frontend URL (e.g., `https://statsang-portal.com`), preventing unauthorized API abuse.

## 2. Database Initialization
- [ ] Run `npx prisma generate` to build the query engine for the production OS architecture.
- [ ] Run `npx prisma migrate deploy` to safely apply the schema to the production PostgreSQL database.
- [ ] (Optional) Run `npx prisma db seed` if a default admin account is required immediately.

## 3. Backend Deployment
- [ ] Run `npm install --production` to omit devDependencies.
- [ ] Start the backend using a process manager like PM2: `pm2 start src/server.js --name "statsang-backend"`.
- [ ] Verify the backend starts successfully by hitting the `http://<domain>/api/notices` health endpoint.

## 4. Frontend Deployment
- [ ] Ensure the frontend's Axios base URL points to the production backend (`https://api.statsang-portal.com/api`).
- [ ] Run `npm install` in the frontend directory.
- [ ] Run `npm run build` to compile the Vite application into the `dist/` directory.
- [ ] Deploy the `dist/` directory to a static host (e.g., Vercel, Netlify, or an NGINX reverse proxy).
- [ ] Verify NGINX or the static host is configured to redirect all 404s to `index.html` to support React Router SPA navigation.

## 5. Post-Deployment Verification
- [ ] Open the production URL in an incognito window.
- [ ] Log in using the default Admin credentials.
- [ ] Upload a test image to the Gallery to verify Cloudinary integration.
- [ ] Create a test Notice to verify database write capabilities.
- [ ] Verify no console errors exist on the live dashboard.
