# Deployment Instructions

## GitHub Repository Setup

1. Create a new repository on GitHub: https://github.com/new
2. Repository name: `beyondchats-assignment`
3. Description: `AI-Powered Content Enhancement Platform`
4. Make it Public
5. Don't initialize with README (we already have one)

## Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/beyondchats-assignment.git
git branch -M main
git push -u origin main
```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts to deploy

### Option 2: Netlify
1. Drag and drop the `frontend-react/build` folder to https://netlify.com/drop
2. Or connect your GitHub repository for continuous deployment

### Option 3: GitHub Pages
1. Update `package.json` in frontend-react:
```json
"homepage": "https://YOUR_USERNAME.github.io/beyondchats-assignment",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Run: `npm run deploy`

## Live Demo URL Structure

- **Vercel**: `https://beyondchats-assignment.vercel.app`
- **Netlify**: `https://random-name.netlify.app`
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/beyondchats-assignment`

## Notes

- The mock server runs on port 8000 and won't work in static deployment
- For production, you'll need to deploy the backend separately or use a serverless function
- The frontend includes fallback mock data when backend is unavailable
