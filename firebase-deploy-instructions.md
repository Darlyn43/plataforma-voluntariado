# Firebase Deployment Instructions

## Option 1: Local Machine Deployment

1. **Download this project to your local machine**
2. **Install Firebase CLI and authenticate:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

3. **Set your Firebase project ID:**
   ```bash
   firebase use --add
   # Select your Firebase project: manuchar-peru-voluntariado
   ```

4. **Build and deploy:**
   ```bash
   npm install
   npm run build
   npx vite build --outDir dist
   firebase deploy
   ```

## Option 2: GitHub Actions CI/CD

1. **Generate Firebase CI token:**
   ```bash
   firebase login:ci
   # Copy the generated token
   ```

2. **Add token to GitHub Secrets:**
   - Go to your GitHub repository
   - Settings > Secrets and variables > Actions
   - Add secret: `FIREBASE_TOKEN` with your token

3. **Create `.github/workflows/deploy.yml`:**
   ```yaml
   name: Deploy to Firebase
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - run: npx vite build --outDir dist
         - uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: '${{ secrets.GITHUB_TOKEN }}'
             firebaseServiceAccount: '${{ secrets.FIREBASE_TOKEN }}'
             projectId: manuchar-peru-voluntariado
   ```

## Option 3: Use Replit Deployments (Recommended)

Since your application is already running on Replit:

1. **Click the "Deploy" tab in Replit**
2. **Configure deployment settings:**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Environment variables are already set
3. **Click "Deploy"**
4. **Get your production URL**

Your application will be available at `https://[your-repl-name].replit.app`

## Firebase Console Setup Required

Before deployment, ensure your Firebase project has:

1. **Authentication enabled** with Email/Password
2. **Firestore database** created in test mode
3. **Authorized domains** added:
   - localhost:5000 (development)
   - your-repl-name.replit.app (production)
   - your-firebase-domain.web.app (if using Firebase hosting)

## Post-Deployment Verification

Test these features after deployment:
- User registration and login
- Profile creation and psychological assessments
- Volunteer opportunity recommendations
- Admin dashboard metrics
- Badge system functionality